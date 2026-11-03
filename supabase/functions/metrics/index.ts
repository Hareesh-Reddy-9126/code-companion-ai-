import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "../_shared/env.ts";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getMetric(name: string, query: string, labels: Record<string, string> = {}): Promise<string> {
  const { data, error } = await admin.rpc("execute_sql", { sql: query });
  if (error || !data?.[0]) return "";
  const value = data[0].count ?? data[0].value ?? 0;
  const labelStr = Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(",");
  return `${name}{${labelStr}} ${value}\n`;
}

serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const metrics: string[] = [
    "# HELP code_companion_users_total Total registered users",
    "# TYPE code_companion_users_total gauge",
    await getMetric("code_companion_users_total", "SELECT COUNT(*) as count FROM profiles"),
    
    "# HELP code_companion_organizations_total Total organizations",
    "# TYPE code_companion_organizations_total gauge",
    await getMetric("code_companion_organizations_total", "SELECT COUNT(*) as count FROM organizations"),
    
    "# HELP code_companion_repositories_total Total connected repositories",
    "# TYPE code_companion_repositories_total gauge",
    await getMetric("code_companion_repositories_total", "SELECT COUNT(*) as count FROM repositories"),
    
    "# HELP code_companion_analyses_total Total analyses completed",
    "# TYPE code_companion_analyses_total gauge",
    await getMetric("code_companion_analyses_total", "SELECT COUNT(*) as count FROM analyses WHERE quality_score IS NOT NULL"),
    
    "# HELP code_companion_pr_reviews_total Total PR reviews completed",
    "# TYPE code_companion_pr_reviews_total gauge",
    await getMetric("code_companion_pr_reviews_total", "SELECT COUNT(*) as count FROM pr_analyses"),
    
    "# HELP code_companion_agent_runs_total Total agent runs",
    "# TYPE code_companion_agent_runs_total gauge",
    await getMetric("code_companion_agent_runs_total", "SELECT COUNT(*) as count FROM autonomous_fixes"),
    
    "# HELP code_companion_active_jobs Active analysis jobs",
    "# TYPE code_companion_active_jobs gauge",
    await getMetric("code_companion_active_jobs", "SELECT COUNT(*) as count FROM analysis_jobs WHERE status IN ('fetching', 'analyzing')"),
    
    "# HELP code_companion_errors_24h Error events in last 24h",
    "# TYPE code_companion_errors_24h gauge",
    await getMetric("code_companion_errors_24h", `SELECT COUNT(*) as count FROM error_events WHERE created_at > NOW() - INTERVAL '24 hours'`),
  ];

  // Per-org metrics (top 10 by usage)
  const { data: topOrgs } = await admin
    .from("organizations")
    .select("id, name, plan")
    .limit(10);

  if (topOrgs) {
    for (const org of topOrgs) {
      const { data: repoCount } = await admin.from("repositories").select("id", { count: "exact", head: true }).eq("org_id", org.id);
      const { data: analysisCount } = await admin.from("analyses").select("id", { count: "exact", head: true }).eq("org_id", org.id);
      const { data: jobCount } = await admin.from("analysis_jobs").select("id", { count: "exact", head: true }).eq("org_id", org.id);
      
      metrics.push(
        `# HELP code_companion_org_repositories Repositories per organization`,
        `# TYPE code_companion_org_repositories gauge`,
        `code_companion_org_repositories{org_id="${org.id}",org_name="${org.name}",plan="${org.plan}"} ${repoCount?.count ?? 0}`,
        `# HELP code_companion_org_analyses Analyses per organization`,
        `# TYPE code_companion_org_analyses gauge`,
        `code_companion_org_analyses{org_id="${org.id}",org_name="${org.name}",plan="${org.plan}"} ${analysisCount?.count ?? 0}`,
        `# HELP code_companion_org_jobs Jobs per organization`,
        `# TYPE code_companion_org_jobs gauge`,
        `code_companion_org_jobs{org_id="${org.id}",org_name="${org.name}",plan="${org.plan}"} ${jobCount?.count ?? 0}`
      );
    }
  }

  return new Response(metrics.join(""), {
    headers: { "Content-Type": "text/plain; version=0.0.4; charset=utf-8" },
  });
});