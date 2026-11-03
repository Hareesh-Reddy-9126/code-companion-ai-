import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  FileSearch,
  GitPullRequest,
  Loader2,
  MessageSquare,
  ScanSearch,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";

interface PRComment {
  file: string;
  line?: number;
  type: "bug" | "suggestion" | "improvement" | "security" | "performance";
  comment: string;
}

interface PRReport {
  summary: string;
  overall_assessment: string;
  comments: PRComment[];
  pr_title?: string;
  files_changed?: number;
  additions?: number;
  deletions?: number;
}

const typeStyles: Record<string, { icon: typeof AlertCircle; color: string; bg: string; label: string }> = {
  bug: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Bug" },
  suggestion: { icon: MessageSquare, color: "text-info", bg: "bg-info/10", label: "Suggestion" },
  improvement: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", label: "Improvement" },
  security: { icon: Shield, color: "text-warning", bg: "bg-warning/10", label: "Security" },
  performance: { icon: Zap, color: "text-info", bg: "bg-info/10", label: "Performance" },
};

const assessmentStyles: Record<string, { label: string; className: string }> = {
  approve: { label: "Approve", className: "border-primary/25 bg-primary/10 text-primary" },
  request_changes: { label: "Request changes", className: "border-destructive/25 bg-destructive/10 text-destructive" },
  comment: { label: "Comment", className: "border-info/25 bg-info/10 text-info" },
};

export default function PullRequests() {
  const [prUrl, setPrUrl] = useState("");
  const [report, setReport] = useState<PRReport | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzePR = async () => {
    if (!prUrl.includes("github.com") || !prUrl.includes("/pull/")) {
      toast({
        title: "Invalid pull request URL",
        description: "Use a URL in the form https://github.com/owner/repo/pull/42",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-pr", {
        body: { prUrl },
      });
      if (error) throw error;
      setReport(data.report);
      toast({ title: "Review complete", description: `${data.report?.comments?.length ?? 0} comments returned.` });
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const assessment = report
    ? assessmentStyles[report.overall_assessment] ?? assessmentStyles.comment
    : null;

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Workspace"
        title="Pull requests"
        description="Paste a GitHub pull request URL to review the diff. The review is returned here in the dashboard."
        actions={
          <Button variant="outline" asChild>
            <Link to="/autonomous-agent">
              <span><Bot className="h-3.5 w-3.5" /> Post a fix with the agent</span>
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-4">
          <section className="panel p-5">
            <label htmlFor="pr-url" className="mb-2 block text-[12.5px] font-medium text-foreground">
              Pull request URL
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <GitPullRequest className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="pr-url"
                  value={prUrl}
                  onChange={(event) => setPrUrl(event.target.value)}
                  placeholder="https://github.com/owner/repo/pull/42"
                  className="h-10 pl-9 font-mono text-[12px]"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !loading && prUrl) analyzePR();
                  }}
                />
              </div>
              <Button onClick={analyzePR} disabled={loading || !prUrl} className="sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reviewing
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-3.5 w-3.5" /> Review PR
                  </>
                )}
              </Button>
            </div>
            <p className="mt-2.5 text-[11px] leading-5 text-muted-foreground">
              The function fetches the diff with your connected token and returns
              structured comments. Nothing is posted to GitHub from this screen.
            </p>
          </section>

          {loading && (
            <section className="panel p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
                <div>
                  <p className="text-[13.5px] font-medium text-foreground">Fetching the diff</p>
                  <p className="mt-1 max-w-sm text-[12px] leading-6 text-muted-foreground">
                    The model reads the changed files and returns comments tied to
                    a file and line. This usually takes 20–60 seconds.
                  </p>
                </div>
              </div>
            </section>
          )}

          {report && (
            <>
              <section className="panel overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-border/60 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-[15px] font-semibold tracking-[-0.025em] text-foreground">
                        {report.pr_title || "Pull request review"}
                      </h2>
                      {assessment && (
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] ${assessment.className}`}
                        >
                          {assessment.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
                      <span>{report.files_changed ?? 0} files</span>
                      <span className="text-border">/</span>
                      <span className="text-success">+{report.additions ?? 0}</span>
                      <span className="text-destructive">−{report.deletions ?? 0}</span>
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={prUrl} target="_blank" rel="noreferrer">
                      <span>Open on GitHub <ArrowUpRight className="h-3 w-3" /></span>
                    </a>
                  </Button>
                </div>
                <div className="p-5">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                    Summary
                  </p>
                  <p className="mt-2.5 text-[13px] leading-7 text-muted-foreground">
                    {report.summary || "No summary was returned for this pull request."}
                  </p>
                </div>
              </section>

              <section className="panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                    <h2 className="text-[13.5px] font-medium text-foreground">Review comments</h2>
                  </div>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                    {report.comments?.length ?? 0} found
                  </span>
                </div>

                {(!report.comments || report.comments.length === 0) ? (
                  <div className="p-5">
                    <p className="text-[12px] text-muted-foreground">
                      The model did not return line-level comments for this diff.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {report.comments.map((comment, index) => {
                      const style = typeStyles[comment.type] || typeStyles.suggestion;
                      const Icon = style.icon;
                      return (
                        <article key={index} className="flex gap-3.5 px-5 py-4">
                          <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
                            <Icon className={`h-3.5 w-3.5 ${style.color}`} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`font-mono text-[8.5px] uppercase tracking-[0.1em] ${style.color}`}>
                                {style.label}
                              </span>
                              <code className="truncate rounded border border-border/60 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9.5px] text-muted-foreground">
                                {comment.file}
                                {comment.line ? `:${comment.line}` : ""}
                              </code>
                            </div>
                            <p className="mt-2 text-[12.5px] leading-6 text-muted-foreground">{comment.comment}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}

          {!loading && !report && (
            <EmptyState
              icon={FileSearch}
              title="No pull request reviewed yet"
              description="Paste a pull request URL above. The report stays in the dashboard and is not posted publicly."
            />
          )}
        </div>

        <aside className="space-y-4">
          <section className="panel p-5">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
              What this does
            </p>
            <div className="mt-4 space-y-3">
              {[
                { step: "01", title: "Read the diff", copy: "Fetches changed files and patch context using your GitHub token." },
                { step: "02", title: "Review in context", copy: "Returns bugs, security issues, performance notes and suggestions." },
                { step: "03", title: "Keep it private", copy: "Results are stored in your account. This screen does not comment on GitHub." },
              ].map((row) => (
                <div key={row.step} className="rounded-xl border border-border/60 bg-white/[0.015] p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-primary">{row.step}</span>
                    <p className="text-[12px] font-medium text-foreground">{row.title}</p>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{row.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel border-primary/20 bg-[linear-gradient(180deg,hsl(var(--brand)/0.05),hsl(var(--card))_52%)] p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-[12.5px] font-medium text-foreground">Want the fix on GitHub?</p>
            </div>
            <p className="mt-2 text-[11.5px] leading-5 text-muted-foreground">
              The AI agent reads the same diff and posts a fix suggestion as a
              pull request comment. It does not push commits or merge.
            </p>
            <Button size="sm" className="mt-4 w-full" asChild>
              <Link to="/autonomous-agent">
                <span>Dispatch the agent <ArrowUpRight className="h-3 w-3" /></span>
              </Link>
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}

