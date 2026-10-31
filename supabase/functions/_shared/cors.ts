import { APP_URL } from "./env.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": APP_URL || "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
};

export function corsResponse(
  body: unknown,
  init: ResponseInit = {},
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...init.headers },
  });
}

export function optionsResponse(): Response {
  return new Response(null, { headers: corsHeaders });
}

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = [APP_URL].filter(Boolean);
  return allowed.includes(origin);
}
