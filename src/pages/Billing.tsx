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
    cadence: "per month, when available",
    description: "For teams shipping to production every day, with review volume to match.",
    status: "planned",
    cta: "Join early access",
    href: "mailto:sales@codecompanion.ai?subject=Professional%20early%20access",
    external: true,
    features: [
      { label: "50 repositories", state: "included" },
      { label: "5,000 analyses per month", state: "included" },
      { label: "PR fix comments from the agent", state: "included" },
      { label: "Team workspaces", state: "roadmap" },
      { label: "Priority support", state: "roadmap" },
      { label: "Executive dashboards", state: "roadmap" },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "scoped agreement",
    description: "For organizations with procurement, residency and compliance requirements.",
    status: "conversation",
    cta: "Talk to us",
    href: "/enterprise",
    features: [
      { label: "Unlimited repositories", state: "included" },
      { label: "Self-hosted manifests (preview)", state: "included" },
      { label: "Security review support", state: "included" },
      { label: "SAML / OIDC SSO", state: "roadmap" },
      { label: "US and APAC data regions", state: "roadmap" },
      { label: "Dedicated onboarding", state: "roadmap" },
    ],
  },
];

export default function Billing() {
  const [usage, setUsage] = useState<Usage>({ repositories: 0, analyses: 0, issues: 0 });
  const [analysesToday, setAnalysesToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [repos, analyses, today, latest] = await Promise.all([
        supabase.from("repositories").select("id", { count: "exact", head: true }),
        supabase.from("analyses").select("id", { count: "exact", head: true }),
        supabase
          .from("analysis_jobs")
          .select("id", { count: "exact", head: true })
          .gte("created_at", startOfDay.toISOString()),
        supabase
          .from("analyses")
          .select("security_score")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      setUsage({
        repositories: repos.count ?? 0,
        analyses: analyses.count ?? 0,
        issues: latest.data?.filter((analysis) => (analysis.security_score ?? 100) < 80).length ?? 0,
      });
      setAnalysesToday(today.count ?? 0);
      setLoading(false);
    };
    load();
  }, []);

  const pct = Math.min(100, Math.round((analysesToday / FREE_DAILY_LIMIT) * 100));

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Account"
        title="Billing & usage"
        description="Your plan, current usage and the limits that apply during the public beta."
        actions={
          <Button variant="outline" asChild>
            <Link to="/pricing">
              <span>Compare plans <ArrowUpRight className="h-3 w-3" /></span>
            </Link>
          </Button>
        }
      />

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <CreditCard className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold tracking-[-0.025em] text-foreground">
                  Free public beta
                </h2>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-primary">
                  Active
                </span>
              </div>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                $0 · no card on file · no automatic charges
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="mailto:sales@codecompanion.ai?subject=Plan%20question">
              <span>Ask about plans <ArrowUpRight className="h-3 w-3" /></span>
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border/50 border-b border-border/60 sm:grid-cols-4">
          <UsageCell label="Repositories" value={loading ? "—" : String(usage.repositories)} />
          <UsageCell label="Total analyses" value={loading ? "—" : String(usage.analyses)} />
          <UsageCell label="Low security scores" value={loading ? "—" : String(usage.issues)} hint="Last 20 analyses" />
          <UsageCell
            label="Analyses today"
            value={loading ? "—" : `${analysesToday}/${FREE_DAILY_LIMIT}`}
            hint="Resets daily"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Daily analysis quota</span>
            <span className="font-mono">{pct}% used</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
          <p className="mt-2.5 text-[10.5px] leading-5 text-muted-foreground/70">
            The limit resets at local midnight. When it is exhausted, the API
            returns an error rather than silently charging an overage.
          </p>
        </div>
      </section>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {plans.map((plan) => (
          <section
            key={plan.name}
            className={`flex flex-col rounded-2xl border p-5 ${
              plan.status === "planned"
                ? "border-primary/25 bg-[linear-gradient(180deg,hsl(var(--brand)/0.05),hsl(var(--card))_45%)]"
                : "border-border/70 bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-foreground">{plan.name}</h3>
              <span
                className={`font-mono text-[8.5px] uppercase tracking-[0.1em] ${
                  plan.status === "current"
                    ? "text-primary"
                    : plan.status === "planned"
                      ? "text-warning"
                      : "text-muted-foreground/60"
                }`}
              >
                {plan.status === "current" ? "Current" : plan.status === "planned" ? "Planned" : "By conversation"}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-foreground">
                {plan.price}
              </span>
              <span className="text-[10.5px] text-muted-foreground">{plan.cadence}</span>
            </div>

            <p className="mt-3 text-[11.5px] leading-5 text-muted-foreground">{plan.description}</p>

            <ul className="mt-5 flex-1 space-y-2 border-t border-border/60 pt-4">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-start gap-2 text-[11.5px] leading-5">
                  {feature.state === "included" ? (
                    <Check className="mt-1 h-3 w-3 shrink-0 text-primary" />
                  ) : (
                    <CircleDashed className="mt-1 h-3 w-3 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className={feature.state === "included" ? "text-foreground/80" : "text-muted-foreground/60"}>
                    {feature.label}
                    {feature.state === "roadmap" && (
                      <span className="ml-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/50">
                        roadmap
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-5 w-full"
              variant={plan.status === "planned" ? "default" : "outline"}
              disabled={plan.status === "current"}
              asChild={plan.status !== "current"}
            >
              {plan.status === "current" ? (
                <span>Current plan</span>
              ) : plan.external ? (
                <a href={plan.href}>
                  {plan.cta} <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : (
                <Link to={plan.href}>
                  {plan.cta} <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </Button>
          </section>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Payment method</h2>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-border/60 bg-white/[0.015] p-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-[12px] font-medium text-foreground">No payment method on file</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                We are not collecting card details during the beta. When paid
                plans launch, billing will be handled by a PCI-compliant
                provider; card data will never be stored in this application.
              </p>
            </div>
          </div>
        </section>

        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <Receipt className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Invoices</h2>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-white/[0.012] px-5 py-8 text-center">
            <FileText className="h-4 w-4 text-muted-foreground/50" />
            <p className="mt-3 text-[12px] font-medium text-foreground">No invoices</p>
            <p className="mt-1 max-w-xs text-[11px] leading-5 text-muted-foreground">
              The beta is free. Nothing has been charged and no invoice has been
              generated.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border/60 bg-white/[0.015] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-[11.5px] leading-5 text-muted-foreground">
            Paid plans are planned, not live. Your data and reports stay yours
            whether or not you upgrade.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/pricing">
              <BarChart3 className="h-3.5 w-3.5" /> See comparison
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function UsageCell({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="px-4 py-4 sm:px-5">
      <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-[20px] font-semibold leading-none tracking-[-0.04em] text-foreground">{value}</p>
      {hint && <p className="mt-1.5 text-[10px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

