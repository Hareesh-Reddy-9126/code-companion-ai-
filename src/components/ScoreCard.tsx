import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreRing } from "@/components/app/ScoreRing";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  subtitle?: string;
  className?: string;
}

export function ScoreCard({ title, score, icon: Icon, subtitle, className }: ScoreCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-5 rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-border",
        className,
      )}
    >
      <ScoreRing score={score} size={76} strokeWidth={5.5} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="truncate text-[13px] font-medium text-foreground">{title}</p>
        </div>
        {subtitle && <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{subtitle}</p>}
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
          out of 100
        </p>
      </div>
    </div>
  );
}
