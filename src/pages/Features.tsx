import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Boxes,
  Check,
  FileCode2,
  GitBranch,
  GitPullRequest,
  Layers,
  LockKeyhole,
  MessageSquareCode,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

const capabilities = [
  {
    icon: MessageSquareCode,
    eyebrow: "AI review",
    title: "Structured review output",
    copy: "Quality, security, performance and architecture scores with strengths, weaknesses and concrete refactors — not generic prose.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Security",
    title: "Severity-ranked findings",
    copy: "Secrets, injection paths, unsafe auth and risky dependencies ranked critical to low, each tied to a file and line.",
  },
  {
    icon: Bot,
    eyebrow: "AI agent",
    title: "Agent fix suggestions",
    copy: "The agent reads the diff, drafts patches and posts them as a native GitHub review comment. A human approves every action.",
  },
  {
    icon: Boxes,
    eyebrow: "Architecture",
    title: "Architecture signals",
    copy: "Detected patterns, separation of concerns and modularity findings, explained in language a team can act on.",
  },
  {
    icon: FileCode2,
    eyebrow: "Reporting",
    title: "Shareable reports",
    copy: "Private by default. Publish a clean report with scores and findings when you want a second opinion.",
  },
  {
    icon: Terminal,
    eyebrow: "Workflow",
    title: "Dashboard, API and CLI",
    copy: "Run reviews from the web app, the CLI, or your own tooling against the same analysis pipeline.",
  },
];

export default function Features() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-36 pb-32 sm:pb-40">
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <Logo className="h-8 w-auto" />
              <span className="font-mono text-xs font-semibold text-foreground">Code Companion AI</span>
            </Link>

            <h1 className="text-h1 mx-auto mt-0 max-w-[48ch] text-foreground">
              The platform for{" "}
              <span className="font-medium text-brand">code review.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
              AI code review, security scanning, architecture intelligence and
              autonomous fix suggestions — all in one system.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  <span>Start building free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/pricing">
                  <span>Compare plans</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Capabilities
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Everything your team needs{" "}
              <span className="font-medium text-brand">to ship.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <FeatureCard key={cap.title} {...cap} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              How it works
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              From PR to fix in <span className="font-medium text-brand">three steps.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              n="01"
              icon={GitBranch}
              title="Connect GitHub"
              copy="OAuth in one click. Select repositories to analyze."
            />
            <StepCard
              n="02"
              icon={ScanSearch}
              title="Run review"
              copy="AI analyzes diffs, finds issues and ranks them by severity."
            />
            <StepCard
              n="03"
              icon={GitPullRequest}
              title="Ship the fix"
              copy="Post fix suggestions as a GitHub review comment. Merge with confidence."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">
              Ready to ship better code?
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Start reviewing <span className="font-medium text-brand">today.</span>
            </h2>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  <span>Start free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/docs">
                  <span>Read the docs</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  eyebrow,
  title,
  copy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-brand" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {eyebrow}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  copy,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-xs font-semibold text-muted-foreground">{n}</span>
        <Icon className="h-4 w-4 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}
