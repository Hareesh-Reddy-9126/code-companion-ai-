import { StatCard } from "@/components/StatCard";
import { ScoreCard } from "@/components/ScoreCard";
import { GitBranch, Shield, Zap, Code2, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AnalysisWithRepo {
  id: string;
  quality_score: number | null;
  security_score: number | null;
  performance_score: number | null;
  created_at: string;
  repositories: { repo_name: string; language: string | null } | null;
}

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<AnalysisWithRepo[]>([]);
  const [repoCount, setRepoCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [analysesRes, repoRes] = await Promise.all([
        supabase
          .from("analyses")
          .select("id, quality_score, security_score, performance_score, created_at, repositories(repo_name, language)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("repositories").select("id", { count: "exact", head: true }),
      ]);
      if (analysesRes.data) setAnalyses(analysesRes.data as any);
      setRepoCount(repoRes.count || 0);
      setLoading(false);
    };
    load();
  }, []);

  // Calculate averages with clear variable names
  const avgQuality = analyses.length
    ? Math.round(analyses.reduce((sum, analysis) => sum + (analysis.quality_score || 0), 0) / analyses.length)
    : 0;
  const avgSecurity = analyses.length
    ? Math.round(analyses.reduce((sum, analysis) => sum + (analysis.security_score || 0), 0) / analyses.length)
    : 0;
  const avgPerf = analyses.length
    ? Math.round(analyses.reduce((sum, analysis) => sum + (analysis.performance_score || 0), 0) / analyses.length)
    : 0;

  // Format date for display
  const formatDate = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diffMs / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your code analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Repos Connected" value={repoCount} icon={GitBranch} change={`${analyses.length} analyzed`} />
        <StatCard title="Avg Quality Score" value={avgQuality} icon={Code2} change={analyses.length ? "Across all analyses" : "No analyses yet"} />
        <StatCard title="Security Score" value={avgSecurity} icon={Shield} change={analyses.length ? "Average" : "No data"} />
        <StatCard title="Total Analyses" value={analyses.length} icon={Clock} change="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScoreCard title="Code Quality" score={avgQuality} icon={Code2} subtitle="Across all repos" />
        <ScoreCard title="Security" score={avgSecurity} icon={Shield} subtitle={`${analyses.length} scans`} />
        <ScoreCard title="Performance" score={avgPerf} icon={Zap} subtitle="Average score" />
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Analyses</h2>
          <button
            onClick={() => navigate("/history")}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        {analyses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No analyses yet. Go to Repositories to analyze your first repo.</p>
        ) : (
          <div className="space-y-3">
            {analyses.slice(0, 5).map((analysis) => (
              <div
                key={analysis.id}
                onClick={() => navigate(`/code-review?analysisId=${analysis.id}`)}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GitBranch className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{(analysis.repositories as any)?.repo_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {(analysis.repositories as any)?.language || "N/A"} · {formatDate(analysis.created_at)}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${(analysis.quality_score || 0) >= 80 ? "text-primary" : (analysis.quality_score || 0) >= 60 ? "text-warning" : "text-destructive"}`}>
                  {analysis.quality_score || 0}/100
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
