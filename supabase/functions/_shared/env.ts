export const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
export const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
export const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
export const NVIDIA_API_KEY = Deno.env.get("NVIDIA_API_KEY") ?? "";
export const NVIDIA_BASE_URL =
  Deno.env.get("NVIDIA_BASE_URL") ?? "https://integrate.api.nvidia.com/v1";
export const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID") ?? "";
export const GITHUB_CLIENT_SECRET = Deno.env.get("GITHUB_CLIENT_SECRET") ?? "";
export const APP_URL = Deno.env.get("APP_URL") ?? "";
export const ENCRYPTION_KEY = Deno.env.get("ENCRYPTION_KEY") ?? "";
export const PRIMARY_MODEL =
  Deno.env.get("NVIDIA_PRIMARY_MODEL") ??
  "nvidia/nemotron-3-ultra-550b-a55b";
export const FALLBACK_MODEL_1 =
  Deno.env.get("NVIDIA_FALLBACK_MODEL_1") ??
  "nvidia/nemotron-3.5-lightning-30b-a3b";
export const FALLBACK_MODEL_2 =
  Deno.env.get("NVIDIA_FALLBACK_MODEL_2") ??
  "nvidia/llama-3.1-nemotron-70b-instruct";

export function requireEnv(...names: string[]): void {
  const missing = names.filter((n) => !Deno.env.get(n));
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}
