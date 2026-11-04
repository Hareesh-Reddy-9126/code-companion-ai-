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
    title: "SAML SSO",
    copy: "Single sign-on via SAML 2.0 for organization-wide access control.",
  },
  {
    icon: Building2,
    title: "Workspaces",
    copy: "Team workspaces with role-based access and shared billing.",
  },
  {
    icon: Server,
    title: "Self-hosted option",
    copy: "Deploy the edge functions and database policies in your own VPC.",
  },
  {
    icon: Network,
    title: "Custom domain",
    copy: "Serve the dashboard and reports from your own domain.",
  },
];

const compliance = [
  { label: "SOC 2 Type II", status: "In progress" },
  { label: "GDPR", status: "Aligned" },
  { label: "ISO 27001", status: "Roadmap" },
  { label: "Penetration testing", status: "Planned" },
];

export default function Enterprise() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-36 pb-32 sm:pb-40">
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Enterprise
            </p>
            <h1 className="text-h1 mx-auto mt-6 max-w-[48ch] text-foreground">
              Security and scale for{" "}
              <span className="font-medium text-brand">engineering teams.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
              Encrypted token storage, row-level security, EU data region and
              audit-friendly records — built for teams that ship on evidence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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

      {/* Security features */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Security posture
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Built to <span className="font-medium text-brand">protect.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {today.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="border-y border-border py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Compliance
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Standards we <span className="font-medium text-brand">follow.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-2xl space-y-3">
            {compliance.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                <span className="text-sm text-foreground">{item.label}</span>
                <span
                  className={`rounded-full border px-2 py-0 font-mono text-[9px] uppercase tracking-wider ${
                    item.status === "In progress" ? "border-warning bg-warning/10 text-warning" : "border-brand bg-brand/10 text-brand"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Roadmap
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Coming <span className="font-medium text-brand">next.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              Items below are planned — not yet available. Timelines are not
              guaranteed.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {roadmap.map((item) => (
              <RoadmapItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">
              Need enterprise features?
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Let's <span className="font-medium text-brand">talk.</span>
            </h2>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  <span>Start free <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="mailto:sales@codecompanion.ai?subject=Enterprise%20inquiry">
                  <span>Contact sales</span>
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
  title,
  copy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-brand" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {title}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}

function RoadmapItem({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-muted-foreground/40" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          Planned
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}
