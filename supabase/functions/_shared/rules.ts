import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./env.ts";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface Rule {
  id: string;
  org_id: string;
  name: string;
  description: string;
  language: string | null;
  pattern: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "security" | "performance" | "bug" | "style" | "best-practice";
  enabled: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RuleMatch {
  rule: Rule;
  file: string;
  line: number;
  matched_text: string;
  context_before: string;
  context_after: string;
}

const RULE_CACHE = new Map<string, Rule[]>();
const CACHE_TTL = 60000; // 1 minute

export async function getOrgRules(orgId: string): Promise<Rule[]> {
  const cached = RULE_CACHE.get(orgId);
  if (cached) return cached;

  const { data, error } = await admin
    .from("custom_rules")
    .select("*")
    .eq("org_id", orgId)
    .eq("enabled", true);

  if (error) {
    console.error("Failed to fetch rules:", error);
    return [];
  }

  const rules = (data || []) as Rule[];
  RULE_CACHE.set(orgId, rules);
  setTimeout(() => RULE_CACHE.delete(orgId), CACHE_TTL);
  return rules;
}

export async function evaluateRules(
  orgId: string,
  files: Array<{ path: string; content: string }>,
): Promise<RuleMatch[]> {
  const rules = await getOrgRules(orgId);
  if (rules.length === 0) return [];

  const matches: RuleMatch[] = [];

  for (const file of files) {
    const lines = file.content.split("\n");
    for (const rule of rules) {
      if (rule.language && !file.path.endsWith(`.${rule.language}`)) continue;

      try {
        const regex = new RegExp(rule.pattern, "gm");
        let match: RegExpExecArray | null;
        while ((match = regex.exec(file.content)) !== null) {
          const lineNumber = file.content.substring(0, match.index).split("\n").length;
          matches.push({
            rule,
            file: file.path,
            line: lineNumber,
            matched_text: match[0].substring(0, 200),
            context_before: lines[Math.max(0, lineNumber - 3)] || "",
            context_after: lines[Math.min(lines.length - 1, lineNumber + 1)] || "",
          });
          if (!regex.global) break;
        }
      } catch (e) {
        console.error(`Rule ${rule.id} regex error:`, e);
      }
    }
  }

  return matches;
}

export function formatRuleMatchesForPrompt(matches: RuleMatch[]): string {
  if (matches.length === 0) return "";

  const bySeverity = matches.reduce((acc, m) => {
    const sev = m.rule.severity;
    if (!acc[sev]) acc[sev] = [];
    acc[sev].push(m);
    return acc;
  }, {} as Record<string, RuleMatch[]>);

  let output = "\n## Custom Organization Rules (MUST CHECK)\n";
  for (const severity of ["critical", "high", "medium", "low"]) {
    const sevMatches = bySeverity[severity];
    if (!sevMatches) continue;
    output += `\n### ${severity.toUpperCase()} (${sevMatches.length} matches)\n`;
    for (const m of sevMatches.slice(0, 10)) {
      output += `- **${m.rule.name}** (${m.rule.category}) in \`${m.file}:${m.line}\`\n`;
      output += `  Pattern: \`${m.rule.pattern}\`\n`;
      output += `  Match: \`${m.matched_text}\`\n`;
      output += `  Context: ...${m.context_before}\n  > ${m.context_after}...\n`;
    }
    if (sevMatches.length > 10) {
      output += `  ... and ${sevMatches.length - 10} more matches\n`;
    }
  }
  return output;
}

export async function invalidateRuleCache(orgId: string): Promise<void> {
  RULE_CACHE.delete(orgId);
}