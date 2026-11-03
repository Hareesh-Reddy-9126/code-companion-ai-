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
import { fetchRepoFiles } from "../_shared/github.ts";
import {
  callNVIDIA,
  extractJson,
  toAnalysisResult,
} from "../_shared/ai.ts";
import { decrypt } from "../_shared/crypto.ts";
import { logAudit, AUDIT_ACTIONS } from "../_shared/audit.ts";
import { checkRateLimit, getRateLimitHeaders, getOrgPlan, PLAN_LIMITS } from "../_shared/rate-limit.ts";
import { evaluateRules, formatRuleMatchesForPrompt } from "../_shared/rules.ts";

const SYSTEM_PROMPT = `You are a senior staff engineer at a top-tier tech company performing a comprehensive codebase review.

Analyze the repository files below and return a SINGLE JSON object with NO markdown fences, NO extra text, and NO explanations outside the JSON.

Required JSON schema:
{
  "quality_score": <number 0-100>,
  "security_score": <number 0-100>,
  "performance_score": <number 0-100>,
  "architecture_score": <number 0-100>,
  "summary": "<2-3 sentence executive summary>",
  "strengths": ["<strength 1>", "<strength 2>", "..."],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "..."],
  "suggestions": ["<actionable suggestion 1>", "..."],
  "refactoring": ["<refactoring idea 1>", "..."],
  "security_issues": [
    {"file": "<path>", "severity": "critical|high|medium|low", "issue": "<description>", "line": <optional number>}
  ],
  "performance_issues": [
    {"file": "<path>", "impact": "high|medium|low", "issue": "<description>"}
  ],
  "architecture_findings": [
    {"category": "<category>", "status": "good|warning|critical", "notes": ["<note 1>", "..."]}
  ],
  "detected_pattern": "<pattern name>",
  "pattern_description": "<description>",
  "overall_assessment": "approve|request_changes|comment"
}

Focus on: hardcoded secrets, SQL injection, XSS, weak authentication, inefficient loops, bundle size, modularity, and separation of concerns. Be concise but specific.`;

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
    const rateLimit = await checkRateLimit(`user:${userId}:analyze-repo`, {
      maxRequests: limits.analysesPerDay,
      windowMs: 86400000,
      keyPrefix: "analyze-repo",
    });

    if (!rateLimit.allowed) {
      return corsResponse(
        { error: "Daily analysis limit reached. Upgrade your plan for more." },
        { status: 429 },
        getRateLimitHeaders(rateLimit),
      );
    }

    const { repoId, analysisType = "full_review" } = await req.json();
    if (!repoId) {
      return corsResponse({ error: "Missing repoId" }, { status: 400 });
    }

    // Verify repo ownership
    const { data: repo, error: repoError } = await admin
      .from("repositories")
      .select("*")
      .eq("id", repoId)
      .eq("user_id", userId)
      .single();
    if (repoError || !repo) {
      return corsResponse({ error: "Repository not found" }, { status: 404 });
    }

    // Decrypt GitHub token from isolated credentials table
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
        repo_id: repoId,
        analysis_type: analysisType,
        status: "fetching",
      })
      .select()
      .single();
    if (jobError) throw jobError;

    await logAudit({
      org_id: orgId,
      user_id: userId,
      action: AUDIT_ACTIONS.ANALYSIS_START,
      resource_type: "repository",
      resource_id: repoId,
      metadata: { repo_name: repo.repo_name, analysis_type: analysisType },
      success: true,
    });

    // Fetch code files from GitHub
    const [owner, repoName] = repo.repo_name.split("/");
    const files = await fetchRepoFiles(owner, repoName, token, {
      maxFiles: 25,
      maxKbPerFile: 50,
      totalKbCap: 300,
    });

    if (files.length === 0) {
      await admin
        .from("analysis_jobs")
        .update({
          status: "failed",
          error_message: "No analyzable files found",
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      await logAudit({
        org_id: orgId,
        user_id: userId,
        action: AUDIT_ACTIONS.ANALYSIS_FAILED,
        resource_type: "repository",
        resource_id: repoId,
        metadata: { error: "No analyzable files found" },
        success: false,
        error_message: "No analyzable files found",
      });

      return corsResponse(
        { error: "No analyzable files found in repository" },
        { status: 400 },
        getRateLimitHeaders(rateLimit),
      );
    }

    // Evaluate custom organization rules
    const ruleMatches = orgId ? await evaluateRules(orgId, files) : [];
    const ruleContext = formatRuleMatchesForPrompt(ruleMatches);

    await admin
      .from("analysis_jobs")
      .update({
        status: "analyzing",
        started_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    // Build code context for the AI
    const codeContext = files
      .map((f) => `--- ${f.path} ---\n${f.content}`)
      .join("\n\n");

    const userPrompt = `Repository: ${repo.repo_name}
Language: ${repo.language || "Mixed"}
Files analyzed: ${files.length}
${ruleContext}

${codeContext}`;

    // Call NVIDIA AI with automatic model fallback
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
        function_name: "analyze-repo",
        user_id: userId,
        org_id: orgId,
        error_message: aiErr.message,
        context: { repo_id: repoId },
      });

      await logAudit({
        org_id: orgId,
        user_id: userId,
        action: AUDIT_ACTIONS.ANALYSIS_FAILED,
        resource_type: "repository",
        resource_id: repoId,
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

    // Parse JSON result from model
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

    // Save analysis report to database
    const now = new Date().toISOString();
    const { data: analysisRow, error: analysisError } = await admin
      .from("analyses")
      .insert({
        repo_id: repoId,
        user_id: userId,
        org_id: orgId,
        quality_score: analysis.quality_score,
        security_score: analysis.security_score,
        performance_score: analysis.performance_score,
        architecture_score: analysis.architecture_score,
        report_json: analysis,
        analysis_type: analysisType,
        is_public: false,
      })
      .select()
      .single();
    if (analysisError) throw analysisError;

    // Mark job complete
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
      action: AUDIT_ACTIONS.ANALYSIS_COMPLETE,
      resource_type: "repository",
      resource_id: repoId,
      metadata: { 
        quality: analysis.quality_score, 
        security: analysis.security_score,
        performance: analysis.performance_score,
        architecture: analysis.architecture_score,
      },
      success: true,
    });

    return corsResponse({
      analysis: {
        id: analysisRow.id,
        ...analysis,
        created_at: now,
        repository: { repo_name: repo.repo_name, language: repo.language },
      },
      job_id: job.id,
      model: result.model,
    }, getRateLimitHeaders(rateLimit));
  } catch (error: any) {
    console.error("analyze-repo error:", error);
    try {
      const userId = await getUserIdFromRequest(req).catch(() => null);
      if (userId) {
        const admin = serviceClient();
        await admin.from("error_events").insert({
          function_name: "analyze-repo",
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