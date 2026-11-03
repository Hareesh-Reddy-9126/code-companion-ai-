import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  label?: string;
  hint?: string;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error = false,
      icon,
      label,
      hint,
      errorMessage,
      disabled,
      readOnly,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || React.useId();

    return (
      <div className="field w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="field-label"
          >
            {label}
            {props.required && <span className="field-required" />}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="input-icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "input",
              icon && "input-with-icon",
              error && "input-error",
              className,
            )}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={error}
            aria-describedby={errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {errorMessage && (
          <p
            id={`${inputId}-error`}
            className="field-error"
            role="alert"
          >
            <svg className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {errorMessage}
          </p>
        )}
        {hint && !errorMessage && (
          <p
            id={`${inputId}-hint`}
            className="field-hint"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };