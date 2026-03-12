import { Clock, Eye, GitBranch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HistoryItem {
  id: string;
  quality_score: number | null;
  analysis_type: string;
  created_at: string;
  repositories: { repo_name: string } | null;
}

export default function History() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("analyses")
        .select("id, quality_score, analysis_type, created_at, repositories(repo_name)")
        .order("created_at", { ascending: false });
      if (data) setReports(data as any);
      setLoading(false);
    };
    load();
  }, []);

  const formatType = (t: string) => {
    const map: Record<string, string> = {
      full_review: "Full Review",
      security: "Security Scan",
      performance: "Performance",
      architecture: "Architecture",
    };
    return map[t] || t;
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
        <h1 className="text-2xl font-bold">Analysis History</h1>
        <p className="text-muted-foreground text-sm mt-1">Previous code analysis reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No analyses yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Go to Repositories and analyze your first repo.</p>
          <Button onClick={() => navigate("/repositories")}>Go to Repositories</Button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider border-b border-border/50">
            <span>Repository</span>
            <span>Type</span>
            <span>Score</span>
            <span></span>
          </div>
          {reports.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 items-center hover:bg-secondary/30 transition-colors border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <GitBranch className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-sm">{(r.repositories as any)?.repo_name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                {formatType(r.analysis_type)}
              </span>
              <span className={`text-sm font-bold ${(r.quality_score || 0) >= 80 ? "text-primary" : (r.quality_score || 0) >= 60 ? "text-warning" : "text-destructive"}`}>
                {r.quality_score || 0}
              </span>
              <Button size="sm" variant="ghost" onClick={() => navigate(`/code-review?analysisId=${r.id}`)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
