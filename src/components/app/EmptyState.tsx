import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, title, description, action, className, compact }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/80 bg-white/[0.015] text-center",
        compact ? "px-6 py-10" : "px-6 py-16",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40 mask-fade-y" />
      <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/70 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="relative text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="relative mt-1.5 max-w-sm text-[13px] leading-6 text-muted-foreground">{description}</p>
      {action && <div className="relative mt-5">{action}</div>}
    </div>
  );
}
