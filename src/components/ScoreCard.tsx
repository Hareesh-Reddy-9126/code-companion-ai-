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
        "card card-interactive flex items-center gap-5 p-5",
        className,
      )}
    >
      <ScoreRing score={score} size="md" label="out of 100" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-foreground-muted" />
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
        </div>
        {subtitle && <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{subtitle}</p>}
      </div>
    </div>
  );
}