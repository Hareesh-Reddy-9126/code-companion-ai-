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
  improvement: { icon: CheckCircle2, color: "text-brand", bg: "bg-brand/10", label: "Improvement" },
  security: { icon: Shield, color: "text-warning", bg: "bg-warning/10", label: "Security" },
  performance: { icon: Zap, color: "text-info", bg: "bg-info/10", label: "Performance" },
};

const assessmentStyles: Record<string, { label: string; className: string }> = {
  approve: { label: "Approve", className: "border-brand bg-brand/10 text-brand" },
  request_changes: { label: "Request changes", className: "border-destructive bg-destructive/10 text-destructive" },
  comment: { label: "Comment", className: "border-info bg-info/10 text-info" },
};

export default function PullRequests() {
  const [prUrl, setPrUrl] = useState("");
  const [report, setReport] = useState<PRReport | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prUrl.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("github-app-auth", {
        body: { pr_url: prUrl },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Could not analyze PR", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <PageHeader
        group="Workspace"
        title="Pull requests"
        description="Submit a GitHub PR URL to receive an AI-powered review posted as a comment."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <span><ScanSearch className="h-3.5 w-3.5" /> Run a review</span>
            </Link>
          </Button>
        }
      />

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Submit PR
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Analyze a pull request
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              placeholder="https://github.com/owner/repo/pull/123"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Analyze <ArrowUpRight className="h-3 w-3" />
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      {report && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="h-3.5 w-3.5 text-brand" />
              <h2 className="text-sm font-semibold text-foreground">{report.pr_title || "PR Review"}</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              {report.summary}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${assessmentStyles[report.overall_assessment]?.className || assessmentStyles.comment.className}`}>
                {assessmentStyles[report.overall_assessment]?.label || "Comment"}
              </span>
              {report.files_changed && (
                <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                  {report.files_changed} files changed
                </span>
              )}
            </div>

            <div className="space-y-3">
              {report.comments.map((comment, idx) => {
                const style = typeStyles[comment.type] || typeStyles.improvement;
                return (
                  <div key={idx} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.bg}`}>
                      <style.icon className={`h-3 w-3 shrink-0 ${style.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{comment.comment}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {comment.file}{comment.line ? `:${comment.line}` : ""}
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

          <section className="rounded-xl border border-border bg-card p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
              PR stats
            </p>
            <div className="space-y-4">
              <StatRow label="Additions" value={report.additions ?? 0} tone="text-brand" />
              <StatRow label="Deletions" value={report.deletions ?? 0} tone="text-muted-foreground" />
              <StatRow label="Comments" value={report.comments.length} tone="text-info" />
              <StatRow label="Files changed" value={report.files_changed ?? 0} tone="text-muted-foreground" />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-mono text-sm ${tone}`}>{value}</span>
    </div>
  );
}
