import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  corsResponse,
  optionsResponse,
} from "../_shared/cors.ts";
import {
  getUserIdFromRequest,
  isAdmin,
  serviceClient,
} from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") {
    return corsResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const userId = await getUserIdFromRequest(req);

    if (!(await isAdmin(userId))) {
      return corsResponse({ error: "Forbidden: admin required" }, { status: 403 });
    }

    const admin = serviceClient();

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const [
      usersRes,
      reposRes,
      analysesRes,
      jobsRes,
      errorsRes,
    ] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin.from("repositories").select("id", { count: "exact", head: true }),
      admin.from("analyses").select("id", { count: "exact", head: true }),
      admin
        .from("analysis_jobs")
        .select("status")
        .gte("created_at", dayAgo),
      admin
        .from("error_events")
        .select("id", { count: "exact", head: true }),
    ]);

    const jobStats = jobsRes.data ?? [];
    const statusCounts = jobStats.reduce(
      (acc: Record<string, number>, j) => {
        acc[j.status] = (acc[j.status] || 0) + 1;
        return acc;
      },
      {},
    );

    return corsResponse({
      users: usersRes.count ?? 0,
      repositories: reposRes.count ?? 0,
      analyses: analysesRes.count ?? 0,
      errors_24h: errorsRes.count ?? 0,
      jobs_last_24h: statusCounts,
      timestamp: now.toISOString(),
    });
  } catch (e: any) {
    console.error("admin-stats error:", e);
    return corsResponse(
      { error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 },
    );
  }
});
