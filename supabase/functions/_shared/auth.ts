import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "./env.ts";

/**
 * Validate the Bearer JWT and return the user ID.
 * Throws if unauthorized.
 */
export async function getUserIdFromRequest(
  req: Request,
): Promise<string> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing bearer token");
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    throw new Error("Unauthorized: invalid token");
  }

  return data.user.id;
}

/**
 * Check if a user has the admin role.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  return data?.role === "admin";
}

/**
 * Create a service-role Supabase client (bypasses RLS). Use only in edge
 * functions for trusted operations.
 */
export function serviceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
