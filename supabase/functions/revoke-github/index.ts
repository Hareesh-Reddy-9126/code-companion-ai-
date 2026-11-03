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
import { logAudit, AUDIT_ACTIONS } from "../_shared/audit.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "POST") {
    return corsResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const userId = await getUserIdFromRequest(req);
    const admin = serviceClient();

    // Get user's org
    const { data: profile } = await admin
      .from("profiles")
      .select("org_id, github_username")
      .eq("user_id", userId)
      .single();
    const orgId = profile?.org_id;
    const githubUsername = profile?.github_username;

    // Remove encrypted token from isolated credentials table
    await admin.from("github_credentials").delete().eq("user_id", userId);

    // Clear display fields in profiles
    await admin
      .from("profiles")
      .update({ github_username: null, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    await logAudit({
      org_id: orgId,
      user_id: userId,
      action: AUDIT_ACTIONS.GITHUB_DISCONNECT,
      resource_type: "github_credentials",
      resource_id: githubUsername,
      success: true,
    });

    return corsResponse({ success: true });
  } catch (e: any) {
    console.error("revoke-github error:", e);
    return corsResponse(
      { error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 },
    );
  }
});