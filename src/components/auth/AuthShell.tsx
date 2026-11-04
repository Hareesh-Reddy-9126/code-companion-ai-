import { Link } from "react-router-dom";
import { ArrowLeft, Check, GitPullRequest, Sparkles, Terminal } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ScoreRing } from "@/components/app/ScoreRing";

interface AuthShellProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  points?: string[];
}

const defaultPoints = [
  "Structured review with scores and evidence",
  "Security findings ranked by severity",
  "Agent fix proposals you approve, not silent commits",
];

export function AuthShell({ eyebrow, title, description, children, footer, points = defaultPoints }: AuthShellProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        {/* Brand panel */}
        <aside className="relative hidden border-r border-border bg-surface lg:flex lg:flex-col">
          <div className="relative flex items-center justify-between px-8 py-8">
            <Link to="/" aria-label="Code Companion AI home">
              <Logo />
            </Link>
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Public beta
            </span>
          </div>

          <div className="relative flex flex-1 flex-col justify-center px-8 py-10 xl:px-16">
            <p className="eyebrow">Code intelligence</p>
            <h2 className="text-h2 mt-4 max-w-[14ch] text-foreground">
              Review like you have a{" "}
              <span className="font-medium text-brand">staff engineer</span> on call.
            </h2>
            <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              Code Companion turns a repository into a review you can act on:
              scores, findings and a fix proposal tied to the exact line.
            </p>

            <ul className="mt-8 space-y-4">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-brand bg-brand/10 text-brand">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            {/* Product vignette */}
            <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  <GitPullRequest className="h-3 w-3 text-brand" /> review / 184
                </span>
                <span className="rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand">
                  complete
                </span>
              </div>
              <div className="flex items-center gap-5 p-5">
                <ScoreRing score={86} size={72} strokeWidth={5} label="quality" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand/10" />
                    <span className="truncate font-mono text-[10px] text-foreground/75">
                      webhook signature not verified
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground/50">stripe.ts:42</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand/10" />
                    <span className="truncate font-mono text-[10px] text-foreground/75">
                      retry loop has no backoff cap
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground/50">retry.ts:18</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5 font-mono text-[9px] uppercase tracking-wider text-brand">
                    <Sparkles className="h-2.5 w-2.5" /> 2 fix suggestions ready
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-between border-t border-border px-8 py-5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3" /> same pipeline as the CLI
            </span>
            <span>eu-north-1</span>
          </div>
        </aside>

        {/* Form panel */}
        <main className="relative flex min-h-screen flex-col">
          <div className="flex items-center justify-between px-6 py-5 lg:justify-end lg:px-10">
            <Link to="/" className="lg:hidden" aria-label="Code Companion AI home">
              <Logo size="sm" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to site
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 pb-14 pt-4">
            <div className="w-full max-w-[380px]">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-[32px]">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

              <div className="mt-8">{children}</div>
              <div className="mt-6 text-center text-[12px] text-muted-foreground">{footer}</div>

              <p className="mt-8 text-center font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-muted-foreground/50">
                Free during public beta · no card · no automatic charges
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
