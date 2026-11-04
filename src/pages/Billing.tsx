import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  CircleDashed,
  CreditCard,
  FileText,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";

interface Usage {
  repositories: number;
  analyses: number;
  issues: number;
}

interface PlanFeature {
  label: string;
  state: "included" | "roadmap";
}

interface Plan {
  name: string;
  price: string;
  cadence: string;
  description: string;
  status: "current" | "planned" | "conversation";
  cta: string;
  href: string;
  external?: boolean;
  features: PlanFeature[];
}

const FREE_DAILY_LIMIT = 10;

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "during public beta",
    description: "For individual engineers who want a rigorous second pair of eyes.",
    status: "current",
    cta: "Current plan",
    href: "/repositories",
    features: [
      { label: "5 repositories", state: "included" },
      { label: "10 AI analyses per day", state: "included" },
      { label: "Quality, security and performance scores", state: "included" },
      { label: "Architecture review", state: "included" },
      { label: "History and shareable reports", state: "included" },
      { label: "CLI access", state: "included" },
    ],
  },
  {
    name: "Professional",
    price: "$49",
    cadence: "per month",
    description: "For teams shipping to production every day.",
    status: "planned",
    cta: "Join early access",
    href: "mailto:sales@codecompanion.ai?subject=Professional%20early%20access",
    external: true,
    features: [
      { label: "50 repositories", state: "roadmap" },
      { label: "5,000 analyses per month", state: "roadmap" },
      { label: "PR review comments", state: "roadmap" },
      { label: "Team workspaces", state: "roadmap" },
      { label: "Priority email support", state: "roadmap" },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "scoped agreement",
    description: "For organizations with procurement and compliance requirements.",
    status: "conversation",
    cta: "Talk to sales",
    href: "/enterprise",
    features: [
      { label: "Unlimited repositories", state: "roadmap" },
      { label: "SAML SSO", state: "roadmap" },
      { label: "Data residency options", state: "roadmap" },
      { label: "Self-hosted option", state: "roadmap" },
      { label: "Onboarding and support", state: "roadmap" },
    ],
  },
];

export default function Billing() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [repos, analyses] = await Promise.all([
        supabase.from("repositories").select("id", { count: "exact", head: true }),
        supabase.from("analyses").select("id", { count: "exact", head: true }),
      ]);
      setUsage({
        repositories: repos.count || 0,
        analyses: analyses.count || 0,
        issues: 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative">
      <PageHeader
        group="Account"
        title="Billing"
        description="Usage, plan and payment information for your workspace."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <span><BarChart3 className="h-3.5 w-3.5" /> View dashboard</span>
            </Link>
          </Button>
        }
      />

      {/* Usage */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Usage this month
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Free during public beta
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <UsageStat
            title="Repositories"
            value={usage?.repositories ?? 0}
            limit={5}
            icon={BarChart3}
          />
          <UsageStat
            title="Analyses"
            value={usage?.analyses ?? 0}
            limit={FREE_DAILY_LIMIT}
            icon={Sparkles}
            note="/ day"
          />
          <UsageStat
            title="Issues found"
            value={usage?.issues ?? 0}
            icon={ShieldCheck}
          />
        </div>
      </section>

      {/* Plans */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Plans
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Choose your plan
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      {/* Honest disclosure */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <CircleDashed className="h-4 w-4 text-warning" />
          <h2 className="text-sm font-semibold text-foreground">Honest disclosure</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
          Paid plans are not yet available. There is no card on file, no trial
          countdown, and no automatic charge. When paid tiers launch, they will
          be clearly labeled and opt-in.
        </p>
        <div className="flex flex-wrap gap-3">
          <BadgeLite label="No card required" tone="neutral" />
          <BadgeLite label="No automatic charges" tone="neutral" />
          <BadgeLite label="Cancel anytime" tone="neutral" />
          <BadgeLite label="Free during beta" tone="good" />
        </div>
      </section>
    </div>
  );
}

function UsageStat({
  title,
  value,
  limit,
  icon: Icon,
  note,
}: {
  title: string;
  value: number;
  limit?: number;
  icon: React.ComponentType<{ className?: string }>;
  note?: string;
}) {
  const pct = limit ? Math.min((value / limit) * 100, 100) : 0;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-brand" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {title}
        </span>
      </div>
      <div className="text-[24px] font-medium leading-none tracking-tight text-foreground mb-1">
        {value}
      </div>
      {limit && (
        <>
          <p className="text-xs text-muted-foreground">{note || ""} {value} / {limit}</p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
        </>
      )}
    </div>
  );
}

function PlanCard({
  plan,
}: {
  plan: {
    name: string;
    price: string;
    cadence: string;
    description: string;
    status: "current" | "planned" | "conversation";
    cta: string;
    href: string;
    external?: boolean;
    features: PlanFeature[];
  };
}) {
  const isCurrent = plan.status === "current";
  return (
    <div
      className={`relative flex h-full flex-col rounded-xl border p-8 ${
        isCurrent
          ? "border-brand bg-brand/5"
          : "border-border bg-card"
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-8 rounded-full border border-brand bg-brand px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-foreground">
          Current plan
        </span>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
        <span className={`font-mono text-[10px] uppercase tracking-wider ${
          plan.status === "planned"
            ? "border-warning bg-warning/10 text-warning"
            : plan.status === "conversation"
              ? "border-info bg-info/10 text-info"
              : "border-brand bg-brand/10 text-brand"
        }`}>
          {plan.status}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-[32px] font-medium leading-none tracking-tight text-foreground">
          {plan.price}
        </span>
        <span className="text-xs text-muted-foreground">{plan.cadence}</span>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-3 w-3 shrink-0 text-brand" />
            {feature.label}
          </li>
        ))}
      </ul>
      <Button
        key="cta"
        variant={isCurrent ? "outline" : "default"}
        className="mt-8 w-full"
        asChild
      >
        {plan.href.startsWith("mailto") ? (
          <a href={plan.href}>{plan.cta}</a>
        ) : (
          <Link to={plan.href}>{plan.cta}</Link>
        )}
      </Button>
    </div>
  );
}

function BadgeLite({ label, tone }: { label: string; tone: "neutral" | "good" }) {
  return (
    <span
      className={`rounded-full border px-2 py-0 font-mono text-[9px] uppercase tracking-wider ${
        tone === "good" ? "border-brand bg-brand/10 text-brand" : "border-border bg-card text-muted-foreground"
      }`}
    >
      {label}
    </span>
  );
}
