import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  FileSearch,
  Lightbulb,
  Loader2,
  Lock,
  Share2,
  Sparkles,
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { ScoreRing } from "@/components/app/ScoreRing";

interface AnalysisReport {
  quality_score: number;
  security_score: number;
  performance_score: number;
  architecture_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  refactoring?: string[];
}

interface Analysis {
  id: string;
  quality_score: number | null;
  security_score: number | null;
  performance_score: number | null;
  architecture_score: number | null;
  report_json: AnalysisReport;
  is_public: boolean;
  created_at: string;
  analysis_type?: string;
  repositories: { repo_name: string } | null;
}

export default function CodeReview() {
  const [params] = useSearchParams();
  const analysisId = params.get("analysisId");
  const repoName = params.get("repo");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(!!analysisId);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!analysisId) return;
    const load = async () => {
      const { data } = await supabase
        .from("analyses")
        .select("*, repositories(repo_name)")
        .eq("id", analysisId)
        .single();
      if (data) setAnalysis(data as any);
      setLoading(false);
    };
    load();
  }, [analysisId]);

  const shareReport = async () => {
    if (!analysis) return;
    setSharing(true);
    try {
      if (!analysis.is_public) {
        const { error } = await supabase.from("analyses").update({ is_public: true }).eq("id", analysis.id);
        if (error) throw error;
        setAnalysis({ ...analysis, is_public: true });
      }
      const url = `${window.location.origin}/report/${analysis.id}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Share link copied",
        description: "Anyone with the link can read this report.",
      });
    } catch (error: any) {
      toast({ title: "Could not create the link", description: error.message, variant: "destructive" });
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  if (analysisId && !analysis) {
    return (
      <div className="relative">
        <PageHeader group="Workspace" title="AI code review" />
        <EmptyState
          icon={FileSearch}
          title="Report not found"
          description="This analysis does not exist, was deleted, or belongs to another account."
          action={
            <Button asChild>
              <Link to="/repositories">
                <span>Go to repositories <ArrowUpRight className="h-3.5 w-3.5" /></span>
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="relative">
        <PageHeader
          group="Workspace"
          title="AI code review"
          description="Select a repository and request an analysis to get a structured review."
        />
        <EmptyState
          icon={Code2}
          title="No analysis selected"
          description="Open a repository and choose Run review. Reports appear here once the analysis finishes."
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

  const report = analysis.report_json ?? ({} as AnalysisReport);
  const name = (analysis.repositories as any)?.repo_name || repoName || "Unknown repository";
  const scores = [
    { label: "Quality", value: analysis.quality_score ?? report.quality_score ?? 0, icon: Code2 },
    { label: "Security", value: analysis.security_score ?? report.security_score ?? 0, icon: Lock },
    { label: "Performance", value: analysis.performance_score ?? report.performance_score ?? 0, icon: Sparkles },
    { label: "Architecture", value: analysis.architecture_score ?? report.architecture_score ?? 0, icon: Wrench },
  ];
  const overall = Math.round(scores.reduce((sum, score) => sum + score.value, 0) / scores.length);

  return (
    <div className="relative">
      <PageHeader
        group="Workspace"
        title="AI code review"
        description={`${name} · ${formatType(analysis.analysis_type)} · ${new Date(analysis.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
            <Button variant="outline" onClick={() => navigate("/repositories")}>
              <Code2 className="h-3.5 w-3.5" /> New review
            </Button>
            <Button onClick={shareReport} disabled={sharing}>
              {sharing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
              {analysis.is_public ? "Copy public link" : "Publish report"}
            </Button>
          </>
        }
      />

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 border-b border-border pb-6">
          <div className="flex items-center gap-5">
            <ScoreRing score={overall} size={104} strokeWidth={7} label="overall" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Overall assessment
              </p>
              <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.03em] text-foreground">
                {verdict(overall)}
              </p>
              <p className="mt-1 max-w-[32ch] text-[11px] leading-5 text-muted-foreground">
                The mean of the four scores below. Generated from the repository snapshot at review time.
              </p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {scores.map((score) => (
              <div key={score.label} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <score.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
                    /100
                  </span>
                </div>
                <p className="mt-2.5 text-[22px] font-semibold leading-none tracking-[-0.05em] text-foreground">
                  {score.value}
                </p>
                <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {score.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
          <span className="inline-flex items-center gap-1.5">
            {analysis.is_public ? <Share2 className="h-3 w-3 text-brand" /> : <Lock className="h-3 w-3" />}
            {analysis.is_public ? "Public report" : "Private report"}
          </span>
          <span>{formatType(analysis.analysis_type)}</span>
          <span className="ml-auto">AI-generated · verify before shipping</span>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <h2 className="text-sm font-semibold text-foreground">Summary</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {report.summary || "No summary was returned with this analysis."}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
            What this is
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A model-generated review intended to shorten the first pass. It is
            not a security audit or a certification. Findings should be checked
            against the code before they change a release decision.
          </p>
          <div className="mt-5 pt-4 border-t border-border space-y-2">
            <InfoRow label="Repository" value={name} />
            <InfoRow label="Scores" value="4 dimensions" />
            <InfoRow label="Findings" value={`${countFindings(report)} items`} />
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ReportSection
          icon={CheckCircle2}
          title="Strengths"
          items={report.strengths || []}
          tone="text-brand"
          empty="No strengths were listed."
        />
        <ReportSection
          icon={AlertTriangle}
          title="Weaknesses"
          items={report.weaknesses || []}
          tone="text-warning"
          empty="No weaknesses were listed."
        />
        <ReportSection
          icon={Lightbulb}
          title="Suggestions"
          items={report.suggestions || []}
          tone="text-info"
          empty="No suggestions were listed."
        />
        <ReportSection
          icon={Wrench}
          title="Refactoring ideas"
          items={report.refactoring || []}
          tone="text-muted-foreground"
          empty="No refactoring ideas were listed."
        />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Want a second opinion from the agent? It can read a pull request and
          propose a fix directly on GitHub.
        </p>
        <Button variant="outline" size="sm" className="mt-4 sm:mt-0 w-full sm:w-auto" asChild>
          <Link to="/autonomous-agent">
            <span>Open the AI agent <ArrowUpRight className="h-3.5 w-3.5" /></span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ReportSection({
  icon: Icon,
  title,
  items,
  tone,
  empty,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  tone: string;
  empty: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-3.5 w-3.5 ${tone}`} />
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground/50">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground/70">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <span className={`mt-0.5 h-1 w-1 shrink-0 rounded-full ${tone.replace("text-", "bg-")}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-2">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-[10px] text-foreground/75">{value}</span>
    </div>
  );
}

function countFindings(report: AnalysisReport) {
  return (
    (report.strengths?.length || 0) +
    (report.weaknesses?.length || 0) +
    (report.suggestions?.length || 0) +
    (report.refactoring?.length || 0)
  );
}

function verdict(score: number) {
  if (score >= 85) return "Strong pass";
  if (score >= 70) return "Pass with notes";
  if (score >= 55) return "Needs attention";
  return "High risk";
}

function formatType(type?: string) {
  if (!type) return "Full review";
  return type.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
