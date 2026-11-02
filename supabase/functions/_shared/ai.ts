import {
  NVIDIA_API_KEY,
  NVIDIA_BASE_URL,
  PRIMARY_MODEL,
  FALLBACK_MODEL_1,
  FALLBACK_MODEL_2,
} from "./env.ts";

const MODELS = [PRIMARY_MODEL, FALLBACK_MODEL_1, FALLBACK_MODEL_2];
// Per-model budget keeps the whole call inside Supabase's 150s wall clock.
const REQUEST_TIMEOUT_MS = 45_000;
const TOTAL_BUDGET_MS = 130_000;

export interface AnalysisResult {
  quality_score: number;
  security_score: number;
  performance_score: number;
  architecture_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  refactoring?: string[];
  security_issues?: Array<{
    file: string;
    severity: "critical" | "high" | "medium" | "low";
    issue: string;
    line?: number;
  }>;
  overall_assessment?: "approve" | "request_changes" | "comment";
}

export interface NVIDIAError extends Error {
  status?: number;
  model?: string;
}

/**
 * Call NVIDIA NIM with automatic fallback across models.
 * Returns the parsed JSON content from the model's response.
 */
export async function callNVIDIA(
  systemPrompt: string,
  userPrompt: string,
  opts: {
    temperature?: number;
    maxTokens?: number;
    expectedJson?: boolean;
  } = {},
): Promise<{ content: string; model: string; usage?: any }> {
  const {
    temperature = 0.2,
    maxTokens = 4000,
    expectedJson = true,
  } = opts;

  const lastErrors: NVIDIAError[] = [];
  const startedAt = Date.now();

  for (const model of MODELS) {
    if (Date.now() - startedAt > TOTAL_BUDGET_MS) break;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        Math.min(REQUEST_TIMEOUT_MS, TOTAL_BUDGET_MS - (Date.now() - startedAt)),
      );

      const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        const err = new Error(
          `NVIDIA ${model} returned ${res.status}: ${errText}`,
        ) as NVIDIAError;
        err.status = res.status;
        err.model = model;
        lastErrors.push(err);
        continue;
      }

      const data = await res.json();
      const message = data.choices?.[0]?.message ?? {};
      // Reasoning models may return only `reasoning_content` when the token
      // budget is consumed before the final answer.
      const content: string = message.content ?? message.reasoning_content ?? "";

      if (!content) {
        const err = new Error(
          `NVIDIA ${model} returned empty response`,
        ) as NVIDIAError;
        err.model = model;
        lastErrors.push(err);
        continue;
      }

      return {
        content,
        model,
        usage: data.usage,
      };
    } catch (err: any) {
      if (err.name === "AbortError") {
        const timeoutErr = new Error(
          `NVIDIA ${model} request timed out`,
        ) as NVIDIAError;
        timeoutErr.status = 504;
        timeoutErr.model = model;
        lastErrors.push(timeoutErr);
      } else {
        const e = err as NVIDIAError;
        e.model = model;
        lastErrors.push(e);
      }
      continue;
    }
  }

  throw new Error(
    `All NVIDIA models failed. Last error: ${lastErrors[lastErrors.length - 1]?.message}`,
  );
}

/**
 * Extract a JSON object from model output, with repair attempts.
 */
export function extractJson(content: string): any {
  // Try direct parse
  try {
    return JSON.parse(content);
  } catch {}

  // Try to find a JSON block inside markdown fences
  const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch {}
  }

  const braceMatch = content.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {}
  }

  throw new Error("Could not parse JSON from model response");
}

/**
 * Build a structured AnalysisResult from raw model output, applying defaults.
 */
export function toAnalysisResult(raw: any): AnalysisResult {
  return {
    quality_score: clampScore(raw.quality_score),
    security_score: clampScore(raw.security_score),
    performance_score: clampScore(raw.performance_score),
    architecture_score: clampScore(raw.architecture_score),
    summary: typeof raw.summary === "string" ? raw.summary : "Analysis completed.",
    strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
    weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses : [],
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions : [],
    refactoring: Array.isArray(raw.refactoring) ? raw.refactoring : [],
    security_issues: Array.isArray(raw.security_issues) ? raw.security_issues : [],
    overall_assessment:
      raw.overall_assessment === "approve" ||
      raw.overall_assessment === "request_changes" ||
      raw.overall_assessment === "comment"
        ? raw.overall_assessment
        : "comment",
  };
}

function clampScore(v: any): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}
