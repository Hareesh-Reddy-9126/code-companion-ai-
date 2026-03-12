import { Boxes, Layers, FolderTree, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArchFinding {
  category: string;
  status: "good" | "warning" | "critical";
  notes: string[];
}

const statusStyles = {
  good: { color: "text-primary", label: "Good" },
  warning: { color: "text-warning", label: "Needs Work" },
  critical: { color: "text-destructive", label: "Critical" },
};

const iconMap: Record<string, any> = {
  "Project Structure": FolderTree,
  "Separation of Concerns": Layers,
  "Modularity": Boxes,
};

export default function Architecture() {
  const [findings, setFindings] = useState<ArchFinding[]>([]);
  const [detectedPattern, setDetectedPattern] = useState("");
  const [patternDescription, setPatternDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: analyses } = await supabase
        .from("analyses")
        .select("architecture_score, report_json")
        .order("created_at", { ascending: false })
        .limit(1);

      if (analyses && analyses.length > 0) {
        const report = analyses[0].report_json as any;
        if (report?.architecture_findings) setFindings(report.architecture_findings);
        if (report?.detected_pattern) setDetectedPattern(report.detected_pattern);
        if (report?.pattern_description) setPatternDescription(report.pattern_description);
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
        <h1 className="text-2xl font-bold">Architecture Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">AI analysis of your project structure and design patterns</p>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-2">Detected Pattern</h3>
        <div className="flex items-center gap-2 text-primary">
          <Boxes className="h-5 w-5" />
          <span className="text-lg font-bold">{detectedPattern || "No analysis yet"}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {patternDescription || "Analyze a repository to detect its architecture pattern."}
        </p>
      </div>

      {findings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {findings.map((f) => {
            const style = statusStyles[f.status] || statusStyles.good;
            const IconComponent = iconMap[f.category] || Boxes;
            return (
              <div key={f.category} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">{f.category}</h3>
                  </div>
                  <span className={`text-xs font-medium ${style.color}`}>{style.label}</span>
                </div>
                <ul className="space-y-2">
                  {f.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary/50" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No architecture findings yet. Analyze a repository first.</p>
        </div>
      )}
    </div>
  );
}
