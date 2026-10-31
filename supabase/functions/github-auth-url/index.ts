import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsResponse, optionsResponse } from "../_shared/cors.ts";
import { GITHUB_CLIENT_ID } from "../_shared/env.ts";

const ALLOWED_REDIRECTS = new Set([
  "http://localhost:8080/auth/github/callback",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") {
    return corsResponse({ error: "Method not allowed" }, { status: 405 });
  }

  if (!GITHUB_CLIENT_ID) {
    return corsResponse(
      { error: "GitHub OAuth not configured" },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const redirectUri = url.searchParams.get("redirect_uri") || "";

  // Validate redirect_uri against allowlist to prevent open-redirect
  if (!ALLOWED_REDIRECTS.has(redirectUri)) {
    return corsResponse(
      { error: "Invalid redirect URI" },
      { status: 400 },
    );
  }

  return corsResponse({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
  });
});
