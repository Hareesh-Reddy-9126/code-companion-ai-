import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID");
  if (!GITHUB_CLIENT_ID) {
    return new Response(JSON.stringify({ error: "GitHub OAuth not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const redirectUri = url.searchParams.get("redirect_uri") || "";

  return new Response(JSON.stringify({ client_id: GITHUB_CLIENT_ID, redirect_uri: redirectUri }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
