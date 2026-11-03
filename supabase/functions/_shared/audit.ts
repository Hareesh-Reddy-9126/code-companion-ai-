import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./env.ts";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface AuditLogEntry {
  org_id?: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await admin.from("audit_logs").insert({
      org_id: entry.org_id || null,
      user_id: entry.user_id || null,
      action: entry.action,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id || null,
      metadata: entry.metadata || {},
      ip_address: entry.ip_address || null,
      user_agent: entry.user_agent || null,
      success: entry.success,
      error_message: entry.error_message || null,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

export async function createAuditMiddleware(
  action: string,
  resourceType: string,
  getResourceId: (req: Request) => Promise<string | null> = async () => null,
) {
  return async (req: Request, handler: (req: Request) => Promise<Response>): Promise<Response> => {
    const startTime = Date.now();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";
    let userId: string | null = null;
    let orgId: string | null = null;

    try {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        const { data: { user } } = await admin.auth.getUser(token);
        userId = user?.id || null;
        if (userId) {
          const { data: profile } = await admin.from("profiles").select("org_id").eq("user_id", userId).single();
          orgId = profile?.org_id || null;
        }
      }
    } catch {}

    const resourceId = await getResourceId(req);

    try {
      const response = await handler(req);
      await logAudit({
        org_id: orgId,
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        ip_address: ip,
        user_agent: ua,
        success: response.ok,
        metadata: { duration_ms: Date.now() - startTime, status: response.status },
      });
      return response;
    } catch (error: any) {
      await logAudit({
        org_id: orgId,
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        ip_address: ip,
        user_agent: ua,
        success: false,
        error_message: error.message,
        metadata: { duration_ms: Date.now() - startTime },
      });
      throw error;
    }
  };
}

export const AUDIT_ACTIONS = {
  GITHUB_CONNECT: "github.connect",
  GITHUB_DISCONNECT: "github.disconnect",
  REPO_SYNC: "repository.sync",
  ANALYSIS_START: "analysis.start",
  ANALYSIS_COMPLETE: "analysis.complete",
  ANALYSIS_FAILED: "analysis.failed",
  PR_REVIEW_START: "pr_review.start",
  PR_REVIEW_COMPLETE: "pr_review.complete",
  AGENT_DISPATCH: "agent.dispatch",
  AGENT_COMPLETE: "agent.complete",
  ORG_CREATE: "organization.create",
  ORG_UPDATE: "organization.update",
  MEMBER_INVITE: "member.invite",
  MEMBER_REMOVE: "member.remove",
  ROLE_CHANGE: "role.change",
  SETTINGS_CHANGE: "settings.change",
  BILLING_UPDATE: "billing.update",
  EXPORT_DATA: "data.export",
  ADMIN_ACTION: "admin.action",
} as const;