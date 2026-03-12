import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = claimsData.claims.sub;

    const { prUrl } = await req.json();
    if (!prUrl) {
      return new Response(JSON.stringify({ error: "Missing PR URL" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse PR URL: https://github.com/owner/repo/pull/123
    const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) {
      return new Response(JSON.stringify({ error: "Invalid GitHub PR URL" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const [, owner, repo, prNumber] = match;

    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: profile } = await adminClient.from("profiles").select("github_access_token").eq("user_id", userId).single();
    if (!profile?.github_access_token) {
      return new Response(JSON.stringify({ error: "GitHub not connected" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const ghHeaders = { Authorization: `Bearer ${profile.github_access_token}`, Accept: "application/vnd.github.v3+json" };

    // Fetch PR info
    const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, { headers: ghHeaders });
    if (!prRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch PR" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const prData = await prRes.json();

    // Fetch PR files
    const filesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=50`, { headers: ghHeaders });
    const files = await filesRes.json();

    // Build diff context for PR review
    const diffContext = files.map((file: any) => `--- ${file.filename} (${file.status}, +${file.additions} -${file.deletions}) ---\n${(file.patch || "").substring(0, 2000)}`).join("\n\n");

    // AI integration removed. Replace with your own PR analysis logic or connect to your preferred AI provider.
    return new Response(JSON.stringify({ message: "AI integration removed. Implement your own logic here." }), { headers: corsHeaders });
  } catch (error) {
    console.error("analyze-pr error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.stack || error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
