import { ScoreCard } from "@/components/ScoreCard";
import { Code2, CheckCircle, AlertTriangle, Lightbulb, ArrowLeft, Loader2, Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    if (!analysis.is_public) {
      await supabase.from("analyses").update({ is_public: true }).eq("id", analysis.id);
      setAnalysis({ ...analysis, is_public: true });
    }
    const url = `${window.location.origin}/report/${analysis.id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Shareable report link copied to clipboard." });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analysis && analysisId) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">Analysis not found.</p>
        <Button className="mt-4" onClick={() => navigate("/repositories")}>Go to Repositories</Button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AI Code Review</h1>
            <p className="text-muted-foreground text-sm mt-1">Select a repository to analyze</p>
          </div>
        </div>
        <div className="glass-card p-12 text-center">
          <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No analysis selected</h3>
          <p className="text-sm text-muted-foreground mb-4">Go to Repositories and click "Analyze" on a repo to get started.</p>
          <Button onClick={() => navigate("/repositories")}>Go to Repositories</Button>
        </div>
      </div>
    );
  }

  const report = analysis.report_json;
  const name = (analysis.repositories as any)?.repo_name || repoName || "Unknown";

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AI Code Review</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Analysis for <span className="text-primary">{name}</span>
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={shareReport}>
          <Share2 className="h-3.5 w-3.5 mr-1" /> Share
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScoreCard title="Code Quality" score={report.quality_score} icon={Code2} subtitle="Out of 100" />
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Summary</h3>
          <p className="text-sm leading-relaxed">{report.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={CheckCircle} title="Strengths" items={report.strengths || []} color="text-primary" />
        <Section icon={AlertTriangle} title="Weaknesses" items={report.weaknesses || []} color="text-warning" />
        <Section icon={Lightbulb} title="Suggestions" items={report.suggestions || []} color="text-info" />
        <Section icon={Code2} title="Refactoring Ideas" items={report.refactoring || []} color="text-muted-foreground" />
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, items, color }: { icon: any; title: string; items: string[]; color: string }) {
  if (items.length === 0) return null;
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-4 w-4 ${color}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${color.replace("text-", "bg-")} shrink-0`} />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
