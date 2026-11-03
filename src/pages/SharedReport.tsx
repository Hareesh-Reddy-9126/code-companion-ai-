import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Code2,
  FileSearch,
  Lightbulb,
  Link2,
  Loader2,
  Shield,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { ScoreRing } from "@/components/app/ScoreRing";

interface Report {
  quality_score?: number;
  security_score?: number;
  performance_score?: number;
  architecture_score?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  refactoring?: string[];
}

interface SharedAnalysis {
  id: string;
  created_at: string;
  analysis_type?: string;
  report_json: Report | null;
  repositories: { repo_name: string } | null;
}

export default function SharedReport() {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState<SharedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*, repositories(repo_name)")
        .eq("id", analysisId)
        .eq("is_public", true)
        .single();
      if (error || !data) setNotFound(true);
      else setAnalysis(data as SharedAnalysis);
      setLoading(false);
    };
    load();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo size="md" />
          <div className="h-1 w-24 overflow-hidden rounded-full bg-border">
            <div className="h-full w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Loading public report
          </span>
        </div>
      </div>
    );
  }

  if (notFound || !analysis) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative max-w-sm text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
            <FileSearch className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-[22px] font-semibold tracking-[-0.04em] text-foreground">Report not available</h1>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            This report does not exist, was deleted, or has not been published
            publicly by its owner.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild>
              <Link to="/"><span>Go home</span></Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/signup"><span>Create an account</span></Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const report = analysis.report_json ?? {};
  const repoName = analysis.repositories?.repo_name ?? "Unknown repository";
  const scores = [
    { label: "Quality", value: report.quality_score ?? 0, icon: Code2 },
    { label: "Security", value: report.security_score ?? 0, icon: Shield },
    { label: "Performance", value: report.performance_score ?? 0, icon: Zap },
    { label: "Architecture", value: report.architecture_score ?? 0, icon: Boxes },
  ];
  const overall = Math.round(scores.reduce((sum, score) => sum + score.value, 0) / scores.length);
  const sections = [
    { title: "Strengths", items: report.strengths, icon: CheckCircle2, tone: "text-primary" },
    { title: "Weaknesses", items: report.weaknesses, icon: AlertTriangle, tone: "text-warning" },
    { title: "Suggestions", items: report.suggestions, icon: Lightbulb, tone: "text-info" },
    { title: "Refactoring", items: report.refactoring, icon: Wrench, tone: "text-muted-foreground" },
  ].filter((section) => Array.isArray(section.items) && section.items.length > 0);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="absolute left-1/2 top-[-16rem] h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[110px]" />
      </div>

      <header className="relative border-b border-border/60">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" aria-label="Code Companion AI home">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-border/80 bg-white/[0.025] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:inline-flex">
              <Link2 className="h-2.5 w-2.5 text-primary" /> Public report
            </span>
            <Button size="sm" asChild>
              <Link to="/signup">
                <span>Start free <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>Public report</span>
            <span className="text-border">/</span>
            <span className="text-foreground/70">{repoName}</span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="display-md text-foreground">Repository review</h1>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                {repoName} · {formatType(analysis.analysis_type)} ·{" "}
                {new Date(analysis.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
              <Sparkles className="h-2.5 w-2.5" /> AI-generated
            </span>
          </div>

          {/* Report summary */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-panel">
            <div className="flex flex-col gap-6 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex items-center gap-5">
                <ScoreRing score={overall} size={104} strokeWidth={7} label="overall" />
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    Overall assessment
                  </p>
                  <p className="mt-1 text-[17px] font-semibold tracking-[-0.03em] text-foreground">
                    {verdict(overall)}
                  </p>
                  <p className="mt-1 max-w-[30ch] text-[11.5px] leading-5 text-muted-foreground">
                    Averaged across quality, security, performance and architecture.
                  </p>
                </div>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
                {scores.map((score) => (
                  <div key={score.label} className="rounded-xl border border-border/60 bg-white/[0.018] p-2.5">
                    <div className="flex items-center justify-between">
                      <score.icon className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-[8px] text-muted-foreground/50">/100</span>
                    </div>
                    <p className="mt-2 text-[20px] font-semibold leading-none tracking-[-0.05em] text-foreground">
                      {score.value}
                    </p>
                    <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                      {score.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {report.summary && (
              <div className="p-5 sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Summary</p>
                <p className="mt-3 text-[13.5px] leading-7 text-foreground/85">{report.summary}</p>
              </div>
            )}
          </div>

          {/* Sections */}
          {sections.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {sections.map((section) => (
                <div key={section.title} className="rounded-2xl border border-border/70 bg-card p-5">
                  <div className="flex items-center gap-2">
                    <section.icon className={`h-3.5 w-3.5 ${section.tone}`} />
                    <h2 className="text-[13px] font-medium text-foreground">{section.title}</h2>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground/50">
                      {section.items!.length}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {section.items!.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-[12px] leading-6 text-muted-foreground">
                        <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${section.tone.replace("text-", "bg-")}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 rounded-xl border border-border/60 bg-white/[0.015] p-4 text-[11px] leading-5 text-muted-foreground">
            <span className="font-medium text-foreground/80">AI disclosure:</span>{" "}
            This report was generated by a machine-learning model from the
            repository contents at the time of analysis. It may be incomplete or
            wrong, and it is not a security certification. Always review findings
            against the code.
          </p>

          {/* CTA */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.055),hsl(var(--card))_45%)] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">
                  Run this on your repository
                </p>
                <p className="mt-1.5 max-w-[46ch] text-[12.5px] leading-6 text-muted-foreground">
                  Connect GitHub, run a review, and get the same structured
                  report. Free during the public beta.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/signup">
                  <span>Start free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-[11px] text-muted-foreground sm:flex-row">
          <span>© 2026 Code Companion AI</span>
          <div className="flex items-center gap-4">
            <Link to="/security-policy" className="hover:text-foreground">Security</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
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
