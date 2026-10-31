import { StatCard } from "@/components/StatCard";
import { ScoreCard } from "@/components/ScoreCard";
import {
  GitBranch, Shield, Zap, Code2, Clock, ArrowUpRight,
  Loader2, TrendingUp, Activity, Users, Database, Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";

interface AnalysisWithRepo {
  id: string;
  quality_score: number | null;
  security_score: number | null;
  performance_score: number | null;
  created_at: string;
  repositories: { repo_name: string; language: string | null } | null;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
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

  const avgQuality = analyses.length
    ? Math.round(analyses.reduce((sum, a) => sum + (a.quality_score || 0), 0) / analyses.length)
    : 0;
  const avgSecurity = analyses.length
    ? Math.round(analyses.reduce((sum, a) => sum + (a.security_score || 0), 0) / analyses.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your code analysis platform
          </p>
        </div>
        <Button onClick={() => navigate("/repositories")} className="enterprise-btn">
          <Code2 className="w-4 h-4 mr-2" /> Analyze Repository
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Repos Connected" value={repoCount} icon={GitBranch} change={`${analyses.length} analyzed`} />
        <StatCard title="Avg Quality Score" value={avgQuality} icon={Code2} change={analyses.length ? "Across all analyses" : "No analyses yet"} />
        <StatCard title="Security Score" value={avgSecurity} icon={Shield} change={analyses.length ? "Average" : "No data"} />
        <StatCard title="Total Analyses" value={analyses.length} icon={Activity} change="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {analyses.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No analyses yet</h3>
                <p className="text-sm text-muted-foreground mb-6">Analyze your first repository to see results here.</p>
                <Button className="enterprise-btn w-full" onClick={() => navigate("/repositories")}>
                  Analyze Repository
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <GitBranch className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{analysis.repositories?.repo_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{analysis.repositories?.language || "N/A"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{analysis.quality_score || 0}/100</div>
                      <div className="text-xs text-muted-foreground">Quality</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="enterprise-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Quality Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <div className="flex items-end h-full gap-2 px-4 py-6">
                {analyses.slice().reverse().map((a, i) => (
                  <div key={i} className="flex-1 flex flex-col items-end justify-end gap-1">
                    <div className="w-full rounded-t-lg bg-primary/20" style={{ height: `${Math.max(20, (a.quality_score || 0))}%` }} />
                    <span className="text-[10px] text-muted-foreground">{Math.max(20, (a.quality_score || 0))}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
