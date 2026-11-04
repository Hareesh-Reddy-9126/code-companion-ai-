import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Gauge,
  Loader2,
  ScanSearch,
  TrendingUp,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { ScoreRing } from "@/components/app/ScoreRing";

interface PerfIssue {
  file: string;
  issue: string;
  impact: "high" | "medium" | "low";
}

const impactStyles = {
  high: { className: "border-destructive bg-destructive/10 text-destructive", label: "High" },
  medium: { className: "border-warning bg-warning/10 text-warning", label: "Medium" },
  low: { className: "border-info bg-info/10 text-info", label: "Low" },
};

export default function Performance() {
  const [perfScore, setPerfScore] = useState(0);
  const [issues, setIssues] = useState<PerfIssue[]>([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: analyses } = await supabase
        .from("analyses")
        .select("performance_score, report_json")
        .order("created_at", { ascending: false })
        .limit(5);

      if (analyses && analyses.length > 0) {
        let total = 0;
        const allIssues: PerfIssue[] = [];
        for (const analysis of analyses) {
          total += analysis.performance_score || 0;
          const report = analysis.report_json as any;
          if (report?.performance_issues) allIssues.push(...report.performance_issues);
        }
        setPerfScore(Math.round(total / analyses.length));
        setIssues(allIssues);
        setHasData(true);
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

  const header = (
    <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <ScoreRing score={perfScore} size={104} strokeWidth={7} label="performance" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Performance score
          </p>
          <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.03em] text-foreground">
            {perfScore}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            Average across the last 5 analyses
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: perfScore >= 80 ? "hsl(var(--brand))" : perfScore >= 60 ? "hsl(var(--warning))" : "hsl(var(--danger))" }} />
          {perfScore >= 80 ? "Good" : perfScore >= 60 ? "Fair" : "Needs attention"}
        </span>
        <span className="ml-auto">Source: most recent analyses</span>
      </div>
    </section>
  );

  const issuesContent = issues.length === 0 ? (
    <EmptyState
      icon={CheckCircle2}
      title="No performance issues"
      description="Your recent analyses did not surface any performance issues."
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
          <TrendingUp className="h-4 w-4 text-warning" />
          <h2 className="text-sm font-semibold text-foreground">
            Issues found ({issues.length})
          </h2>
        </div>
        <div className="space-y-3">
          {issues.map((issue, idx) => {
            const style = impactStyles[issue.impact] || impactStyles.low;
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
                    {issue.file}
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
        title="Performance"
        description="Performance scores and issues from your most recent analyses."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <span><ScanSearch className="h-3.5 w-3.5" /> Run a review</span>
            </Link>
          </Button>
        }
      />

      {!hasData ? (
        <EmptyState
          icon={Zap}
          title="No performance data yet"
          description="Run a repository review to surface performance issues and scoring."
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
          {header}
          {issuesContent}
        </>
      )}
    </div>
  );
}
