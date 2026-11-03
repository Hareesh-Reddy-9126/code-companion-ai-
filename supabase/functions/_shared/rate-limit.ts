import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./env.ts";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix: string;
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<{ allowed: boolean; remaining: number; resetAt: number; retryAfterMs?: number }> {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = `${config.keyPrefix}:${identifier}`;

  // Clean old entries and count current window
  const { data: existing } = await admin
    .from("rate_limit_counters")
    .select("count, window_start")
    .eq("key", key)
    .gte("window_start", windowStart)
    .single();

  const currentCount = existing?.count || 0;
  const windowStartTime = existing?.window_start || now;

  if (currentCount >= config.maxRequests) {
    const resetAt = windowStartTime + config.windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfterMs: Math.max(0, resetAt - now),
    };
  }

  // Increment or insert
  if (existing) {
    await admin.from("rate_limit_counters").update({ count: currentCount + 1 }).eq("key", key);
  } else {
    await admin.from("rate_limit_counters").insert({ key, count: 1, window_start: now });
  }

  return {
    allowed: true,
    remaining: config.maxRequests - currentCount - 1,
    resetAt: windowStartTime + config.windowMs,
  };
}

export function getRateLimitHeaders(result: Awaited<ReturnType<typeof checkRateLimit>>) {
  return {
    "X-RateLimit-Limit": String(result.allowed ? (result.remaining + 1) : 0),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.retryAfterMs ? { "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)) } : {}),
  };
}

export const PLAN_LIMITS: Record<string, { analysesPerDay: number; apiCallsPerHour: number }> = {
  free: { analysesPerDay: 10, apiCallsPerHour: 100 },
  professional: { analysesPerDay: 5000, apiCallsPerHour: 10000 },
  enterprise: { analysesPerDay: 100000, apiCallsPerHour: 100000 },
};

export async function getOrgPlan(orgId: string): Promise<keyof typeof PLAN_LIMITS> {
  const { data } = await admin.from("organizations").select("plan").eq("id", orgId).single();
  return (data?.plan as keyof typeof PLAN_LIMITS) || "free";
}