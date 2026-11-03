import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down" | "flat";
  className?: string;
}

export function StatCard({ title, value, icon: Icon, change, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 transition-all duration-300 hover:border-border hover:bg-[hsl(var(--card))]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-primary/[0.04] blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </p>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-4 text-[28px] font-semibold leading-none tracking-[-0.045em] text-foreground">{value}</p>
      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {trend === "up" && <ArrowUpRight className="h-3 w-3 text-primary" />}
          {trend === "down" && <ArrowDownRight className="h-3 w-3 text-destructive" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}
