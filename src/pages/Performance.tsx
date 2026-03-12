import { ScoreCard } from "@/components/ScoreCard";
import { Zap, AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PerfIssue {
  file: string;
  issue: string;
  impact: "high" | "medium" | "low";
}

const impactStyles = {
  high: { color: "text-destructive", bg: "bg-destructive/10" },
  medium: { color: "text-warning", bg: "bg-warning/10" },
  low: { color: "text-info", bg: "bg-info/10" },
};

export default function Performance() {
  const [perfScore, setPerfScore] = useState(0);
  const [issues, setIssues] = useState<PerfIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: analyses } = await supabase
        .from("analyses")
        .select("performance_score, report_json")
        .order("created_at", { ascending: false })
        .limit(5);

      if (analyses && analyses.length > 0) {
        let total = 0;
        const allIssues: PerfIssue[] = [];
        for (const a of analyses) {
          total += a.performance_score || 0;
          const report = a.report_json as any;
          if (report?.performance_issues) allIssues.push(...report.performance_issues);
        }
        setPerfScore(Math.round(total / analyses.length));
        setIssues(allIssues);
      }
      setLoading(false);
    };
    load();
  }, []);

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
        <h1 className="text-2xl font-bold">Performance Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">Optimize your codebase for speed and efficiency</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard title="Performance Score" score={perfScore} icon={Zap} subtitle={perfScore >= 80 ? "Good" : "Room for improvement"} />
        <ScoreCard title="Issues Found" score={Math.max(0, 100 - issues.length * 15)} icon={AlertCircle} subtitle={`${issues.length} issues`} />
        <ScoreCard title="High Impact" score={Math.max(0, 100 - issues.filter(i => i.impact === "high").length * 25)} icon={TrendingUp} subtitle={`${issues.filter(i => i.impact === "high").length} critical`} />
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4">Optimization Opportunities</h3>
        {issues.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No performance issues found. Analyze a repository first.</p>
        ) : (
          <div className="space-y-3">
            {issues.map((item, i) => {
              const style = impactStyles[item.impact] || impactStyles.medium;
              return (
                <div key={i} className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.color} font-medium`}>{item.impact}</span>
                    <code className="text-xs text-muted-foreground">{item.file}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.issue}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
