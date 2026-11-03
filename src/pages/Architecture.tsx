import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  FolderTree,
  Layers,
  Loader2,
  ScanSearch,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { ScoreRing } from "@/components/app/ScoreRing";

interface ArchFinding {
  category: string;
  status: "good" | "warning" | "critical";
  notes: string[];
}

const statusStyles = {
  good: { className: "border-primary/25 bg-primary/10 text-primary", label: "Good" },
  warning: { className: "border-warning/25 bg-warning/10 text-warning", label: "Needs work" },
  critical: { className: "border-destructive/25 bg-destructive/10 text-destructive", label: "Critical" },
};

const iconMap: Record<string, typeof Boxes> = {
  "Project Structure": FolderTree,
  "Separation of Concerns": Layers,
  Modularity: Boxes,
};

export default function Architecture() {
  const [findings, setFindings] = useState<ArchFinding[]>([]);
  const [detectedPattern, setDetectedPattern] = useState("");
  const [patternDescription, setPatternDescription] = useState("");
  const [score, setScore] = useState(0);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: analyses } = await supabase
        .from("analyses")
        .select("architecture_score, report_json")
        .order("created_at", { ascending: false })
        .limit(1);

      if (analyses && analyses.length > 0) {
        const analysis = analyses[0];
        const report = analysis.report_json as any;
        if (report?.architecture_findings) setFindings(report.architecture_findings);
        if (report?.detected_pattern) setDetectedPattern(report.detected_pattern);
        if (report?.pattern_description) setPatternDescription(report.pattern_description);
        setScore(analysis.architecture_score || 0);
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

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Intelligence"
        title="Architecture"
        description="A structural read of your most recent analysis: detected pattern, module boundaries and separation of concerns."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <ScanSearch className="h-3.5 w-3.5" /> Run a review
            </Link>
          </Button>
        }
      />

      {!hasData ? (
        <EmptyState
          icon={Boxes}
          title="No architecture data yet"
          description="Run a repository review to detect the architecture pattern and surface structural findings. This view uses your most recent analysis."
          action={
            <Button asChild>
              <Link to="/repositories">
                Choose a repository <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <section className="panel overflow-hidden">
            <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex items-center gap-5">
                <ScoreRing score={score} size={104} strokeWidth={7} label="structure" />
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    Detected pattern
                  </p>
                  <p className="mt-1.5 text-[19px] font-semibold tracking-[-0.035em] text-foreground">
                    {detectedPattern || "Not identified"}
                  </p>
                  <p className="mt-1 max-w-[48ch] text-[11.5px] leading-5 text-muted-foreground">
                    {patternDescription || "The model did not return a pattern description for this analysis."}
                  </p>
                </div>
              </div>

              <div className="grid flex-1 gap-2 sm:grid-cols-3">
                {[
                  { label: "Findings", value: findings.length },
                  { label: "Good", value: findings.filter((finding) => finding.status === "good").length },
                  { label: "Needs work", value: findings.filter((finding) => finding.status !== "good").length },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/60 bg-white/[0.018] p-3">
                    <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[22px] font-semibold leading-none tracking-[-0.05em] text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 px-5 py-3 sm:px-6">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                Source: most recent analysis
              </span>
              <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                Pattern detection is model-generated
              </span>
            </div>
          </section>

          {findings.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={Boxes}
              title="No structural findings"
              description="The latest analysis did not return architecture findings. Try a full review on a repository with more source files."
              action={
                <Button variant="outline" asChild>
                  <Link to="/repositories">Run another review</Link>
                </Button>
              }
            />
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {findings.map((finding) => {
                const style = statusStyles[finding.status] || statusStyles.good;
                const Icon = iconMap[finding.category] || Boxes;
                return (
                  <section key={finding.category} className="panel p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${style.className}`}
                      >
                        {style.label}
                      </span>
                    </div>
                    <h2 className="mt-4 text-[13.5px] font-medium text-foreground">{finding.category}</h2>
                    <ul className="mt-3 space-y-2.5 border-t border-border/50 pt-3">
                      {finding.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-[11.5px] leading-5 text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary/50" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}

          <p className="mt-4 rounded-xl border border-border/60 bg-white/[0.015] p-4 text-[11px] leading-5 text-muted-foreground">
            <span className="font-medium text-foreground/80">Note:</span> pattern
            detection is descriptive. It tells you what the code looks like, not
            what it should look like. Treat it as a starting point for a design
            conversation.
          </p>
        </>
      )}
    </div>
  );
}
