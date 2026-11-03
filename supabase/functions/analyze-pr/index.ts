import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  corsResponse,
  optionsResponse,
} from "../_shared/cors.ts";
import {
  getUserIdFromRequest,
  serviceClient,
} from "../_shared/auth.ts";
import { fetchPrDiff } from "../_shared/github.ts";
import {
  callNVIDIA,
  extractJson,
  toAnalysisResult,
} from "../_shared/ai.ts";
import { decrypt } from "../_shared/crypto.ts";
import { logAudit, AUDIT_ACTIONS } from "../_shared/audit.ts";
import { checkRateLimit, getRateLimitHeaders, getOrgPlan, PLAN_LIMITS } from "../_shared/rate-limit.ts";
import { evaluateRules, formatRuleMatchesForPrompt } from "../_shared/rules.ts";

const SYSTEM_PROMPT = `You are a senior staff engineer performing a pull request code review.

Review the PR diff below and return a SINGLE JSON object with NO markdown fences, NO extra text.

Required JSON schema:
{
  "summary": "<2-3 sentence summary of the changes>",
  "overall_assessment": "approve|request_changes|comment",
  "pr_title": "<PR title>",
  "files_changed": <number>,
  "additions": <number>,
  "deletions": <number>,
  "comments": [
    {
      "file": "<path>",
      "line": <optional number>,
      "type": "bug|suggestion|improvement|security|performance",
      "comment": "<specific, actionable feedback>"
    }
  ]
}

Focus on: bugs, security vulnerabilities, performance issues, code clarity, and best practices. Be specific and reference exact files/lines where possible.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "POST") {
    return corsResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const userId = await getUserIdFromRequest(req);
    const admin = serviceClient();

    // Get user's org and plan
    const { data: profile } = await admin
      .from("profiles")
      .select("org_id")
      .eq("user_id", userId)
      .single();
    const orgId = profile?.org_id;
    const plan = orgId ? await getOrgPlan(orgId) : "free";
    const limits = PLAN_LIMITS[plan];

    // Check rate limit
    const rateLimit = await checkRateLimit(`user:${userId}:analyze-pr`, {
      maxRequests: limits.analysesPerDay,
      windowMs: 86400000, // 24 hours
      keyPrefix: "analyze-pr",
    });

    if (!rateLimit.allowed) {
      return corsResponse(
        { error: "Daily analysis limit reached. Upgrade your plan for more." },
        { status: 429 },
        getRateLimitHeaders(rateLimit),
      );
    }

    const { prUrl } = await req.json();
    if (!prUrl) {
      return corsResponse({ error: "Missing PR URL" }, { status: 400 });
    }

    const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) {
      return corsResponse(
        { error: "Invalid GitHub PR URL" },
        { status: 400 },
      );
    }
    const [, owner, repo, prNumber] = match;

    // Decrypt GitHub token
    const { data: creds } = await admin
      .from("github_credentials")
      .select("encrypted_token")
      .eq("user_id", userId)
      .single();
    if (!creds?.encrypted_token) {
      return corsResponse(
        {
          error: "GitHub not connected. Please connect your GitHub account first.",
        },
        { status: 400 },
      );
    }
    const token = await decrypt(creds.encrypted_token);

    // Create analysis job
    const { data: job, error: jobError } = await admin
      .from("analysis_jobs")
      .insert({
        user_id: userId,
        org_id: orgId,
        pr_url: prUrl,
        analysis_type: "pr_review",
        status: "fetching",
      })
      .select()
      .single();
    if (jobError) throw jobError;

    await logAudit({
      org_id: orgId,
      user_id: userId,
      action: AUDIT_ACTIONS.PR_REVIEW_START,
      resource_type: "pull_request",
      resource_id: prNumber,
      metadata: { owner, repo, pr_url: prUrl },
      success: true,
    });

    // Fetch PR diff
    let prData: any;
    let filesData: any[];
    let diffContext: string;
    try {
      ({ pr: prData, files: filesData, diffContext: diffContext } =
        await fetchPrDiff(owner, repo, prNumber, token));
    } catch (ghErr: any) {
      await admin
        .from("analysis_jobs")
        .update({
          status: "failed",
          error_message: ghErr.message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      await logAudit({
        org_id: orgId,
        user_id: userId,
        action: AUDIT_ACTIONS.PR_REVIEW_COMPLETE,
        resource_type: "pull_request",
        resource_id: prNumber,
        metadata: { owner, repo, error: ghErr.message },
        success: false,
        error_message: ghErr.message,
      });

      return corsResponse(
        { error: "Failed to fetch PR from GitHub" },
        { status: 400 },
        getRateLimitHeaders(rateLimit),
      );
    }

    // Evaluate custom organization rules on changed files
    const changedFiles = filesData
      .filter((f: any) => f.patch)
      .map((f: any) => ({ path: f.filename, content: f.patch }));
    const ruleMatches = orgId ? await evaluateRules(orgId, changedFiles) : [];
    const ruleContext = formatRuleMatchesForPrompt(ruleMatches);

    await admin
      .from("analysis_jobs")
      .update({
        status: "analyzing",
        started_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    const userPrompt = `Repository: ${owner}/${repo}
PR #${prNumber}: ${prData.title || "Untitled"}
Files changed: ${filesData.length}
Additions: ${prData.additions ?? 0} | Deletions: ${prData.deletions ?? 0}
${ruleContext}

${diffContext}`;

    // Call NVIDIA AI with fallback
    let result: { content: string; model: string; usage?: any };
    try {
      result = await callNVIDIA(SYSTEM_PROMPT, userPrompt, {
        temperature: 0.2,
        maxTokens: 4000,
        expectedJson: true,
      });
    } catch (aiErr: any) {
      await admin
        .from("analysis_jobs")
        .update({
          status: "failed",
          error_message: aiErr.message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      await admin.from("error_events").insert({
        function_name: "analyze-pr",
        user_id: userId,
        org_id: orgId,
        error_message: aiErr.message,
        context: { pr_url: prUrl },
      });

      await logAudit({
        org_id: orgId,
        user_id: userId,
        action: AUDIT_ACTIONS.PR_REVIEW_COMPLETE,
        resource_type: "pull_request",
        resource_id: prNumber,
        metadata: { error: aiErr.message },
        success: false,
        error_message: aiErr.message,
      });

      return corsResponse(
        { error: "AI analysis failed. Please try again later." },
        { status: 502 },
        getRateLimitHeaders(rateLimit),
      );
    }

    // Parse JSON result
    let parsed: any;
    try {
      parsed = extractJson(result.content);
    } catch (parseErr) {
      await admin
        .from("analysis_jobs")
        .update({
          status: "failed",
          error_message: `Failed to parse AI response: ${(parseErr as Error).message}`,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      return corsResponse(
        { error: "AI response could not be parsed. Please try again." },
        { status: 502 },
        getRateLimitHeaders(rateLimit),
      );
    }

    const analysis = toAnalysisResult(parsed);

    // Save PR analysis
    const now = new Date().toISOString();
    const { data: prAnalysisRow, error: prAnalysisError } = await admin
      .from("pr_analyses")
      .insert({
        user_id: userId,
        org_id: orgId,
        pr_url: prUrl,
        pr_title: prData.title || "Untitled",
        pr_number: prData.number ?? null,
        repo_name: `${owner}/${repo}`,
        report_json: {
          ...analysis,
          files_changed: filesData.length,
          additions: prData.additions ?? 0,
          deletions: prData.deletions ?? 0,
        },
      })
      .select()
      .single();
    if (prAnalysisError) throw prAnalysisError;

    // Complete job
    await admin
      .from("analysis_jobs")
      .update({
        status: "completed",
        model_used: result.model,
        report_json: analysis,
        completed_at: now,
      })
      .eq("id", job.id);

    await logAudit({
      org_id: orgId,
      user_id: userId,
      action: AUDIT_ACTIONS.PR_REVIEW_COMPLETE,
      resource_type: "pull_request",
      resource_id: prNumber,
      metadata: { assessment: analysis.overall_assessment, findings: analysis.comments?.length || 0 },
      success: true,
    });

    return corsResponse({
      report: {
        ...analysis,
        pr_title: prData.title || "Untitled",
        files_changed: filesData.length,
        additions: prData.additions ?? 0,
        deletions: prData.deletions ?? 0,
        id: prAnalysisRow.id,
        created_at: now,
      },
      job_id: job.id,
      model: result.model,
    }, getRateLimitHeaders(rateLimit));
  } catch (error: any) {
    console.error("analyze-pr error:", error);
    try {
      const userId = await getUserIdFromRequest(req).catch(() => null);
      if (userId) {
        const admin = serviceClient();
        await admin.from("error_events").insert({
          function_name: "analyze-pr",
          user_id: userId,
          error_message: error.message,
          stack_trace: error.stack,
        });
      }
    } catch {}
    return corsResponse(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
});