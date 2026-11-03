import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  tone?: "signal" | "ink";
  size?: "sm" | "md" | "lg";
}

const markSize = {
  sm: "h-7 w-7 rounded-[8px]",
  md: "h-8 w-8 rounded-[9px]",
  lg: "h-10 w-10 rounded-[11px]",
};

const svgSize = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function LogoMark({ className, tone = "signal", size = "md" }: Omit<LogoProps, "showWordmark">) {
  const isSignal = tone === "signal";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        isSignal
          ? "bg-primary text-primary-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset]"
          : "bg-foreground text-background",
        markSize[size],
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={svgSize[size]}
      >
        <path d="M9.5 7.5 5 12l4.5 4.5" />
        <path d="M14.5 7.5 19 12l-4.5 4.5" />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export function Logo({ className, showWordmark = true, tone = "signal", size = "md" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} size={size} />
      {showWordmark && (
        <span className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold tracking-[-0.035em] text-foreground">
            Code Companion
          </span>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
            AI
          </span>
        </span>
      )}
    </span>
  );
}
