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
import {
  exchangeGitHubCode,
  getGitHubUser,
  listGitHubRepos,
} from "../_shared/github.ts";
import { encrypt } from "../_shared/crypto.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "POST") {
    return corsResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const userId = await getUserIdFromRequest(req);
    const admin = serviceClient();

    const { code } = await req.json();
    if (!code) {
      return corsResponse({ error: "Missing code" }, { status: 400 });
    }

    // Exchange code for GitHub access token
    const tokenData = await exchangeGitHubCode(code);
    if (tokenData.error) {
      return corsResponse(
        { error: tokenData.error_description || tokenData.error },
        { status: 400 },
      );
    }
    const accessToken = tokenData.access_token;

    // Get GitHub user info
    const ghUser = await getGitHubUser(accessToken);

    // Encrypt and store token in isolated credentials table
    const encryptedToken = await encrypt(accessToken);

    const { error: upsertError } = await admin
      .from("github_credentials")
      .upsert(
        {
          user_id: userId,
          github_username: ghUser.login,
          encrypted_token: encryptedToken,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    if (upsertError) throw upsertError;

    // Also update profiles for display convenience (non-sensitive fields only)
    await admin
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          github_username: ghUser.login,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    // Fetch and sync repositories (paginated)
    const repos = await listGitHubRepos(accessToken);

    const syncPromises = repos.map((repo) =>
      admin
        .from("repositories")
        .upsert(
          {
            user_id: userId,
            repo_name: repo.full_name,
            repo_url: repo.html_url,
            description: repo.description ?? null,
            language: repo.language ?? null,
            stars: repo.stargazers_count ?? 0,
            forks: repo.forks_count ?? 0,
            last_updated: repo.updated_at ?? null,
            github_repo_id: repo.id ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,github_repo_id" },
        ),
    );
    await Promise.all(syncPromises);

    return corsResponse({
      success: true,
      username: ghUser.login,
      repoCount: repos.length,
    });
  } catch (e: any) {
    console.error("github-callback error:", e);
    return corsResponse(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
});
