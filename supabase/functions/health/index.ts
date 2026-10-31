import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsResponse, optionsResponse } from "../_shared/cors.ts";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../_shared/env.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  const checks: Record<string, string> = {};
  let healthy = true;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { error } = await supabase.from("profiles").select("count", { head: true });
    if (error) {
      checks.database = `error: ${error.message}`;
      healthy = false;
    } else {
      checks.database = "ok";
    }
  } catch (e: any) {
    checks.database = `error: ${e.message}`;
    healthy = false;
  }

  checks.timestamp = new Date().toISOString();

  return corsResponse(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: healthy ? 200 : 503 },
  );
});
