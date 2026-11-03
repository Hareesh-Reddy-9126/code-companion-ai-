import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  GitPullRequest,
  Globe2,
  Layers,
  LockKeyhole,
  MessageSquareCode,
  Play,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { LogoMark } from "@/components/brand/Logo";
import { ScoreRing } from "@/components/app/ScoreRing";

const stack = [
  { name: "NVIDIA NIM", detail: "Nemotron models" },
  { name: "Supabase", detail: "EU Postgres + Auth" },
  { name: "Cloudflare", detail: "Edge delivery" },
  { name: "GitHub", detail: "OAuth + PR comments" },
];

const faqs = [
  {
    q: "Is it actually free?",
    a: "Yes. Code Companion AI is free during the public beta. There is no card on file, no trial countdown, and no automatic charge. Paid tiers are planned but not yet available.",
  },
  {
    q: "What happens to my source code?",
    a: "Repository files are fetched with your encrypted GitHub token and sent to NVIDIA NIM for inference. Tokens are encrypted with AES-256-GCM and never exposed to the browser. Your data lives in an EU Supabase region.",
  },
  {
    q: "Does the agent push commits to my repository?",
    a: "No. The AI agent reads the pull request diff and posts precise fix suggestions as a GitHub review comment. A human stays in control of every merge and every commit.",
  },
  {
    q: "Which models are used?",
    a: "NVIDIA Nemotron 3 Ultra is the primary model, with Nemotron 3.5 Lightning and Llama 3.1 Nemotron 70B as automatic fallbacks if the primary is unavailable.",
  },
  {
    q: "Are you SOC 2 certified?",
    a: "Not yet. We have designed controls around SOC 2 requirements — encryption, least-privilege access, audit logging and row-level security — and certification is in progress. We will not claim a certification we have not earned.",
  },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <HeroBackdrop />

      {/* ---------------- Hero ---------------- */}
      <section className="relative pb-14 pt-32 sm:pb-20 sm:pt-40">
        <div className="container-page">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/[0.025] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                AI-native engineering intelligence
                <span className="text-border">/</span>
                <span className="text-foreground/80">Public beta</span>
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="display-xl mx-auto mt-7 max-w-[15ch] text-foreground">
                Ship code you can{" "}
                <span className="relative inline-block font-display italic tracking-[-0.03em] text-primary">
                  defend.
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-primary/50"
                    viewBox="0 0 300 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2 8.5C72 3.5 166 2.5 298 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mx-auto mt-7 max-w-[52ch] text-[15px] leading-7 text-muted-foreground sm:text-[17px] sm:leading-8">
                Review every pull request, surface the security issues humans miss,
                and hand the fix to an AI agent. Powered by NVIDIA Nemotron.
                Built for teams that ship on evidence.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/signup">
                    <span>Start building free <ArrowRight className="h-4 w-4" /></span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link to="/features">
                    <span><Play className="h-3.5 w-3.5" /> See the platform</span>
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground/80">
                <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> No credit card</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> GitHub OAuth</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> $0 during beta</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={300} className="relative mt-14 sm:mt-20">
            <ProductWindow />
          </Reveal>

          <Reveal delay={100} className="mt-12 sm:mt-16">
            <div className="flex flex-col items-center gap-5 border-y border-border/60 py-6 sm:flex-row sm:justify-between">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Built on infrastructure you already trust
              </p>
              <div className="grid w-full grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:w-auto sm:items-center sm:gap-9">
                {stack.map((item) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <span className="h-1 w-1 rounded-full bg-primary/70" />
                    <div>
                      <p className="text-[12.5px] font-medium text-foreground/90">{item.name}</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Positioning ---------------- */}
      <section className="relative py-20 sm:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">The bottleneck</p>
              <h2 className="display-lg mt-5 max-w-[15ch] text-foreground">
                Review is where velocity goes to{" "}
                <span className="font-display italic text-primary">die.</span>
              </h2>
            </Reveal>
            <Reveal delay={100} className="lg:pt-2">
              <p className="max-w-[58ch] text-[15px] leading-7 text-muted-foreground sm:text-[16px]">
                Great engineers spend their best hours writing the same comments,
                missing the same classes of bugs, and waiting for a second pair of
                eyes. Code Companion turns that work into a system: consistent
                analysis, traceable findings, and fixes your team can actually use.
              </p>
              <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-3">
                {[
                  { value: "6", label: "review dimensions", sub: "quality · security · performance · architecture" },
                  { value: "3", label: "model fallbacks", sub: "automatic failover" },
                  { value: "1", label: "review surface", sub: "repo, PR and agent in one place" },
                ].map((item) => (
                  <div key={item.label} className="bg-card px-4 py-5">
                    <p className="text-[26px] font-semibold leading-none tracking-[-0.05em] text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-2 text-[12px] font-medium text-foreground/85">{item.label}</p>
                    <p className="mt-1 text-[10.5px] leading-4 text-muted-foreground">{item.sub}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Feature bento ---------------- */}
      <section id="platform" className="relative py-16 sm:py-24">
        <div className="container-page">
          <Reveal className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">The platform</p>
              <h2 className="display-lg mt-4 max-w-[16ch] text-foreground">
                One system for the whole{" "}
                <span className="font-display italic text-primary">review.</span>
              </h2>
            </div>
            <p className="max-w-[38ch] text-[14px] leading-6 text-muted-foreground">
              Every surface is connected: the repo feeds the review, the review
              feeds the agent, and every finding is traceable back to a file and a line.
            </p>
          </Reveal>

          <div className="grid gap-3 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <FeatureCard
                icon={MessageSquareCode}
                eyebrow="AI code review"
                title="A staff engineer's read on every diff"
                copy="Structured scores, strengths, weaknesses and refactoring suggestions — not a wall of generic prose."
              >
                <ReviewVisual />
              </FeatureCard>
            </Reveal>

            <Reveal delay={70} className="lg:col-span-5">
              <FeatureCard
                icon={ShieldCheck}
                eyebrow="Security"
                title="Security that reads context"
                copy="Hardcoded secrets, injection paths, unsafe auth and risky dependencies, ranked by severity."
              >
                <SecurityVisual />
              </FeatureCard>
            </Reveal>

            <Reveal delay={40} className="lg:col-span-5">
              <FeatureCard
                icon={Boxes}
                eyebrow="Architecture"
                title="See the shape of the system"
                copy="Detected patterns, separation of concerns and modularity signals, explained in plain language."
              >
                <ArchitectureVisual />
              </FeatureCard>
            </Reveal>

            <Reveal delay={110} className="lg:col-span-7">
              <FeatureCard
                icon={Wand2}
                eyebrow="AI agent"
                title="From finding to fix, in the pull request"
                copy="The agent reads the diff, proposes precise fixes and posts them as a native GitHub review comment. No silent commits."
              >
                <AgentVisual />
              </FeatureCard>
            </Reveal>

            <Reveal delay={60} className="lg:col-span-4">
              <FeatureCard
                icon={Braces}
                eyebrow="Models"
                title="Nemotron first. Always available."
                copy="Primary and fallback models are configured server-side, so a provider hiccup never blocks a review."
                compact
              >
                <ModelVisual />
              </FeatureCard>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-4">
              <FeatureCard
                icon={FileCode2}
                eyebrow="Reporting"
                title="Reports leadership can read"
                copy="Share a clean, public report with scores and findings. Private by default; one click to share."
                compact
              >
                <ReportVisual />
              </FeatureCard>
            </Reveal>

            <Reveal delay={180} className="lg:col-span-4">
              <FeatureCard
                icon={Terminal}
                eyebrow="Workflow"
                title="Fits the tools you already use"
                copy="Dashboard, API and CLI. Trigger an analysis where your team already works."
                compact
              >
                <CliVisual />
              </FeatureCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Workflow ---------------- */}
      <section className="relative border-y border-border/60 bg-[#070808] py-20 sm:py-28">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="display-lg mt-4 text-foreground">
              From repository to{" "}
              <span className="font-display italic text-primary">resolved</span> in three moves.
            </h2>
            <p className="mx-auto mt-5 max-w-[48ch] text-[14.5px] leading-7 text-muted-foreground">
              No workflow migration. No YAML to maintain. Connect GitHub, run a
              review, and decide what ships.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {[
              {
                n: "01",
                icon: GitBranch,
                title: "Connect your GitHub",
                copy: "OAuth in one click. Repositories sync, tokens are encrypted, and you choose what to analyze.",
                visual: (
                  <div className="rounded-xl border border-border/70 bg-[#0B0D0E] p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <GitBranch className="h-3.5 w-3.5 text-primary" /> acme/platform
                      </span>
                      <span className="rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-success">
                        connected
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {["payments-api", "web-console", "design-system"].map((repo) => (
                        <div key={repo} className="flex items-center gap-2 rounded-lg border border-border/50 bg-white/[0.02] px-2.5 py-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                          <span className="font-mono text-[10px] text-muted-foreground">{repo}</span>
                          <span className="ml-auto font-mono text-[8.5px] text-muted-foreground/50">TypeScript</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                n: "02",
                icon: ScanSearch,
                title: "Run the review",
                copy: "Analyze a repo or paste a pull request URL. Scores, findings and a fix plan come back in one pass.",
                visual: (
                  <div className="rounded-xl border border-border/70 bg-[#0B0D0E] p-4">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-muted-foreground">analysis / full_review</span>
                      <span className="font-mono text-primary">running</span>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <ScoreRing score={86} size={62} strokeWidth={5} />
                      <div className="flex-1 space-y-2">
                        {[
                          { label: "Security", value: "94" },
                          { label: "Performance", value: "78" },
                          { label: "Architecture", value: "82" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center gap-2">
                            <span className="w-16 text-[9.5px] text-muted-foreground">{row.label}</span>
                            <span className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                              <span className="block h-full rounded-full bg-primary/70" style={{ width: `${row.value}%` }} />
                            </span>
                            <span className="font-mono text-[9px] text-foreground/70">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                n: "03",
                icon: GitPullRequest,
                title: "Ship the fix",
                copy: "Review the agent's suggestion, post it to GitHub, and merge with evidence instead of opinion.",
                visual: (
                  <div className="rounded-xl border border-border/70 bg-[#0B0D0E] p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <span className="text-[10.5px] font-medium text-foreground">Fix posted to PR #184</span>
                    </div>
                    <div className="mt-3 rounded-lg border border-border/60 bg-white/[0.02] p-3">
                      <p className="font-mono text-[9px] text-muted-foreground">api/webhooks/stripe.ts:42</p>
                      <p className="mt-1.5 text-[10.5px] leading-5 text-muted-foreground">
                        Verify the webhook signature before trusting the event payload.
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[9.5px] text-primary">
                        <Sparkles className="h-3 w-3" /> 96% confidence
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((step) => (
              <div key={step.n} className="group relative rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-border sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground/60">{step.n}</span>
                  <step.icon className="h-4 w-4 text-muted-foreground/60" />
                </div>
                <h3 className="mt-5 text-[15.5px] font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-2 min-h-[60px] text-[12.5px] leading-5 text-muted-foreground">{step.copy}</p>
                <div className="mt-4">{step.visual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Security ---------------- */}
      <section className="relative py-20 sm:py-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-[#0A0C0D] p-6 sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.06] blur-3xl" />
            <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
              <Reveal>
                <p className="eyebrow">Security posture</p>
                <h2 className="display-lg mt-4 max-w-[14ch] text-foreground">
                  Your code stays{" "}
                  <span className="font-display italic text-primary">yours.</span>
                </h2>
                <p className="mt-5 max-w-[48ch] text-[14px] leading-7 text-muted-foreground">
                  Security is architecture, not a badge. Tokens are encrypted
                  before they touch the database, every table is scoped to its
                  owner, and inference happens through NVIDIA's API — never in
                  your browser.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    {
                      icon: LockKeyhole,
                      title: "AES-256-GCM token encryption",
                      copy: "GitHub credentials are encrypted server-side and decrypted only inside edge functions.",
                    },
                    {
                      icon: Database,
                      title: "Row-level security by default",
                      copy: "Every repository, analysis and fix is isolated to the authenticated owner.",
                    },
                    {
                      icon: Globe2,
                      title: "EU data region",
                      copy: "Supabase Postgres and Auth run in eu-north-1 (Stockholm).",
                    },
                    {
                      icon: BadgeCheck,
                      title: "SOC 2 aligned controls",
                      copy: "Designed around SOC 2 requirements. Certification is in progress — not yet completed.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3.5 rounded-xl border border-border/50 bg-white/[0.015] p-3.5">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-primary">
                        <item.icon className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-[12.5px] font-medium text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">{item.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={120} className="lg:pt-6">
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#08090A] shadow-panel">
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
                      <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
                      <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                      request trace
                    </span>
                  </div>
                  <div className="space-y-1 p-5 font-mono text-[10.5px] leading-6 text-muted-foreground">
                    <p><span className="text-primary">→</span> browser <span className="text-muted-foreground/40">────</span> edge function <span className="text-foreground/70">verify JWT</span></p>
                    <p><span className="text-primary">→</span> decrypt <span className="text-foreground/70">github token</span> <span className="text-muted-foreground/50">AES-256-GCM</span></p>
                    <p><span className="text-primary">→</span> github api <span className="text-foreground/70">fetch repository tree</span></p>
                    <p><span className="text-primary">→</span> nvidia nim <span className="text-foreground/70">nemotron 3 ultra</span></p>
                    <p><span className="text-primary">←</span> structured report <span className="text-success">validated json</span></p>
                    <p><span className="text-primary">←</span> postgres <span className="text-foreground/70">RLS-scoped insert</span></p>
                  </div>
                  <div className="border-t border-border/60 p-5">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/[0.02] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-[11px] font-medium text-foreground">Token never reaches the client</p>
                          <p className="font-mono text-[9px] text-muted-foreground">server-side only</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-success">
                        verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-warning/20 bg-warning/[0.04] p-3.5">
                  <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                  <p className="text-[10.5px] leading-5 text-muted-foreground">
                    <span className="font-medium text-foreground/90">Honest disclosure:</span>{" "}
                    SOC 2 Type II certification is in progress. We publish the
                    work, not a premature badge.{" "}
                    <Link to="/security-policy" className="text-primary underline-offset-2 hover:underline">
                      Read the security policy
                    </Link>
                    .
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Pricing preview ---------------- */}
      <section className="relative pb-20 pt-4 sm:pb-28">
        <div className="container-page">
          <Reveal className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Pricing</p>
              <h2 className="display-md mt-4 text-foreground">
                Free while we earn{" "}
                <span className="font-display italic text-primary">trust.</span>
              </h2>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/pricing">
                <span>Compare plans <ArrowUpRight className="h-3.5 w-3.5" /></span>
              </Link>
            </Button>
          </Reveal>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$0",
                note: "free during beta",
                copy: "For individual engineers who want a second pair of eyes.",
                features: ["5 repositories", "10 analyses / day", "Security scanning", "Shareable reports"],
                cta: "Start free",
                href: "/signup",
                highlight: false,
              },
              {
                name: "Professional",
                price: "$49",
                note: "planned",
                copy: "For teams shipping to production every day.",
                features: ["50 repositories", "5,000 analyses / month", "PR review comments", "Team workspaces", "Priority support"],
                cta: "Join early access",
                href: "mailto:sales@codecompanion.ai?subject=Professional%20early%20access",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                note: "scoped",
                copy: "For organizations with procurement and compliance requirements.",
                features: ["Unlimited repositories", "SAML SSO (roadmap)", "Data residency", "Self-hosted option", "Dedicated support"],
                cta: "Talk to sales",
                href: "/enterprise",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-primary/35 bg-[linear-gradient(180deg,hsl(var(--primary)/0.07),hsl(var(--card))_45%)]"
                    : "border-border/70 bg-card"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-2.5 left-6 rounded-full border border-primary/30 bg-primary px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-primary-foreground">
                    Planned tier
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-foreground">{plan.name}</p>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60">{plan.note}</span>
                </div>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-[38px] font-semibold leading-none tracking-[-0.055em] text-foreground">{plan.price}</span>
                  {plan.price === "$49" && <span className="text-[11px] text-muted-foreground">/ month</span>}
                </div>
                <p className="mt-3 text-[12px] leading-5 text-muted-foreground">{plan.copy}</p>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-border/60 pt-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                      <Check className="h-3 w-3 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? "default" : "outline"}
                  className="mt-6 w-full"
                  asChild
                >
                  {plan.href.startsWith("http") || plan.href.startsWith("mailto") ? (
                    <a href={plan.href}>{plan.cta}</a>
                  ) : (
                    <Link to={plan.href}>{plan.cta}</Link>
                  )}
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center font-mono text-[9.5px] uppercase tracking-[0.13em] text-muted-foreground/60">
            Paid plans are not yet available · No automatic charges · Cancel anytime (there is nothing to cancel)
          </p>
        </div>
      </section>

      {/* ---------------- Open source ---------------- */}
      <section className="relative border-y border-border/60 bg-[#070808] py-20 sm:py-24">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">Built in public</p>
              <h2 className="display-lg mt-4 max-w-[16ch] text-foreground">
                Don't trust the pitch.{" "}
                <span className="font-display italic text-primary">Read the code.</span>
              </h2>
              <p className="mt-5 max-w-[50ch] text-[14px] leading-7 text-muted-foreground">
                The entire product — edge functions, database policies, CLI and
                this frontend — is open for inspection. If a claim on this page
                isn't backed by the repository, it doesn't belong here.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <a href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-" target="_blank" rel="noreferrer">
                    <span><GitBranch className="h-4 w-4" /> View the repository</span>
                  </a>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/docs">
                    <span>Read the docs <ChevronRight className="h-3.5 w-3.5" /></span>
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#08090A] shadow-panel">
                <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <LogoMark size="sm" />
                    <span className="font-mono text-[10px] text-muted-foreground">code-companion-ai</span>
                  </div>
                  <span className="rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-success">
                    public
                  </span>
                </div>
                <div className="p-5 font-mono text-[11px] leading-7">
                  <p className="text-muted-foreground/50">$ git clone github.com/Hareesh-Reddy-9126/code-companion-ai-</p>
                  <p className="mt-3 text-muted-foreground/50">$ npm install && npm run dev</p>
                  <p className="mt-3 text-primary">▲ ready in 1.2s</p>
                  <p className="text-foreground/70">  local: http://localhost:8080</p>
                  <p className="mt-4 text-muted-foreground/50"># edge functions · RLS policies · AI pipeline</p>
                  <p className="text-foreground/70">  supabase/functions/</p>
                  <p className="text-foreground/70">  supabase/migrations/</p>
                  <p className="text-foreground/70">  cli/src/index.ts</p>
                  <p className="mt-4 text-muted-foreground/50"># every claim, auditable</p>
                  <p className="flex items-center gap-1.5 text-success">
                    <Check className="h-3 w-3" /> production build passing
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 bg-white/[0.015] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                  <span>TypeScript · React · Supabase · Deno</span>
                  <a
                    href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-foreground/70 transition-colors hover:text-primary"
                  >
                    open <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Questions</p>
              <h2 className="display-lg mt-4 max-w-[12ch] text-foreground">
                Straight{" "}
                <span className="font-display italic text-primary">answers.</span>
              </h2>
              <p className="mt-5 max-w-[34ch] text-[13.5px] leading-6 text-muted-foreground">
                No fine print, no fake countdowns. If something isn't live yet,
                it's labeled as planned.
              </p>
              <a
                href="mailto:support@codecompanion.ai"
                className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline"
              >
                Ask us anything <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Reveal>

            <Reveal delay={100}>
              <div className="divide-y divide-border/60 border-y border-border/60">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[14px] font-medium text-foreground marker:hidden">
                      {faq.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-transform duration-300 group-open:rotate-45">
                        <span className="text-base leading-none">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 max-w-[60ch] text-[13px] leading-6 text-muted-foreground">{faq.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative overflow-hidden bg-bone text-bone-foreground">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)]" />
        <div className="container-page relative py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">Start today</p>
              <h2 className="display-lg mt-4 max-w-[15ch]">
                Make review your{" "}
                <span className="font-display italic">advantage.</span>
              </h2>
              <p className="mt-5 max-w-[48ch] text-[14px] leading-7 text-black/60">
                Connect a repository, run your first analysis, and see what your
                team has been missing. It takes about four minutes.
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
                <Link to="/enterprise"><span>Talk to us</span></Link>
              </Button>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 sm:grid-cols-3">
            {[
              { k: "No credit card", v: "Start with GitHub OAuth" },
              { k: "EU data region", v: "Stockholm · eu-north-1" },
              { k: "Full transparency", v: "Public repository, honest docs" },
            ].map((item) => (
              <div key={item.k} className="bg-bone px-5 py-4">
                <p className="text-[12px] font-medium">{item.k}</p>
                <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-black/45">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero backdrop                                                      */
/* ------------------------------------------------------------------ */

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1050px] overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[110px]" />
      <div className="absolute right-[-12rem] top-[18rem] h-[24rem] w-[34rem] rounded-full bg-info/[0.05] blur-[110px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary/20 via-border/40 to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product window                                                     */
/* ------------------------------------------------------------------ */

function ProductWindow() {
  return (
    <div className="relative mx-auto max-w-[1080px]">
      <div className="pointer-events-none absolute -inset-x-8 -top-10 h-40 bg-primary/[0.06] blur-3xl" />

      {/* Floating annotations */}
      <div className="absolute -right-4 top-24 z-20 hidden w-[210px] rounded-xl border border-border/80 bg-[#0D0F10]/95 p-3 shadow-panel backdrop-blur lg:block">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/12 text-primary">
            <Sparkles className="h-3 w-3" />
          </span>
          <div>
            <p className="text-[10.5px] font-medium text-foreground">2 fixes proposed</p>
            <p className="font-mono text-[8.5px] text-muted-foreground">ready for review</p>
          </div>
        </div>
      </div>
      <div className="absolute -left-6 bottom-24 z-20 hidden w-[220px] rounded-xl border border-border/80 bg-[#0D0F10]/95 p-3 shadow-panel backdrop-blur lg:block">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">token storage</span>
          <LockKeyhole className="h-3 w-3 text-primary" />
        </div>
        <p className="mt-1.5 font-mono text-[10px] text-foreground/85">AES-256-GCM</p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full w-full rounded-full bg-primary/60" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-[#0A0C0D] shadow-float">
        <div className="absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 animate-scan bg-gradient-to-b from-primary/[0.045] to-transparent" />

        {/* window chrome */}
        <div className="flex h-10 items-center gap-3 border-b border-border/60 bg-white/[0.015] px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md border border-border/50 bg-black/20 px-3 py-1">
            <LockKeyhole className="h-2.5 w-2.5 text-muted-foreground/50" />
            <span className="font-mono text-[9px] text-muted-foreground">app.codecompanion.ai/reviews/184</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted-foreground/60">live</span>
          </div>
        </div>

        <div className="grid min-h-[440px] grid-cols-1 md:grid-cols-[150px_1fr] lg:grid-cols-[150px_1fr_215px]">
          {/* rail */}
          <div className="hidden border-r border-border/60 bg-[#08090A] p-3 md:block">
            <div className="mb-5 flex items-center gap-2 px-1">
              <LogoMark size="sm" />
              <span className="text-[10.5px] font-semibold tracking-tight text-foreground">Code Companion</span>
            </div>
            <div className="space-y-0.5">
              {[
                { icon: Layers, label: "Overview", active: false },
                { icon: GitBranch, label: "Repositories", active: false },
                { icon: MessageSquareCode, label: "Reviews", active: true },
                { icon: ShieldCheck, label: "Security", active: false },
                { icon: Wand2, label: "Agent", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${
                    item.active ? "bg-white/[0.055] text-foreground" : "text-muted-foreground/70"
                  }`}
                >
                  <item.icon className={`h-3 w-3 ${item.active ? "text-primary" : ""}`} />
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-border/60 pt-3">
              <div className="rounded-lg border border-border/50 bg-white/[0.02] p-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-muted-foreground/60">usage</span>
                  <span className="font-mono text-[8px] text-foreground/70">3 / 10</span>
                </div>
                <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full w-[30%] rounded-full bg-primary" />
                </div>
                <p className="mt-1.5 font-mono text-[7.5px] text-muted-foreground/50">analyses today</p>
              </div>
            </div>
          </div>

          {/* main */}
          <div className="min-w-0 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GitPullRequest className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11.5px] font-medium text-foreground">Add payments webhook handler</p>
                  <p className="mt-0.5 font-mono text-[8.5px] text-muted-foreground">
                    acme/payments-api · PR #184 · +248 −12
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-1 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-success">
                <CheckCircle2 className="h-2.5 w-2.5" /> review complete
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { label: "Quality", score: 86 },
                { label: "Security", score: 94 },
                { label: "Performance", score: 78 },
              ].map((score) => (
                <div key={score.label} className="rounded-xl border border-border/60 bg-white/[0.018] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-muted-foreground">{score.label}</span>
                    <span className="font-mono text-[8px] text-foreground/60">/100</span>
                  </div>
                  <p className="mt-2 text-[21px] font-semibold leading-none tracking-[-0.05em] text-foreground">{score.score}</p>
                  <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full ${score.score >= 80 ? "bg-primary" : "bg-warning"}`}
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <FindingRow
                severity="high"
                file="api/webhooks/stripe.ts:42"
                title="Webhook signature is not verified"
                body="Accepting untrusted event payloads enables forged subscription events."
              />
              <FindingRow
                severity="medium"
                file="lib/retry.ts:18"
                title="Retry loop can amplify failures"
                body="No jitter or cap. Add exponential backoff with a maximum attempt limit."
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border/60 bg-[#08090A]">
              <div className="flex items-center justify-between border-b border-border/50 px-3 py-1.5">
                <span className="font-mono text-[8px] text-muted-foreground">suggested fix · stripe.ts</span>
                <span className="font-mono text-[8px] text-primary">+6 −1</span>
              </div>
              <div className="p-3 font-mono text-[9px] leading-5">
                <p className="text-muted-foreground/50">@@ -38,7 +38,12 @@</p>
                <p className="diff-del px-1 text-[#FF9C9C]">- const event = JSON.parse(body);</p>
                <p className="diff-add px-1 text-[#B8F08D]">+ const signature = req.headers.get("stripe-signature");</p>
                <p className="diff-add px-1 text-[#B8F08D]">+ const event = stripe.webhooks.constructEvent(body, signature, secret);</p>
                <p className="diff-add px-1 text-[#B8F08D]">+ if (!event) return new Response("invalid signature", {"{"} status: 400 {"}"});</p>
              </div>
            </div>
          </div>

          {/* agent */}
          <div className="hidden border-l border-border/60 bg-[#08090A] p-4 lg:block">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                <Sparkles className="h-2.5 w-2.5 text-primary" /> agent
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
            </div>
            <p className="mt-3 text-[10.5px] font-medium text-foreground">Fix plan</p>
            <div className="mt-3 space-y-3">
              {[
                { label: "Read the diff", done: true },
                { label: "Identify 2 issues", done: true },
                { label: "Draft patches", done: true },
                { label: "Post review comment", done: false },
              ].map((step) => (
                <div key={step.label} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      step.done ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {step.done ? <Check className="h-2.5 w-2.5" /> : <CircleDot className="h-2.5 w-2.5" />}
                  </span>
                  <span className={`text-[9.5px] leading-4 ${step.done ? "text-foreground/80" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-border/60 bg-white/[0.02] p-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">confidence</span>
                <span className="font-mono text-[9px] text-primary">96%</span>
              </div>
              <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-border">
                <div className="h-full w-[96%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-primary px-2.5 py-2 text-center text-[9px] font-semibold text-primary-foreground">
              Post to pull request
            </div>
            <p className="mt-2 text-center font-mono text-[7.5px] text-muted-foreground/50">human approves every action</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindingRow({
  severity,
  file,
  title,
  body,
}: {
  severity: "high" | "medium";
  file: string;
  title: string;
  body: string;
}) {
  const styles =
    severity === "high"
      ? "border-destructive/20 bg-destructive/[0.045] text-destructive"
      : "border-warning/20 bg-warning/[0.04] text-warning";
  return (
    <div className="rounded-lg border border-border/60 bg-white/[0.018] p-2.5">
      <div className="flex items-center gap-2">
        <span className={`rounded border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] ${styles}`}>
          {severity}
        </span>
        <span className="truncate font-mono text-[8px] text-muted-foreground">{file}</span>
      </div>
      <p className="mt-1.5 text-[10px] font-medium text-foreground/90">{title}</p>
      <p className="mt-0.5 line-clamp-1 text-[9px] leading-4 text-muted-foreground">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feature card + visuals                                             */
/* ------------------------------------------------------------------ */

function FeatureCard({
  icon: Icon,
  eyebrow,
  title,
  copy,
  children,
  compact = false,
}: {
  icon: typeof Cpu;
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-muted-foreground/25 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-primary/[0.035] blur-2xl transition-opacity duration-500 group-hover:bg-primary/[0.065]" />
      <div className="relative flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</span>
      </div>
      <h3 className={`relative mt-4 font-semibold tracking-[-0.03em] text-foreground ${compact ? "text-[15px]" : "text-[17px]"}`}>
        {title}
      </h3>
      <p className="relative mt-2 max-w-[46ch] text-[12.5px] leading-5 text-muted-foreground">{copy}</p>
      <div className="relative mt-auto pt-5">{children}</div>
    </div>
  );
}

function ReviewVisual() {
  return (
    <div className="rounded-xl border border-border/60 bg-[#08090A] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10.5px] text-foreground/85">feat: rate limit auth endpoints</span>
        </div>
        <span className="font-mono text-[8px] text-muted-foreground">#212</span>
      </div>
      <div className="mt-3 rounded-lg border border-border/60 bg-white/[0.02] p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-2.5 w-2.5" />
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">code companion</span>
          <span className="ml-auto rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] text-primary">
            reviewed
          </span>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
          The limiter is keyed by IP only. Behind a proxy, every user shares one
          bucket. Prefer the authenticated user id, with IP as a fallback.
        </p>
        <div className="mt-2.5 flex items-center gap-3 font-mono text-[8px] text-muted-foreground/60">
          <span>auth/rate-limit.ts:24</span>
          <span className="text-primary">suggested fix</span>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-lg border border-border/50 bg-white/[0.015] px-3 py-2">
        <span className="flex items-center gap-1.5 text-[9.5px] text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 text-success" /> 4 checks passed
        </span>
        <span className="font-mono text-[8px] text-muted-foreground/50">1 suggestion</span>
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="space-y-2">
      {[
        { level: "critical", label: "Hardcoded API key", file: "scripts/seed.ts:12", color: "destructive" },
        { level: "high", label: "Unverified webhook payload", file: "api/stripe.ts:42", color: "warning" },
        { level: "medium", label: "Missing auth check", file: "routes/admin.ts:8", color: "info" },
        { level: "low", label: "Verbose error response", file: "lib/errors.ts:31", color: "muted" },
      ].map((issue) => (
        <div key={issue.label} className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-white/[0.018] px-3 py-2">
          <span
            className={`rounded border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] ${
              issue.color === "destructive"
                ? "border-destructive/25 bg-destructive/10 text-destructive"
                : issue.color === "warning"
                  ? "border-warning/25 bg-warning/10 text-warning"
                  : issue.color === "info"
                    ? "border-info/25 bg-info/10 text-info"
                    : "border-border bg-secondary text-muted-foreground"
            }`}
          >
            {issue.level}
          </span>
          <span className="min-w-0 flex-1 truncate text-[10px] text-foreground/80">{issue.label}</span>
          <span className="hidden font-mono text-[8px] text-muted-foreground/50 sm:block">{issue.file}</span>
        </div>
      ))}
    </div>
  );
}

function ArchitectureVisual() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-[#08090A] p-4">
      <svg viewBox="0 0 300 130" className="w-full" fill="none" aria-hidden="true">
        <g stroke="hsl(var(--border))" strokeWidth="1">
          <path d="M52 65h48M148 65h48M200 42v-18h48M200 88v18h48" />
          <path d="M100 65v-30h48M100 65v30h48" strokeDasharray="3 4" />
        </g>
        <g>
          <rect x="8" y="50" width="44" height="30" rx="7" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
          <text x="30" y="68" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7" fontFamily="JetBrains Mono">web</text>
          <rect x="100" y="35" width="48" height="60" rx="8" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--primary)/0.3)" />
          <text x="124" y="61" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7" fontFamily="JetBrains Mono">api</text>
          <text x="124" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6" fontFamily="JetBrains Mono">domain</text>
          <rect x="196" y="28" width="52" height="28" rx="7" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
          <text x="222" y="46" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7" fontFamily="JetBrains Mono">worker</text>
          <rect x="196" y="74" width="52" height="28" rx="7" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
          <text x="222" y="92" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7" fontFamily="JetBrains Mono">db</text>
        </g>
      </svg>
      <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-3">
        <span className="font-mono text-[8px] text-muted-foreground/60">detected pattern</span>
        <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-primary">
          layered monolith
        </span>
      </div>
    </div>
  );
}

function AgentVisual() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="rounded-xl border border-border/60 bg-[#08090A] p-3.5">
        <div className="flex items-center gap-2">
          <Wand2 className="h-3 w-3 text-primary" />
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">agent run</span>
        </div>
        <div className="mt-3 space-y-2 font-mono text-[9px] leading-5">
          <p className="text-muted-foreground/50">01 read diff <span className="text-success">✓</span></p>
          <p className="text-muted-foreground/50">02 locate issues <span className="text-success">✓</span></p>
          <p className="text-muted-foreground/50">03 draft patches <span className="text-success">✓</span></p>
          <p className="text-foreground/70">04 post comment <span className="text-primary">→</span></p>
        </div>
      </div>
      <div className="rounded-xl border border-primary/20 bg-primary/[0.035] p-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-primary">proposed fix</span>
          <span className="font-mono text-[8px] text-primary">96%</span>
        </div>
        <pre className="mt-3 overflow-hidden font-mono text-[8.5px] leading-5 text-foreground/70">
{`const key =
  user.id ??
  request.ip;

if (!key) {
  throw new Error("no key");
}`}
        </pre>
        <p className="mt-2 font-mono text-[7.5px] text-muted-foreground/55">comment · not a commit</p>
      </div>
    </div>
  );
}

function ModelVisual() {
  return (
    <div className="space-y-1.5">
      {[
        { name: "nemotron-3-ultra", role: "primary", active: true },
        { name: "nemotron-3.5-lightning", role: "fallback", active: false },
        { name: "llama-3.1-nemotron-70b", role: "fallback", active: false },
      ].map((model) => (
        <div key={model.name} className="flex items-center gap-2 rounded-lg border border-border/50 bg-white/[0.015] px-2.5 py-2">
          <span className={`h-1.5 w-1.5 rounded-full ${model.active ? "bg-primary" : "bg-muted-foreground/30"}`} />
          <span className="min-w-0 flex-1 truncate font-mono text-[9px] text-foreground/75">{model.name}</span>
          <span className={`font-mono text-[7.5px] uppercase tracking-[0.08em] ${model.active ? "text-primary" : "text-muted-foreground/50"}`}>
            {model.role}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="rounded-xl border border-border/60 bg-[#08090A] p-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">report / public</span>
        <Globe2 className="h-3 w-3 text-muted-foreground/60" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {[
          { k: "Q", v: 86 },
          { k: "S", v: 94 },
          { k: "P", v: 78 },
          { k: "A", v: 82 },
        ].map((s) => (
          <div key={s.k} className="rounded-md border border-border/50 bg-white/[0.02] py-2 text-center">
            <p className="font-mono text-[7px] text-muted-foreground/60">{s.k}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-foreground">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1 w-full rounded-full bg-border">
          <div className="h-full w-[86%] rounded-full bg-primary/60" />
        </div>
        <div className="h-1 w-3/4 rounded-full bg-border">
          <div className="h-full w-[74%] rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
}

function CliVisual() {
  return (
    <div className="rounded-xl border border-border/60 bg-[#08090A] p-3.5 font-mono text-[9px] leading-6">
      <p className="text-muted-foreground/50">$ ccai analyze repo_8f2a</p>
      <p className="text-foreground/75">◇ fetching repository…</p>
      <p className="text-foreground/75">◇ reviewing with nemotron</p>
      <p className="text-primary">◆ report ready · quality 86</p>
      <p className="mt-1.5 text-muted-foreground/40">$ ccai fix repo_8f2a 184</p>
    </div>
  );
}
