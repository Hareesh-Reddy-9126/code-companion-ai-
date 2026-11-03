import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  caption?: string;
  className?: string;
}

function scoreColor(score: number) {
  if (score >= 80) return "hsl(var(--primary))";
  if (score >= 60) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

export function ScoreRing({ score, size = 112, strokeWidth = 7, label, caption, className }: ScoreRingProps) {
  const id = useId().replace(/:/g, "");
  const [progress, setProgress] = useState(0);
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = scoreColor(safeScore);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(safeScore));
    return () => cancelAnimationFrame(frame);
  }, [safeScore]);

  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-semibold tracking-[-0.05em] text-foreground"
          style={{ fontSize: size * 0.26, lineHeight: 1 }}
        >
          {safeScore}
        </span>
        {label && (
          <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
        )}
      </div>
      {caption && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground">
          {caption}
        </span>
      )}
    </div>
  );
}
