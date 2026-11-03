import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsResponse } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/auth.ts";
import { logAudit, AUDIT_ACTIONS } from "../_shared/audit.ts";
import { checkRateLimit, getRateLimitHeaders, getOrgPlan, PLAN_LIMITS } from "../_shared/rate-limit.ts";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GITHUB_APP_WEBHOOK_SECRET } from "../_shared/env.ts";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifySignature(payload: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(GITHUB_APP_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const sigBytes = new Uint8Array(signature.replace("sha256=", "").match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  return crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(payload));
}

async function createCheckRun(installationToken: string, owner: string, repo: string, headSha: string, name: string, status: "queued" | "in_progress" | "completed", conclusion?: "success" | "failure" | "neutral" | "cancelled" | "timed_out" | "action_required", output?: any) {
  const body: any = { name, head_sha: headSha, status };
  if (conclusion) body.conclusion = conclusion;
  if (output) body.output = output;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/check-runs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "code-companion-ai",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create check run failed: ${res.status} ${err}`);
  }
  return res.json();
}

async function updateCheckRun(installationToken: string, owner: string, repo: string, checkRunId: number, status: "in_progress" | "completed", conclusion?: "success" | "failure" | "neutral" | "cancelled" | "timed_out" | "action_required", output?: any) {
  const body: any = { status };
  if (conclusion) body.conclusion = conclusion;
  if (output) body.output = output;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/check-runs/${checkRunId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "code-companion-ai",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Update check run failed: ${res.status} ${err}`);
  }
  return res.json();
}

async function createReviewComment(installationToken: string, owner: string, repo: string, prNumber: number, body: string, commitId: string, path: string, line: number, side: "RIGHT" | "LEFT" = "RIGHT") {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "code-companion-ai",
    },
    body: JSON.stringify({ body, commit_id: commitId, path, line, side }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create review comment failed: ${res.status} ${err}`);
  }
  return res.json();
}

async function createPullRequestReview(installationToken: string, owner: string, repo: string, prNumber: number, body: string, event: "COMMENT" | "APPROVE" | "REQUEST_CHANGES", comments: Array<{ path: string; line: number; body: string }>) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "code-companion-ai",
    },
    body: JSON.stringify({ body, event, comments: comments.map(c => ({ path: c.path, line: c.line, body: c.body, side: "RIGHT" })) }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create PR review failed: ${res.status} ${err}`);
  }
  return res.json();
}

async function handlePullRequestEvent(payload: any, installationToken: string, orgId: string) {
  const { action, pull_request, repository } = payload;
  if (!["opened", "synchronize", "reopened"].includes(action)) return;

  const owner = repository.owner.login;
  const repo = repository.name;
  const prNumber = pull_request.number;
  const headSha = pull_request.head.sha;
  const prTitle = pull_request.title;

  const checkRun = await createCheckRun(installationToken, owner, repo, headSha, "Code Companion AI Review", "in_progress");

  const { data: repoRow } = await admin
    .from("repositories")
    .select("id, user_id")
    .eq("github_repo_id", repository.id)
    .single();

  if (!repoRow) {
    await updateCheckRun(installationToken, owner, repo, checkRun.id, "completed", "neutral", {
      title: "Repository not connected",
      summary: "Connect this repository in Code Companion to enable reviews",
    });
    return;
  }

  await logAudit({
    org_id: orgId,
    user_id: repoRow.user_id,
    action: AUDIT_ACTIONS.PR_REVIEW_START,
    resource_type: "pull_request",
    resource_id: String(prNumber),
    metadata: { owner, repo, pr_number: prNumber, head_sha: headSha },
    success: true,
  });

  try {
    const { data: creds } = await admin
      .from("github_app_installations")
      .select("encrypted_token")
      .eq("organization_id", orgId)
      .single();

    const token = creds?.encrypted_token || installationToken;

    const { pr, files, diffContext } = await fetchPrDiff(owner, repo, String(prNumber), token);

    const { callNVIDIA, extractJson, toAnalysisResult } = await import("../_shared/ai.ts");

    const SYSTEM_PROMPT = `You are a senior staff engineer performing a pull request code review.
Return a SINGLE JSON object with NO markdown fences.

Required JSON schema:
{
  "summary": "<2-3 sentence summary>",
  "overall_assessment": "approve|request_changes|comment",
  "pr_title": "<PR title>",
  "files_changed": <number>,
  "additions": <number>,
  "deletions": <number>,
  "comments": [
    { "file": "<path>", "line": <number>, "type": "bug|suggestion|improvement|security|performance", "comment": "<specific feedback>" }
  ]
}`;

    const result = await callNVIDIA(SYSTEM_PROMPT, `Repository: ${owner}/${repo}\nPR #${prNumber}: ${prTitle}\nFiles: ${files.length}\n\n${diffContext}`, {
      temperature: 0.2, maxTokens: 4000, expectedJson: true,
    });

    const parsed = extractJson(result.content);
    const analysis = toAnalysisResult(parsed);

    const reviewComments = (analysis.comments || []).map(c => ({
      path: c.file,
      line: c.line || 1,
      body: `**${c.type.toUpperCase()}** (${c.type})\n\n${c.comment}`,
    }));

    const event = analysis.overall_assessment === "approve" ? "APPROVE" :
                  analysis.overall_assessment === "request_changes" ? "REQUEST_CHANGES" : "COMMENT";

    await createPullRequestReview(installationToken, owner, repo, prNumber, analysis.summary, event, reviewComments);

    await admin.from("pr_analyses").insert({
      user_id: repoRow.user_id,
      org_id: orgId,
      pr_url: pull_request.html_url,
      pr_title: prTitle,
      pr_number: prNumber,
      repo_name: `${owner}/${repo}`,
      github_repo_id: repository.id,
      report_json: { ...analysis, files_changed: files.length, additions: pr.additions, deletions: pr.deletions },
      check_run_id: checkRun.id,
    });

    await updateCheckRun(installationToken, owner, repo, checkRun.id, "completed", event === "APPROVE" ? "success" : event === "REQUEST_CHANGES" ? "failure" : "neutral", {
      title: "Code Companion AI Review Complete",
      summary: analysis.summary,
      text: `Found ${analysis.comments?.length || 0} issues. Overall: ${analysis.overall_assessment}.`,
    });

    await logAudit({
      org_id: orgId,
      user_id: repoRow.user_id,
      action: AUDIT_ACTIONS.PR_REVIEW_COMPLETE,
      resource_type: "pull_request",
      resource_id: String(prNumber),
      metadata: { assessment: analysis.overall_assessment, findings: analysis.comments?.length || 0 },
      success: true,
    });
  } catch (e: any) {
    await updateCheckRun(installationToken, owner, repo, checkRun.id, "completed", "failure", {
      title: "Review Failed",
      summary: e.message,
    });
    await logAudit({
      org_id: orgId,
      action: AUDIT_ACTIONS.PR_REVIEW_COMPLETE,
      resource_type: "pull_request",
      resource_id: String(prNumber),
      metadata: { error: e.message },
      success: false,
      error_message: e.message,
    });
  }
}

async function handleCheckRunEvent(payload: any, installationToken: string, orgId: string) {
  const { action, check_run, repository } = payload;
  if (action !== "rerequested") return;

  const owner = repository.owner.login;
  const repo = repository.name;
  const headSha = check_run.head_sha;
  const prNumber = check_run.pull_requests?.[0]?.number;

  if (!prNumber) return;

  await handlePullRequestEvent({ action: "synchronize", pull_request: { number: prNumber, head: { sha: headSha }, title: check_run.name }, repository }, installationToken, orgId);
}

serve(async (req) => {
  if (req.method !== "POST") return corsResponse({ error: "Method not allowed" }, { status: 405 });

  const signature = req.headers.get("x-hub-signature-256") || "";
  const payloadText = await req.text();
  const payload = JSON.parse(payloadText);

  if (!await verifySignature(payloadText, signature)) {
    return corsResponse({ error: "Invalid signature" }, { status: 401 });
  }

  const installationId = payload.installation?.id?.toString();
  if (!installationId) return corsResponse({ error: "No installation" }, { status: 400 });

  const { data: installation } = await admin
    .from("github_app_installations")
    .select("organization_id, encrypted_token")
    .eq("installation_id", installationId)
    .single();

  if (!installation) return corsResponse({ error: "Installation not registered" }, { status: 404 });

  const orgId = installation.organization_id;
  const installationToken = installation.encrypted_token;

  const plan = await getOrgPlan(orgId);
  const limit = PLAN_LIMITS[plan].apiCallsPerHour;
  const rateLimit = await checkRateLimit(`org:${orgId}:webhook`, { maxRequests: limit, windowMs: 3600000, keyPrefix: "webhook" });

  if (!rateLimit.allowed) {
    return corsResponse({ error: "Rate limited" }, { status: 429 });
  }

  const event = req.headers.get("x-github-event");

  try {
    switch (event) {
      case "pull_request":
        await handlePullRequestEvent(payload, installationToken, orgId);
        break;
      case "check_run":
        await handleCheckRunEvent(payload, installationToken, orgId);
        break;
    }
    return corsResponse({ success: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return corsResponse({ error: e.message }, { status: 500 });
  }
});