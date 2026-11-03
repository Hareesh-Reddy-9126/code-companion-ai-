import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  hint?: string;
}

export function AuthField({ icon: Icon, label, hint, className, type, id, ...props }: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? `auth-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 flex items-center justify-between text-[11.5px] font-medium text-foreground/85"
      >
        {label}
        {hint && <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">{hint}</span>}
      </label>
      <div className="group relative flex items-center">
        <Icon className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
        <input
          id={inputId}
          type={inputType}
          className={cn(
            "h-11 w-full rounded-xl border border-input bg-white/[0.02] pl-10 pr-3.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/45 transition-colors",
            "hover:border-muted-foreground/25 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/20",
            isPassword && "pr-11",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-white/[0.05] hover:text-foreground"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
