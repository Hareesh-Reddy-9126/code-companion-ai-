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
  high: { className: "border-destructive/25 bg-destructive/10 text-destructive", label: "High" },
  medium: { className: "border-warning/25 bg-warning/10 text-warning", label: "Medium" },
  low: { className: "border-info/25 bg-info/10 text-info", label: "Low" },
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
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const high = issues.filter((issue) => issue.impact === "high").length;
  const medium = issues.filter((issue) => issue.impact === "medium").length;
  const low = issues.filter((issue) => issue.impact === "low").length;

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Intelligence"
        title="Performance"
        description="Performance signals from your five most recent analyses. The review looks for inefficient patterns in the code, not runtime telemetry."
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
          description="Run a repository review to collect performance findings. There is no runtime profiler connected — the model reviews the code itself."
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
                <ScoreRing score={perfScore} size={104} strokeWidth={7} label="performance" />
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    Average performance score
                  </p>
                  <p className="mt-1.5 text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                    {perfScore >= 80 ? "Efficient" : perfScore >= 60 ? "Room to improve" : "Needs attention"}
                  </p>
                  <p className="mt-1 max-w-[32ch] text-[11.5px] leading-5 text-muted-foreground">
                    Averaged across the last five analyses. Findings are
                    code-level observations, not measured latency.
                  </p>
                </div>
              </div>

              <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric label="Findings" value={issues.length} icon={AlertCircle} />
                <Metric label="High impact" value={high} icon={TrendingUp} tone="destructive" />
                <Metric label="Medium" value={medium} icon={Gauge} tone="warning" />
                <Metric label="Low" value={low} icon={CheckCircle2} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 sm:px-6">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                Source: last 5 analyses
              </span>
              <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                Static review · no runtime profiler
              </span>
            </div>
          </section>

          <section className="panel mt-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <h2 className="text-[13.5px] font-medium text-foreground">Optimization opportunities</h2>
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
                <p className="mt-4 text-[13.5px] font-medium text-foreground">No performance issues flagged</p>
                <p className="mt-1 max-w-sm text-[12px] leading-6 text-muted-foreground">
                  The last five analyses did not return performance findings.
                  Profiling a running application is a separate exercise.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {issues.map((issue, index) => {
                  const style = impactStyles[issue.impact] || impactStyles.medium;
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
                          <Zap className="h-3 w-3" /> {issue.file}
                        </code>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <p className="mt-4 rounded-xl border border-border/60 bg-white/[0.015] p-4 text-[11px] leading-5 text-muted-foreground">
            <span className="font-medium text-foreground/80">Scope:</span> these
            findings come from reading the code. Measure before optimizing — a
            flagged loop may not be your bottleneck.
          </p>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: number;
  icon: typeof Zap;
  tone?: "neutral" | "warning" | "destructive";
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-white/[0.018] p-3">
      <div className="flex items-center justify-between">
        <Icon
          className={`h-3.5 w-3.5 ${
            tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-muted-foreground"
          }`}
        />
        <span className="font-mono text-[8px] text-muted-foreground/50">count</span>
      </div>
      <p className="mt-2.5 text-[22px] font-semibold leading-none tracking-[-0.05em] text-foreground">{value}</p>
      <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
    </div>
  );
}
