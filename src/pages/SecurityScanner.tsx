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
  critical: { className: "border-destructive/25 bg-destructive/10 text-destructive", label: "Critical" },
  high: { className: "border-warning/25 bg-warning/10 text-warning", label: "High" },
  medium: { className: "border-info/25 bg-info/10 text-info", label: "Medium" },
  low: { className: "border-border bg-secondary text-muted-foreground", label: "Low" },
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
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const score = data?.security_score || 0;
  const issues = data?.issues || [];
  const counts = {
    critical: issues.filter((issue) => issue.severity === "critical").length,
    high: issues.filter((issue) => issue.severity === "high").length,
    medium: issues.filter((issue) => issue.severity === "medium").length,
    low: issues.filter((issue) => issue.severity === "low").length,
  };

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Intelligence"
        title="Security"
        description="Security findings from your five most recent analyses, aggregated by severity. Reviews run on demand."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <span><ScanSearch className="h-3.5 w-3.5" /> Run a review</span>
            </Link>
          </Button>
        }
      />

      {!data ? (
        <EmptyState
          icon={Shield}
          title="No security data yet"
          description="Run a repository review to collect security findings. The scanner reads the security issues returned by the analysis pipeline."
          action={
            <Button asChild>
              <Link to="/repositories">
                <span>Choose a repository <ArrowUpRight className="h-3.5 w-3.5" /></span>
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <section className="panel overflow-hidden">
            <div className="flex flex-col gap-6 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex items-center gap-5">
                <ScoreRing score={score} size={104} strokeWidth={7} label="security" />
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    Average security score
                  </p>
                  <p className="mt-1.5 text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                    {score >= 80 ? "Healthy" : score >= 60 ? "Needs review" : "Elevated risk"}
                  </p>
                  <p className="mt-1 max-w-[32ch] text-[11.5px] leading-5 text-muted-foreground">
                    Averaged across the last five analyses. Findings below are
                    aggregated, not deduplicated.
                  </p>
                </div>
              </div>

              <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(counts) as Array<keyof typeof counts>).map((severity) => (
                  <div key={severity} className="rounded-xl border border-border/60 bg-white/[0.018] p-3">
                    <span
                      className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] ${severityStyles[severity].className}`}
                    >
                      {severityStyles[severity].label}
                    </span>
                    <p className="mt-2.5 text-[22px] font-semibold leading-none tracking-[-0.05em] text-foreground">
                      {counts[severity]}
                    </p>
                    <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                      findings
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 sm:px-6">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                Source: last 5 analyses
              </span>
              <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                AI findings · not a security certification
              </span>
            </div>
          </section>

          <section className="panel mt-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <h2 className="text-[13.5px] font-medium text-foreground">Flagged issues</h2>
              </div>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                {issues.length} total
              </span>
            </div>

            {issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <p className="mt-4 text-[13.5px] font-medium text-foreground">No issues flagged</p>
                <p className="mt-1 max-w-sm text-[12px] leading-6 text-muted-foreground">
                  The last five analyses returned no security issues. That is not
                  proof the code is secure — it means the model did not flag
                  anything in the reviewed files.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {issues.map((issue, index) => {
                  const style = severityStyles[issue.severity] || severityStyles.medium;
                  return (
                    <div key={index} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-start">
                      <span
                        className={`w-fit shrink-0 rounded border px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] ${style.className}`}
                      >
                        {style.label}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] leading-6 text-foreground/85">{issue.issue}</p>
                        <code className="mt-1 inline-flex items-center gap-1 font-mono text-[9.5px] text-muted-foreground">
                          <FileWarning className="h-3 w-3" />
                          {issue.file}
                          {issue.line ? `:${issue.line}` : ""}
                        </code>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <p className="mt-4 rounded-xl border border-border/60 bg-white/[0.015] p-4 text-[11px] leading-5 text-muted-foreground">
            <span className="font-medium text-foreground/80">How to read this:</span>{" "}
            severity is assigned by the model, not by a rule engine or a human
            auditor. Confirm each finding in the code before treating it as a
            release blocker.
          </p>
        </>
      )}
    </div>
  );
}
