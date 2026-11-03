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
        "stat-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="stat-label">{title}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-surface">
          <Icon className="h-4 w-4 text-foreground-muted" />
        </span>
      </div>
      <p className="stat-value">{value}</p>
      {change && (
        <div className={cn("stat-change", trend === "up" ? "stat-change-positive" : trend === "down" ? "stat-change-negative" : "stat-change-neutral")}>
          {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
          {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}