import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  CircleDot,
  Clock,
  Code2,
  Database,
  FileCheck2,
  Globe2,
  KeyRound,
  LockKeyhole,
  Mail,
  Network,
  ScrollText,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

const today = [
  {
    icon: LockKeyhole,
    title: "AES-256-GCM token encryption",
    copy: "GitHub tokens are encrypted before storage and decrypted only inside edge functions.",
  },
  {
    icon: ShieldCheck,
    title: "Row-level security everywhere",
    copy: "Repositories, analyses and agent runs are scoped to the authenticated owner at the database layer.",
  },
  {
    icon: Globe2,
    title: "EU data region",
    copy: "Supabase Postgres and Auth run in eu-north-1 (Stockholm) for the current deployment.",
  },
  {
    icon: ScrollText,
    title: "Audit-friendly records",
    copy: "Analyses, agent runs and job status are persisted with timestamps and ownership.",
  },
  {
    icon: KeyRound,
    title: "OAuth with state validation",
    copy: "GitHub authorization requests are validated against a per-session state value.",
  },
  {
    icon: Code2,
    title: "Open-source verification",
    copy: "The edge functions, database policies and frontend are public and reviewable.",
  },
];

const roadmap = [
  {
    icon: Users,
    title: "Team workspaces and RBAC",
    copy: "Shared workspaces with role-based access and per-team repository scoping.",
    status: "Roadmap",
  },
  {
    icon: KeyRound,
    title: "SAML / OIDC SSO",
    copy: "Okta, Entra ID and Google Workspace federation through a standard SAML 2.0 provider.",
    status: "Roadmap",
  },
  {
    icon: Server,
    title: "Self-hosted deployment",
    copy: "Run the full stack inside your own cloud account with your own keys.",
    status: "Roadmap",
  },
  {
    icon: Network,
    title: "Additional data regions",
    copy: "US and APAC residency alongside the existing EU deployment.",
    status: "Roadmap",
  },
  {
    icon: FileCheck2,
    title: "SOC 2 Type II",
    copy: "Controls are designed around SOC 2 requirements. Certification is in progress and not yet complete.",
    status: "In progress",
  },
  {
    icon: Building2,
    title: "Custom agreements",
    copy: "DPA, security questionnaire support and procurement review for early design partners.",
    status: "Available on request",
  },
];

export default function Enterprise() {
  return (
    <div className="relative overflow-hidden">
      <EnterpriseBackdrop />

      {/* Hero */}
      <section className="relative pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="container-page">
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <Reveal>
              <span className="chip">
                <Building2 className="h-3 w-3 text-primary" />
                Enterprise
              </span>
              <h1 className="display-lg mt-6 max-w-[16ch] text-foreground">
                Built for teams that answer to{" "}
                <span className="font-display italic text-primary">procurement.</span>
              </h1>
              <p className="mt-6 max-w-[54ch] text-[15px] leading-7 text-muted-foreground sm:text-[16px]">
                The same review engine, with the security posture, residency
                detail and documentation your review process expects. We will
                tell you exactly what exists today and what is still on the
                roadmap.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <a href="mailto:sales@codecompanion.ai?subject=Enterprise%20inquiry">
                    <span><Mail className="h-4 w-4" /> Talk to us</span>
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/security-policy">
                    <span><ShieldCheck className="h-4 w-4" /> Security posture</span>
                  </Link>
                </Button>
              </div>
              <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.13em] text-muted-foreground/60">
                Design-partner conversations open · No certification claimed
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-panel">
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
                  <span className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                    <ShieldCheck className="h-3 w-3 text-primary" /> posture
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground/60">as of nov 2026</span>
                </div>
                <div className="divide-y divide-border/50">
                  {[
                    { label: "Encryption at rest", value: "AES-256-GCM", state: "live" },
                    { label: "Database isolation", value: "RLS on every table", state: "live" },
                    { label: "Data region", value: "eu-north-1", state: "live" },
                    { label: "GitHub OAuth", value: "state-validated", state: "live" },
                    { label: "SOC 2 Type II", value: "in progress", state: "progress" },
                    { label: "SAML SSO", value: "roadmap", state: "planned" },
                    { label: "Self-hosted", value: "roadmap", state: "planned" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-[12px] text-muted-foreground">{row.label}</span>
                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.1em] ${
                          row.state === "live"
                            ? "text-success"
                            : row.state === "progress"
                              ? "text-warning"
                              : "text-muted-foreground/50"
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2.5 border-t border-border/60 bg-warning/[0.035] px-5 py-3.5">
                  <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                  <p className="text-[10.5px] leading-5 text-muted-foreground">
                    Items marked <span className="font-mono uppercase tracking-[0.1em]">roadmap</span>{" "}
                    are not available today. We do not represent them as shipped.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Today */}
      <section className="relative border-y border-border/60 bg-[#070808] py-20 sm:py-28">
        <div className="container-page">
          <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Available today</p>
              <h2 className="display-md mt-4 max-w-[16ch] text-foreground">
                Controls you can{" "}
                <span className="font-display italic text-primary">verify.</span>
              </h2>
            </div>
            <p className="max-w-[40ch] text-[13px] leading-6 text-muted-foreground">
              Every claim here maps to code in the public repository or a
              setting in the deployed stack. Ask for the walkthrough.
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {today.map((item) => (
              <div key={item.title} className="group bg-card p-6 transition-colors hover:bg-[#0C0E0F]">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <BadgeCheck className="h-3.5 w-3.5 text-success/70" />
                </div>
                <h3 className="mt-5 text-[13.5px] font-medium text-foreground">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-5 text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative py-20 sm:py-28">
        <div className="container-page">
          <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Roadmap</p>
              <h2 className="display-md mt-4 max-w-[18ch] text-foreground">
                What we are building{" "}
                <span className="font-display italic text-primary">next.</span>
              </h2>
            </div>
            <p className="max-w-[40ch] text-[13px] leading-6 text-muted-foreground">
              Roadmap items are directional. If your evaluation depends on one,
              tell us — it moves the priority list.
            </p>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item, index) => (
              <Reveal key={item.title} delay={index * 50}>
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-muted-foreground">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] ${
                        item.status === "In progress"
                          ? "border-warning/25 bg-warning/10 text-warning"
                          : item.status === "Available on request"
                            ? "border-primary/25 bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[14px] font-medium text-foreground">{item.title}</h3>
                  <p className="mt-2 text-[12px] leading-5 text-muted-foreground">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Working with us</p>
              <h2 className="display-md mt-4 max-w-[16ch] text-foreground">
                A design partner, not a{" "}
                <span className="font-display italic text-primary">logo.</span>
              </h2>
              <p className="mt-5 max-w-[50ch] text-[14px] leading-7 text-muted-foreground">
                Enterprise engagements start as a conversation about your
                environment, not a checkout flow. We will scope what exists,
                what needs work, and what a sensible pilot looks like.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  {
                    icon: FileCheck2,
                    title: "Security questionnaire support",
                    copy: "We answer directly and point to the code or configuration behind each answer.",
                  },
                  {
                    icon: Database,
                    title: "Data flow review",
                    copy: "Walk through exactly what leaves your repository, where it goes and how long it is retained.",
                  },
                  {
                    icon: Clock,
                    title: "Pilot scoping",
                    copy: "Agree on repositories, success criteria and a review cadence before anything is committed.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3.5 rounded-xl border border-border/60 bg-white/[0.015] p-4">
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

            <Reveal delay={100}>
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,hsl(var(--brand)/0.06),hsl(var(--card))_38%)] p-7 sm:p-9">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/[0.07] blur-3xl" />
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <h3 className="relative mt-5 text-[22px] font-semibold tracking-[-0.035em] text-foreground">
                  Start an enterprise conversation
                </h3>
                <p className="relative mt-2 max-w-[42ch] text-[13px] leading-6 text-muted-foreground">
                  Tell us about your team, your compliance requirements and the
                  repositories you'd want to evaluate. We reply personally.
                </p>

                <div className="relative mt-6 space-y-2.5">
                  {["Security review and DPA", "Pilot scope and success criteria", "Residency and deployment options"].map(
                    (item) => (
                      <p key={item} className="flex items-center gap-2.5 text-[12px] text-foreground/80">
                        <Check className="h-3 w-3 text-primary" /> {item}
                      </p>
                    ),
                  )}
                </div>

                <Button size="lg" className="relative mt-7 w-full" asChild>
                  <a href="mailto:sales@codecompanion.ai?subject=Enterprise%20inquiry">
                    <span>Contact sales <ArrowRight className="h-4 w-4" /></span>
                  </a>
                </Button>
                <p className="relative mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60">
                  Or write to support@codecompanion.ai
                </p>
              </div>
            </Reveal>
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
                Evaluate first
              </p>
              <h2 className="display-lg mt-4 max-w-[16ch]">
                Try it before you{" "}
                <span className="font-display italic">discuss it.</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-[14px] leading-7 text-black/60">
                The free tier is the fastest way to see whether the analysis is
                worth your review time. Start there, then talk to us about the
                rest.
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
                <Link to="/pricing">
                  <span>Compare plans <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function EnterpriseBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="absolute left-1/2 top-[-16rem] h-[30rem] w-[46rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[110px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

