import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScoreCard } from "@/components/ScoreCard";
import { Code2, Shield, Zap, Boxes, CheckCircle, AlertTriangle, Lightbulb, Loader2, Bot } from "lucide-react";

export default function SharedReport() {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
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
      else setAnalysis(data);
      setLoading(false);
    };
    load();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-muted-foreground">This report doesn't exist or isn't shared publicly.</p>
        </div>
      </div>
    );
  }

  const report = analysis.report_json;
  const repoName = analysis.repositories?.repo_name || "Unknown";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Bot className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold">Code<span className="text-primary">Insight</span></span>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Code Review Report</h1>
          <p className="text-muted-foreground text-sm mt-1">Repository: <span className="text-primary">{repoName}</span></p>
          <p className="text-xs text-muted-foreground mt-1">{new Date(analysis.created_at).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard title="Quality" score={report.quality_score} icon={Code2} subtitle="" />
          <ScoreCard title="Security" score={report.security_score} icon={Shield} subtitle="" />
          <ScoreCard title="Performance" score={report.performance_score} icon={Zap} subtitle="" />
          <ScoreCard title="Architecture" score={report.architecture_score} icon={Boxes} subtitle="" />
        </div>

        {report.summary && (
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{report.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.strengths?.length > 0 && (
            <Section icon={CheckCircle} title="Strengths" items={report.strengths} color="text-primary" />
          )}
          {report.weaknesses?.length > 0 && (
            <Section icon={AlertTriangle} title="Weaknesses" items={report.weaknesses} color="text-warning" />
          )}
          {report.suggestions?.length > 0 && (
            <Section icon={Lightbulb} title="Suggestions" items={report.suggestions} color="text-info" />
          )}
          {report.refactoring?.length > 0 && (
            <Section icon={Code2} title="Refactoring" items={report.refactoring} color="text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, items, color }: { icon: any; title: string; items: string[]; color: string }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-4 w-4 ${color}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${color.replace("text-", "bg-")} shrink-0`} />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
