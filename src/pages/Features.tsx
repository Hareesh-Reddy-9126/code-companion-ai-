import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  CircleDot,
  Code2,
  Cpu,
  FileCode2,
  GitBranch,
  GitPullRequest,
  Globe2,
  Layers,
  LockKeyhole,
  MessageSquareCode,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ScoreRing } from "@/components/app/ScoreRing";

const sections = [
  { id: "review", label: "AI review" },
  { id: "security", label: "Security" },
  { id: "agent", label: "AI agent" },
  { id: "architecture", label: "Architecture" },
  { id: "workflow", label: "Workflow" },
];

const capabilities = [
  {
    icon: MessageSquareCode,
    title: "Structured review output",
    copy: "Quality, security, performance and architecture scores with strengths, weaknesses and concrete refactors — not generic prose.",
  },
  {
    icon: ShieldCheck,
    title: "Severity-ranked findings",
    copy: "Secrets, injection paths, unsafe auth and risky dependencies ranked critical to low, each tied to a file and line.",
  },
  {
    icon: Bot,
    title: "Agent fix suggestions",
    copy: "The agent reads the diff, drafts patches and posts them as a native GitHub review comment. A human approves every commit.",
  },
  {
    icon: Boxes,
    title: "Architecture signals",
    copy: "Detected patterns, separation of concerns and modularity findings, explained in language a team can act on.",
  },
  {
    icon: FileCode2,
    title: "Shareable reports",
    copy: "Private by default. Publish a clean report with scores and findings when you want a second opinion.",
  },
  {
    icon: Terminal,
    title: "Dashboard, API and CLI",
    copy: "Run reviews from the web app, the CLI, or your own tooling against the same analysis pipeline.",
  },
];

export default function Features() {
  return (
    <div className="relative overflow-hidden">
      <PageBackdrop />

      {/* Hero */}
      <section className="relative pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="chip">
              <Layers className="h-3 w-3 text-primary" />
              Platform
            </span>
            <h1 className="display-lg mt-6 text-foreground">
              One system for the whole{" "}
              <span className="font-display italic text-primary">review.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[56ch] text-[15px] leading-7 text-muted-foreground sm:text-[16px]">
              Repository intelligence, security analysis, architecture review
              and an AI agent that proposes the fix — connected to the same
              evidence trail.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/signup">
                  <span>Start free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs">
                  <span>Read the docs <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Anchor nav */}
      <div className="sticky top-16 z-30 border-y border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="container-page scrollbar-none flex items-center gap-1 overflow-x-auto py-2.5">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
          <span className="ml-auto hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Public beta
          </span>
        </div>
      </div>

      {/* Review */}
      <section id="review" className="scroll-mt-32 py-20 sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">AI code review</p>
              <h2 className="display-md mt-4 max-w-[17ch] text-foreground">
                A staff engineer's read on every{" "}
                <span className="font-display italic text-primary">diff.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[14px] leading-7 text-muted-foreground">
                Run an on-demand review against a repository or a pull request.
                Code Companion returns structured findings you can route,
                assign and fix — with the reasoning attached.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Quality, security, performance and architecture scores",
                  "Strengths, weaknesses and refactoring suggestions",
                  "Findings linked to the file and line that caused them",
                  "GitHub PR comments posted as a native review",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-6 text-muted-foreground">
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={100}>
              <ReviewPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="scroll-mt-32 border-y border-border/60 bg-[#070808] py-20 sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal delay={80} className="order-2 lg:order-1">
              <SecurityPanel />
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <p className="eyebrow">Security</p>
              <h2 className="display-md mt-4 max-w-[16ch] text-foreground">
                Security that reads{" "}
                <span className="font-display italic text-primary">context.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[14px] leading-7 text-muted-foreground">
                Pattern matching finds what's obvious. Contextual analysis finds
                what's dangerous: an unverified webhook, a permissive query, a
                secret that shouldn't be in the build.
              </p>
              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {[
                  { icon: LockKeyhole, label: "Hardcoded secrets" },
                  { icon: DatabaseIcon, label: "Injection paths" },
                  { icon: ShieldCheck, label: "Broken access control" },
                  { icon: Globe2, label: "Unsafe dependencies" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-white/[0.015] px-3 py-2.5"
                  >
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[12px] text-foreground/85">{item.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Agent */}
      <section id="agent" className="scroll-mt-32 py-20 sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">AI agent</p>
              <h2 className="display-md mt-4 max-w-[17ch] text-foreground">
                From finding to fix, inside the{" "}
                <span className="font-display italic text-primary">pull request.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[14px] leading-7 text-muted-foreground">
                The agent reads the pull request diff, identifies the issues
                worth fixing, drafts a patch and posts the suggestion as a
                GitHub review comment.
              </p>
              <div className="mt-6 rounded-xl border border-warning/20 bg-warning/[0.04] p-4">
                <p className="flex items-center gap-2 text-[12px] font-medium text-foreground">
                  <CircleDot className="h-3.5 w-3.5 text-warning" />
                  Human-in-the-loop by design
                </p>
                <p className="mt-1.5 text-[12px] leading-6 text-muted-foreground">
                  The agent does not push commits or merge pull requests. You
                  review the suggestion, then decide what ships.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <AgentPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="scroll-mt-32 border-y border-border/60 bg-[#070808] py-20 sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal delay={80} className="order-2 lg:order-1">
              <ArchitecturePanel />
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <p className="eyebrow">Architecture</p>
              <h2 className="display-md mt-4 max-w-[16ch] text-foreground">
                See the shape of the{" "}
                <span className="font-display italic text-primary">system.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[14px] leading-7 text-muted-foreground">
                Structure is where velocity is won or lost. Code Companion
                identifies the pattern your codebase is converging on and where
                the boundaries are leaking.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Project structure and module boundaries",
                  "Separation of concerns across layers",
                  "Modularity and coupling signals",
                  "Detected pattern with a plain-language rationale",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-6 text-muted-foreground">
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="scroll-mt-32 py-20 sm:py-28">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Workflow</p>
            <h2 className="display-md mt-4 text-foreground">
              Fits where your team already{" "}
              <span className="font-display italic text-primary">works.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[48ch] text-[14px] leading-7 text-muted-foreground">
              Use the dashboard for the full picture, the CLI for a fast local
              check, or the edge functions for your own automation.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {[
              {
                icon: GitBranch,
                tag: "web",
                title: "Dashboard",
                copy: "Connect GitHub, browse repositories, kick off a review and read the report in one place.",
              },
              {
                icon: Terminal,
                tag: "terminal",
                title: "CLI",
                copy: "ccai login, analyze, pr and fix. Built for developers who would rather not leave the shell.",
              },
              {
                icon: Code2,
                tag: "api",
                title: "Edge functions",
                copy: "Invoke the same analysis pipeline with an authenticated Supabase session from your own tooling.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-[12.5px] leading-5 text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capability grid */}
      <section className="border-t border-border/60 py-20 sm:py-24">
        <div className="container-page">
          <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Capabilities</p>
              <h2 className="display-md mt-4 text-foreground">Everything in the box.</h2>
            </div>
            <p className="max-w-[36ch] text-[13px] leading-6 text-muted-foreground">
              No add-on modules, no per-seat unlock. During the beta, every
              capability below is available.
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="group bg-card p-6 transition-colors hover:bg-[#0C0E0F]">
                <item.icon className="h-4 w-4 text-primary" />
                <h3 className="mt-4 text-[13.5px] font-medium text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60 bg-bone text-bone-foreground">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)]" />
        <div className="container-page relative py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                Get started
              </p>
              <h2 className="display-lg mt-4 max-w-[16ch]">
                Review better.{" "}
                <span className="font-display italic">Ship faster.</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-[14px] leading-7 text-black/60">
                Create an account, connect a repository and run your first
                analysis. No card, no trial timer.
              </p>
            </Reveal>
            <Reveal delay={100} className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button size="lg" asChild>
                <Link to="/signup">
                  <span>Start free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-black/20 bg-transparent text-bone-foreground hover:bg-black/[0.05]"
                asChild
              >
                <Link to="/pricing"><span>See pricing</span></Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PageBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="absolute left-1/2 top-[-16rem] h-[30rem] w-[48rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[110px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

function ReviewPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#0A0C0D] shadow-panel">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
          <GitPullRequest className="h-3 w-3 text-primary" /> review / pr 184
        </span>
        <span className="rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-success">
          complete
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-5">
          <ScoreRing score={86} size={96} strokeWidth={6} label="quality" />
          <div className="flex-1 space-y-2.5">
            {[
              { label: "Security", value: 94 },
              { label: "Performance", value: 78 },
              { label: "Architecture", value: 82 },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="w-[74px] text-[10px] text-muted-foreground">{row.label}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                  <span className="block h-full rounded-full bg-primary/70" style={{ width: `${row.value}%` }} />
                </span>
                <span className="font-mono text-[9.5px] text-foreground/70">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {[
            {
              tone: "high",
              file: "api/webhooks/stripe.ts:42",
              title: "Webhook signature is not verified",
            },
            {
              tone: "medium",
              file: "lib/retry.ts:18",
              title: "Retry loop can amplify failures",
            },
            {
              tone: "low",
              file: "routes/health.ts:7",
              title: "Verbose error response in production",
            },
          ].map((row) => (
            <div
              key={row.title}
              className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-white/[0.018] px-3 py-2"
            >
              <span
                className={`rounded border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] ${
                  row.tone === "high"
                    ? "border-destructive/25 bg-destructive/10 text-destructive"
                    : row.tone === "medium"
                      ? "border-warning/25 bg-warning/10 text-warning"
                      : "border-border bg-secondary text-muted-foreground"
                }`}
              >
                {row.tone}
              </span>
              <span className="min-w-0 flex-1 truncate text-[10.5px] text-foreground/85">{row.title}</span>
              <span className="hidden font-mono text-[8px] text-muted-foreground/50 sm:block">{row.file}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-border/60 bg-[#08090A] p-3">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">summary</p>
          <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
            Solid implementation overall. The webhook handler trusts the raw
            payload, which is the one issue worth blocking on.
          </p>
        </div>
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#0A0C0D] shadow-panel">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-primary" /> security findings
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">7 issues</span>
      </div>
      <div className="space-y-2 p-4">
        {[
          { level: "critical", title: "Hardcoded API key", file: "scripts/seed.ts:12", note: "Revoke and rotate before deploy." },
          { level: "high", title: "Unverified webhook payload", file: "api/stripe.ts:42", note: "Verify the signature server-side." },
          { level: "medium", title: "Missing authorization check", file: "routes/admin.ts:8", note: "Gate on role, not on route prefix." },
          { level: "low", title: "Verbose error response", file: "lib/errors.ts:31", note: "Return a generic message in production." },
        ].map((issue) => (
          <div key={issue.title} className="rounded-xl border border-border/60 bg-white/[0.018] p-3">
            <div className="flex items-center gap-2">
              <span
                className={`rounded border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] ${
                  issue.level === "critical"
                    ? "border-destructive/25 bg-destructive/10 text-destructive"
                    : issue.level === "high"
                      ? "border-warning/25 bg-warning/10 text-warning"
                      : issue.level === "medium"
                        ? "border-info/25 bg-info/10 text-info"
                        : "border-border bg-secondary text-muted-foreground"
                }`}
              >
                {issue.level}
              </span>
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground/90">{issue.title}</span>
              <span className="hidden font-mono text-[8px] text-muted-foreground/50 sm:block">{issue.file}</span>
            </div>
            <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground">{issue.note}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border/60 bg-white/[0.015] px-4 py-2.5">
        <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted-foreground/60">
          analysis complete
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[8.5px] text-success">
          <CheckCircle2 className="h-3 w-3" /> report stored
        </span>
      </div>
    </div>
  );
}

function AgentPanel() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-[#0A0C0D] p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> agent run
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
        </div>
        <div className="mt-4 space-y-3">
          {[
            { label: "Read the diff", done: true },
            { label: "Identify issues", done: true },
            { label: "Draft the patch", done: true },
            { label: "Post review comment", done: false },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  step.done
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {step.done ? <Check className="h-2.5 w-2.5" /> : <CircleDot className="h-2.5 w-2.5" />}
              </span>
              <span className={`text-[11px] ${step.done ? "text-foreground/80" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-border/60 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">confidence</span>
            <span className="font-mono text-[9.5px] text-primary">96%</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
            <div className="h-full w-[96%] rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/[0.035] p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">proposed fix</span>
          <span className="font-mono text-[8.5px] text-primary">stripe.ts</span>
        </div>
        <pre className="mt-4 overflow-hidden font-mono text-[9px] leading-5 text-foreground/75">
{`const signature =
  req.headers.get(
    "stripe-signature"
  );

const event =
  stripe.webhooks
    .constructEvent(
      body,
      signature,
      secret
    );`}
        </pre>
        <div className="mt-4 rounded-lg border border-border/60 bg-black/20 p-2.5">
          <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/60">
            posted as
          </p>
          <p className="mt-1 text-[10px] text-foreground/80">GitHub review comment</p>
          <p className="mt-1 font-mono text-[8px] text-muted-foreground/50">not a commit · not a merge</p>
        </div>
      </div>
    </div>
  );
}

function ArchitecturePanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#0A0C0D] shadow-panel">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
          <Boxes className="h-3 w-3 text-primary" /> architecture map
        </span>
        <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-primary">
          layered
        </span>
      </div>
      <div className="p-5">
        <svg viewBox="0 0 340 160" className="w-full" fill="none" aria-hidden="true">
          <g stroke="hsl(var(--border))" strokeWidth="1">
            <path d="M70 80h38M178 80h38M216 55v-18h42M216 105v18h42" />
            <path d="M108 80v-28h58M108 80v28h58" strokeDasharray="3 4" />
          </g>
          <g>
            <rect x="10" y="63" width="60" height="34" rx="8" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <text x="40" y="84" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontFamily="JetBrains Mono">web</text>

            <rect x="108" y="46" width="70" height="68" rx="10" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--primary)/0.3)" />
            <text x="143" y="75" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8" fontFamily="JetBrains Mono">api</text>
            <text x="143" y="89" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="JetBrains Mono">domain</text>

            <rect x="216" y="36" width="66" height="32" rx="8" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <text x="249" y="56" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontFamily="JetBrains Mono">worker</text>

            <rect x="216" y="92" width="66" height="32" rx="8" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <text x="249" y="112" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontFamily="JetBrains Mono">postgres</text>

            <rect x="300" y="24" width="34" height="24" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <text x="317" y="39" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6.5" fontFamily="JetBrains Mono">nim</text>
          </g>
        </svg>

        <div className="mt-3 space-y-2 border-t border-border/50 pt-4">
          {[
            { label: "Separation of concerns", state: "good" },
            { label: "Module boundaries", state: "warning" },
            { label: "Dependency direction", state: "good" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{row.label}</span>
              <span
                className={`font-mono text-[8.5px] uppercase tracking-[0.08em] ${
                  row.state === "good" ? "text-success" : "text-warning"
                }`}
              >
                {row.state === "good" ? "healthy" : "review"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon(props: React.ComponentProps<typeof Zap>) {
  return <Zap {...props} />;
}
