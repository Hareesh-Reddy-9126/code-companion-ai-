import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  subtitle?: string;
  className?: string;
}

export function ScoreCard({ title, score, icon: Icon, subtitle, className }: ScoreCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-primary";
    if (s >= 60) return "text-warning";
    return "text-destructive";
  };

  const getBarColor = (s: number) => {
    if (s >= 80) return "bg-primary";
    if (s >= 60) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className={cn("glass-card-hover p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground/60 mt-0.5">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className={cn("text-3xl font-bold", getScoreColor(score))}>{score}</div>
      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", getBarColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
