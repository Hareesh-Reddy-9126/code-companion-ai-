import { GitPullRequest, AlertCircle, CheckCircle, MessageSquare, Shield, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const typeStyles: Record<string, { icon: any; color: string; bg: string }> = {
  bug: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  suggestion: { icon: MessageSquare, color: "text-info", bg: "bg-info/10" },
  improvement: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
  security: { icon: Shield, color: "text-warning", bg: "bg-warning/10" },
  performance: { icon: Zap, color: "text-info", bg: "bg-info/10" },
};

export default function PullRequests() {
  const [prUrl, setPrUrl] = useState("");
  const [report, setReport] = useState<PRReport | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzePR = async () => {
    if (!prUrl.includes("github.com") || !prUrl.includes("/pull/")) {
      toast({ title: "Invalid URL", description: "Please enter a valid GitHub PR URL", variant: "destructive" });
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
      toast({ title: "PR analysis complete!" });
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Pull Request Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered review of pull request changes</p>
      </div>

      <div className="glass-card p-5">
        <label className="text-sm font-medium mb-2 block">Pull Request URL</label>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 border border-border/50">
            <GitPullRequest className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              placeholder="https://github.com/user/repo/pull/42"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
            />
          </div>
          <Button onClick={analyzePR} disabled={loading || !prUrl}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</> : "Analyze PR"}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="glass-card p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Fetching PR changes and running AI review...</p>
        </div>
      )}

      {report && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <GitPullRequest className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">{report.pr_title || "Pull Request"}</h3>
                <p className="text-xs text-muted-foreground">
                  {report.files_changed} files changed · +{report.additions} −{report.deletions}
                </p>
              </div>
            </div>
            <div className={`inline-block text-xs px-2 py-1 rounded-full mb-3 ${
              report.overall_assessment === "approve" ? "bg-primary/10 text-primary" :
              report.overall_assessment === "request_changes" ? "bg-destructive/10 text-destructive" :
              "bg-info/10 text-info"
            }`}>
              {report.overall_assessment === "approve" ? "✓ Approved" :
               report.overall_assessment === "request_changes" ? "✗ Changes Requested" : "💬 Comment"}
            </div>
            <p className="text-sm text-muted-foreground">{report.summary}</p>
          </div>

          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Review Comments</h3>
          <div className="space-y-3">
            {report.comments.map((c, i) => {
              const style = typeStyles[c.type] || typeStyles.suggestion;
              const IconComponent = style.icon;
              return (
                <div key={i} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded ${style.bg}`}>
                      <IconComponent className={`h-3.5 w-3.5 ${style.color}`} />
                    </div>
                    <code className="text-xs text-muted-foreground">
                      {c.file}{c.line ? `:${c.line}` : ""}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
