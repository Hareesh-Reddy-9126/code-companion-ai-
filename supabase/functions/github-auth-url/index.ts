import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsResponse, optionsResponse } from "../_shared/cors.ts";
import { APP_URL, GITHUB_CLIENT_ID } from "../_shared/env.ts";

function allowedRedirects(): Set<string> {
  const allowed = new Set<string>([
    "http://localhost:8080/auth/github/callback",
    "http://localhost:5173/auth/github/callback",
  ]);
  if (APP_URL) {
    allowed.add(`${APP_URL.replace(/\/$/, "")}/auth/github/callback`);
  }
  return allowed;
}

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
  if (!allowedRedirects().has(redirectUri)) {
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
