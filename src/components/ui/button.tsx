import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = {
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-all duration-120 ease-out rounded-md border border-transparent cursor-pointer disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  variants: {
    primary: "btn btn-primary btn-md",
    secondary: "btn btn-secondary btn-md",
    ghost: "btn btn-ghost btn-md",
    danger: "btn btn-danger btn-md",
    outline: "btn btn-outline btn-md",
    "brand-ghost": "btn btn-brand-ghost btn-md",
  },
  sizes: {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  },
  widths: {
    block: "btn-block",
  },
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    React.ComponentPropsWithoutRef<typeof Slot> {
  variant?: keyof typeof buttonVariants.variants;
  size?: keyof typeof buttonVariants.sizes;
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isLoading = loading || disabled;

    const buttonClasses = cn(
      buttonVariants.base,
      buttonVariants.variants[variant],
      buttonVariants.sizes[size],
      fullWidth && buttonVariants.widths.block,
      isLoading && "btn-loading",
      className,
    );

    // Radix <Slot> requires exactly one child, so the spinner is only
    // rendered on the native button path. asChild children (Link/a) must
    // be passed through as a single element or Slot throws
    // React.Children.only.
    const spinner = loading && (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    if (asChild) {
      return (
        <Comp ref={ref} className={buttonClasses} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={buttonClasses}
        disabled={isLoading}
        aria-busy={loading}
        {...props}
      >
        {spinner}
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };