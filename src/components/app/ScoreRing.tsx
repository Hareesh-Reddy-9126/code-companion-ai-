import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl" | number;
  strokeWidth?: number;
  label?: string;
  caption?: string;
  className?: string;
}

function scoreColor(score: number) {
  if (score >= 80) return "hsl(var(--brand))";
  if (score >= 60) return "hsl(var(--warning))";
  return "hsl(var(--danger))";
}

const SIZE_MAP = {
  sm: 56,
  md: 80,
  lg: 104,
  xl: 140,
} as const;

const DEFAULT_STROKE_WIDTH = 4;

export function ScoreRing({ score, size = "md", strokeWidth = DEFAULT_STROKE_WIDTH, label, caption, className }: ScoreRingProps) {
  const id = useId().replace(/:/g, "");
  const [progress, setProgress] = useState(0);
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size];
  const radius = (pixelSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = scoreColor(safeScore);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(safeScore));
    return () => cancelAnimationFrame(frame);
  }, [safeScore]);

  return (
    <div className={cn("score-ring relative inline-flex shrink-0 items-center justify-center", className)}>
      <svg
        className="score-ring-svg"
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          className="score-ring-track"
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="score-ring-progress"
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ stroke: `url(#ring-${id})`, transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="score-ring-value font-mono weight-bold tracking-tight text-foreground"
          style={{ fontSize: pixelSize * 0.28, lineHeight: 1 }}
        >
          {safeScore}
        </span>
        {label && (
          <span className="score-ring-caption font-mono text-2xs uppercase tracking-wider text-foreground-subtle mt-1">
            {label}
          </span>
        )}
      </div>
      {caption && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-2xs text-foreground-subtle">
          {caption}
        </span>
      )}
    </div>
  );
}