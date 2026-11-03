import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  group?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ group, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-5 pb-7 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {group && (
          <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>{group}</span>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground/70">{title}</span>
          </div>
        )}
        <h1 className="text-[26px] font-semibold tracking-[-0.04em] text-foreground sm:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
}
