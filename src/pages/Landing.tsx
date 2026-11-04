import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  FileCode2,
  GitBranch,
  GitPullRequest,
  Globe2,
  LockKeyhole,
  MessageSquareCode,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

const stack = [
  { name: "NVIDIA NIM", detail: "Nemotron models" },
  { name: "Supabase", detail: "EU Postgres + Auth" },
  { name: "Cloudflare", detail: "Edge delivery" },
  { name: "GitHub", detail: "OAuth + PR comments" },
];

const faqs = [
  {
    q: "Is it actually free?",
    a: "Yes. Code Companion AI is free during the public beta. No card on file, no trial countdown, no automatic charge.",
  },
  {
    q: "What happens to my source code?",
    a: "Repository files are fetched with your encrypted GitHub token and sent to NVIDIA NIM for inference. Tokens are encrypted server-side and never exposed to the browser.",
  },
  {
    q: "Does the agent push commits?",
    a: "No. The AI agent reads the diff and posts fix suggestions as a GitHub review comment. A human stays in control of every merge.",
  },
  {
    q: "Which models are used?",
    a: "NVIDIA Nemotron 3 Ultra is primary, with Nemotron 3.5 Lightning and Llama 3.1 Nemotron 70B as automatic fallbacks.",
  },
];

export default function Landing() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-32 pb-24 sm:pb-32">
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Code review, security & fixes
              <span className="text-border">/</span>
              <span className="text-foreground/60">Public beta</span>
            </div>

            <h1 className="text-h1 mx-auto mt-8 max-w-[48ch] text-foreground">
              Ship code you can{" "}
              <span className="font-medium text-brand">defend.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
              Review every pull request, surface security issues humans miss,
              and hand the fix to an AI agent.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  <span>Start building free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/features">
                  <span>See the platform</span>
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-x-6 gap-y-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
              <Check className="h-3 w-3 text-brand" />
              <span>No credit card</span>
              <span>·</span>
              <Check className="h-3 w-3 text-brand" />
              <span>GitHub OAuth</span>
              <span>·</span>
              <Check className="h-3 w-3 text-brand" />
              <span>$0 during beta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="border-y border-border py-16">
        <div className="container relative">
          <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
            Built on
          </p>
          <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {stack.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                    {item.detail}
                  </p>
                </div>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              The platform
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              One system for the whole{" "}
              <span className="font-medium text-brand">review.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              Every surface is connected: the repo feeds the review, the review
              feeds the agent, every finding traceable to a file and line.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <FeatureCard
              icon={MessageSquareCode}
              eyebrow="AI code review"
              title="A staff engineer's read on every diff"
              copy="Structured scores, strengths, weaknesses and refactoring suggestions — not a wall of generic prose."
            />
            <FeatureCard
              icon={ShieldCheck}
              eyebrow="Security"
              title="Security that reads context"
              copy="Hardcoded secrets, injection paths, unsafe auth and risky dependencies, ranked by severity."
            />
            <FeatureCard
              icon={ScanSearch}
              eyebrow="Architecture"
              title="See the shape of the system"
              copy="Detected patterns, separation of concerns and modularity signals, explained in plain language."
            />
            <FeatureCard
              icon={Sparkles}
              eyebrow="AI agent"
              title="From finding to fix, in the pull request"
              copy="The agent reads the diff, proposes precise fixes and posts them as a native GitHub review comment."
            />
            <FeatureCard
              icon={FileCode2}
              eyebrow="Reporting"
              title="Reports leadership can read"
              copy="Share a clean, public report with scores and findings. Private by default."
            />
            <FeatureCard
              icon={Terminal}
              eyebrow="Workflow"
              title="Fits the tools you already use"
              copy="Dashboard, API and CLI. Trigger an analysis where your team works."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              How it works
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              From repository to <span className="font-medium text-brand">resolved.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
              Connect GitHub, run a review, and decide what ships.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              n="01"
              icon={GitBranch}
              title="Connect your GitHub"
              copy="OAuth in one click. Repositories sync, tokens are encrypted, and you choose what to analyze."
            />
            <StepCard
              n="02"
              icon={ScanSearch}
              title="Run the review"
              copy="Analyze a repo or paste a PR URL. Scores, findings and a fix plan come back in one pass."
            />
            <StepCard
              n="03"
              icon={GitPullRequest}
              title="Ship the fix"
              copy="Review the agent's suggestion, post it to GitHub, and merge with evidence instead of opinion."
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Security posture
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Your code stays <span className="font-medium text-brand">yours.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <TrustItem
                icon={LockKeyhole}
                title="AES-256-GCM token encryption"
                copy="GitHub credentials are encrypted server-side and decrypted only inside edge functions."
              />
              <TrustItem
                icon={Globe2}
                title="EU data region"
                copy="Supabase Postgres and Auth run in eu-north-1 (Stockholm)."
              />
            </div>
            <div className="space-y-4">
              <TrustItem
                icon={BadgeCheck}
                title="SOC 2 aligned controls"
                copy="Designed around SOC 2 requirements. Certification is in progress — not yet completed."
              />
              <TrustItem
                icon={ShieldCheck}
                title="Row-level security by default"
                copy="Every repository, analysis and fix is isolated to its owner."
              />
            </div>
          </div>

          <div className="mt-12 p-6 rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
                <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
                <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                request trace
              </span>
            </div>
            <div className="space-y-2 p-4 font-mono text-xs leading-6 text-muted-foreground">
              <p>
                <span className="text-brand">→</span> browser{" "}
                <span className="text-muted-foreground/40">────</span> edge function{" "}
                <span className="text-foreground/70">verify JWT</span>
              </p>
              <p>
                <span className="text-brand">→</span> decrypt{" "}
                <span className="text-foreground/70">github token</span>{" "}
                <span className="text-muted-foreground/50">AES-256-GCM</span>
              </p>
              <p>
                <span className="text-brand">→</span> github api{" "}
                <span className="text-foreground/70">fetch repository tree</span>
              </p>
              <p>
                <span className="text-brand">→</span> nvidia nim{" "}
                <span className="text-foreground/70">nemotron 3 ultra</span>
              </p>
              <p>
                <span className="text-brand">←</span> structured report{" "}
                <span className="text-success">validated json</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Questions
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Straight <span className="font-medium text-brand">answers.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-2xl space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-border pb-4 pt-2 last:border-0">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground marker:hidden list-none">
                  {faq.q}
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-90">
                    <span className="text-xs leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">
              Start today
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Make review your <span className="font-medium text-brand">advantage.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
              Connect a repository, run your first analysis, see what your team
              has been missing.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  <span>Start free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/enterprise">
                  <span>Talk to us</span>
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

function TrustItem({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-brand shrink-0" />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{copy}</p>
      </div>
    </div>
  );
}
