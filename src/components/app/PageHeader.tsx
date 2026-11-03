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
          <div className="mb-2.5 flex items-center gap-1.5 font-mono text-2xs weight-medium uppercase tracking-wider text-foreground-subtle">
            <span>{group}</span>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground/70">{title}</span>
          </div>
        )}
        <h1 className="text-h2 weight-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground-muted">{description}</p>
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
      className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
}