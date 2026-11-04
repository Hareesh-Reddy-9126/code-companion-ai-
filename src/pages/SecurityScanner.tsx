import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileWarning,
  Loader2,
  ScanSearch,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { ScoreRing } from "@/components/app/ScoreRing";

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
  critical: { className: "border-destructive bg-destructive/10 text-destructive", label: "Critical" },
  high: { className: "border-warning bg-warning/10 text-warning", label: "High" },
  medium: { className: "border-info bg-info/10 text-info", label: "Medium" },
  low: { className: "border-border bg-card text-muted-foreground", label: "Low" },
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
        for (const analysis of analyses) {
          totalScore += analysis.security_score || 0;
          const report = analysis.report_json as any;
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
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="relative">
        <PageHeader
          group="Intelligence"
          title="Security scanner"
          description="Severity-ranked security findings from your most recent analyses."
          actions={
            <Button variant="outline" asChild>
              <Link to="/repositories">
                <span><ScanSearch className="h-3.5 w-3.5" /> Run a review</span>
              </Link>
            </Button>
          }
        />
        <EmptyState
          icon={Shield}
          title="No security data yet"
          description="Run a repository review to scan for security issues."
          action={
            <Button asChild>
              <Link to="/repositories">
                <span>Choose a repository <ArrowUpRight className="h-3.5 w-3.5" /></span>
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const { security_score: score, issues } = data;

  const issuesContent = issues.length === 0 ? (
    <EmptyState
      icon={Shield}
      title="No security findings"
      description="Your recent analyses did not surface any security issues. Run a review on a repository with more source files."
      action={
        <Button variant="outline" asChild>
          <Link to="/repositories">Run another review</Link>
        </Button>
      }
    />
  ) : (
    <div className="mt-8 grid gap-4">
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h2 className="text-sm font-semibold text-foreground">
            Issues found ({issues.length})
          </h2>
        </div>
        <div className="space-y-3">
          {issues.map((issue, idx) => {
            const style = severityStyles[issue.severity] || severityStyles.low;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.className}`}>
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{issue.issue}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {issue.file}{issue.line ? `:${issue.line}` : ""}
                  </p>
                  <span className={`rounded-full border px-1.5 py-0 font-mono text-[8px] uppercase tracking-wider ${style.className}`}>
                    {style.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );

  return (
    <div className="relative">
      <PageHeader
        group="Intelligence"
        title="Security scanner"
        description="Severity-ranked security findings from your most recent analyses."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <span><ScanSearch className="h-3.5 w-3.5" /> Run a review</span>
            </Link>
          </Button>
        }
      />

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <ScoreRing score={score} size={104} strokeWidth={7} label="security" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Security score
            </p>
            <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.03em] text-foreground">
              {score}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Average across the last 5 analyses
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: score >= 80 ? "hsl(var(--brand))" : score >= 60 ? "hsl(var(--warning))" : "hsl(var(--danger))" }} />
            {score >= 80 ? "Good" : score >= 60 ? "Fair" : "Needs attention"}
          </span>
          <span className="ml-auto">Source: most recent analyses</span>
        </div>
      </section>

      {issuesContent}
    </div>
  );
}
