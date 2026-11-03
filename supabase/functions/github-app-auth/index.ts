import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsResponse, optionsResponse } from "../_shared/cors.ts";
import { getUserIdFromRequest, serviceClient } from "../_shared/auth.ts";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_APP_WEBHOOK_SECRET, APP_URL } from "../_shared/env.ts";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function generateAppJWT(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + 600,
    iss: GITHUB_APP_ID,
  };

  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = btoa(JSON.stringify(payload));
  const unsigned = `${header}.${claims}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    new TextEncoder().encode(GITHUB_APP_PRIVATE_KEY.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").replace(/\s/g, "")),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const encodedSig = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${unsigned}.${encodedSig}`;
}

async function getInstallationToken(installationId: string): Promise<string> {
  const jwt = await generateAppJWT();
  const res = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "code-companion-ai",
    },
  });
  if (!res.ok) throw new Error(`Failed to get installation token: ${res.statusText}`);
  const data = await res.json();
  return data.token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "POST") {
    return corsResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const userId = await getUserIdFromRequest(req);
    const { installation_id, organization_id } = await req.json();

    if (!installation_id || !organization_id) {
      return corsResponse({ error: "Missing installation_id or organization_id" }, { status: 400 });
    }

    const token = await getInstallationToken(installation_id);

    const { error } = await admin
      .from("github_app_installations")
      .upsert({
        organization_id,
        installation_id,
        app_id: GITHUB_APP_ID,
        encrypted_token: token,
        updated_at: new Date().toISOString(),
      }, { onConflict: "organization_id" });

    if (error) throw error;

    return corsResponse({ success: true, installation_id });
  } catch (e: any) {
    console.error("github-app-auth error:", e);
    return corsResponse({ error: e.message }, { status: 500 });
  }
});