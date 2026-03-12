import { ScoreCard } from "@/components/ScoreCard";
import { Shield, AlertTriangle, FileWarning, Lock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SecurityIssue {
  file: string;
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  line?: number;
}

interface SecurityData {
  security_score: number;
  issues: SecurityIssue[];
}

const severityStyles = {
  critical: { color: "text-destructive", bg: "bg-destructive/10", label: "Critical" },
  high: { color: "text-warning", bg: "bg-warning/10", label: "High" },
  medium: { color: "text-info", bg: "bg-info/10", label: "Medium" },
  low: { color: "text-muted-foreground", bg: "bg-secondary", label: "Low" },
};

export default function SecurityScanner() {
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: analyses } = await supabase
        .from("analyses")
        .select("security_score, report_json")
        .order("created_at", { ascending: false })
        .limit(5);

      if (analyses && analyses.length > 0) {
        const allIssues: SecurityIssue[] = [];
        let totalScore = 0;
        for (const a of analyses) {
          totalScore += a.security_score || 0;
          const report = a.report_json as any;
          if (report?.security_issues) {
            allIssues.push(...report.security_issues);
          }
        }
        setData({
          security_score: Math.round(totalScore / analyses.length),
          issues: allIssues,
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const score = data?.security_score || 0;
  const issues = data?.issues || [];
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const highCount = issues.filter((i) => i.severity === "high").length;

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Security Scanner</h1>
        <p className="text-muted-foreground text-sm mt-1">Identify vulnerabilities and security risks</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard title="Security Score" score={score} icon={Shield} subtitle={score >= 80 ? "Secure" : "Needs attention"} />
        <ScoreCard title="Critical Issues" score={100 - criticalCount * 20} icon={Lock} subtitle={`${criticalCount} critical`} />
        <ScoreCard title="High Issues" score={100 - highCount * 10} icon={FileWarning} subtitle={`${highCount} high severity`} />
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="font-semibold">Flagged Issues</h3>
          <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">{issues.length} found</span>
        </div>
        {issues.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No security issues found. Analyze a repository first.</p>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, i) => {
              const style = severityStyles[issue.severity] || severityStyles.medium;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.color} font-medium shrink-0 mt-0.5`}>
                    {style.label}
                  </span>
                  <div className="min-w-0">
                    <code className="text-xs text-muted-foreground">{issue.file}{issue.line ? `:${issue.line}` : ""}</code>
                    <p className="text-sm mt-0.5">{issue.issue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
