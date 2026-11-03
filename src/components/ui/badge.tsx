import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "neutral" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", size = "md", dot = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "badge inline-flex items-center gap-1.5 font-mono weight-medium uppercase tracking-wider",
          {
            "badge-primary": variant === "primary",
            "badge-success": variant === "success",
            "badge-warning": variant === "warning",
            "badge-danger": variant === "danger",
            "badge-neutral": variant === "neutral",
            "badge-outline": variant === "outline",
            "text-2xs": size === "sm",
            "text-xs": size === "md",
            "px-2 py-0.5": size === "sm",
            "px-2.5 py-0.5": size === "md",
          },
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              {
                "bg-brand": variant === "primary",
                "bg-success": variant === "success",
                "bg-warning": variant === "warning",
                "bg-danger": variant === "danger",
                "bg-foreground-subtle": variant === "neutral" || variant === "outline",
              },
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };