import { Link } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "during public beta",
    copy: "For individual engineers who want a rigorous second pair of eyes.",
    cta: "Start free",
    href: "/signup",
    highlight: false,
    note: "Available now",
    features: [
      "5 repositories",
      "10 AI analyses per day",
      "Quality, security and performance scores",
      "Architecture review",
      "Analysis history",
      "Shareable public reports",
      "CLI access",
    ],
  },
  {
    name: "Professional",
    price: "$49",
    cadence: "per month",
    copy: "For teams shipping to production every day.",
    cta: "Join early access",
    href: "mailto:sales@codecompanion.ai?subject=Professional%20early%20access",
    highlight: true,
    note: "Planned tier",
    features: [
      "50 repositories",
      "5,000 analyses per month",
      "PR review comments on GitHub",
      "Team workspaces (roadmap)",
      "Priority email support (roadmap)",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "scoped agreement",
    copy: "For organizations with procurement, residency and compliance requirements.",
    cta: "Talk to us",
    href: "/enterprise",
    highlight: false,
    note: "By conversation",
    features: [
      "Unlimited repositories",
      "SAML SSO (roadmap)",
      "Data residency options",
      "Self-hosted option (roadmap)",
      "Onboarding and support",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-36 pb-32 sm:pb-40">
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Pricing
            </p>
            <h1 className="text-h1 mx-auto mt-6 max-w-[48ch] text-foreground">
              Free while we earn{" "}
              <span className="font-medium text-brand">trust.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
              Every capability is available during the public beta. Paid tiers
              are planned, clearly labeled, and not yet charging anyone.
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
              <span>No automatic charges</span>
              <span>·</span>
              <Check className="h-3 w-3 text-brand" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-border py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-4xl mb-16">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Plan comparison
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              See what's included<span className="font-medium text-brand">.</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      className="pb-4 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="group">
                  <td className="py-4 font-medium text-foreground">Repositories</td>
                  {plans.map((p) => (
                    <td key={p.name} className="py-4 text-right text-muted-foreground">
                      {p.name === "Starter" ? "5" : p.name === "Professional" ? "50" : "Unlimited"}
                    </td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="py-4 font-medium text-foreground">AI analyses</td>
                  {plans.map((p) => (
                    <td key={p.name} className="py-4 text-right text-muted-foreground">
                      {p.name === "Starter" ? "10 / day" : p.name === "Professional" ? "5,000 / month" : "Scoped"}
                    </td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="py-4 font-medium text-foreground">Security scanning</td>
                  {plans.map(() => (
                    <td className="py-4 text-right">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                    </td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="py-4 font-medium text-foreground">Shareable reports</td>
                  {plans.map(() => (
                    <td className="py-4 text-right">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                    </td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="py-4 font-medium text-foreground">Team workspaces</td>
                  {plans.map((p) => (
                    <td key={p.name} className="py-4 text-right text-muted-foreground/60">
                      {p.name === "Starter" ? "—" : p.name === "Professional" ? "Roadmap" : "Roadmap"}
                    </td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="py-4 font-medium text-foreground">SAML SSO</td>
                  {plans.map((p) => (
                    <td key={p.name} className="py-4 text-right text-muted-foreground/60">
                      {p.name === "Enterprise" ? "Roadmap" : "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Questions
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Straight <span className="font-medium text-brand">answers.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-2xl space-y-3">
            <details className="group border-b border-border pb-4 pt-2 last:border-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground marker:hidden list-none">
                Is the free plan really free?
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-90">
                  <span className="text-xs leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Yes. Starter is free for the duration of the public beta. No card on file, no trial countdown, no automatic charge.
              </p>
            </details>
            <details className="group border-b border-border pb-4 pt-2 last:border-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground marker:hidden list-none">
                When will paid plans be available?
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-90">
                  <span className="text-xs leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We are not taking payments yet. Professional is a planned tier. Join early access and we will contact you before anything is charged.
              </p>
            </details>
            <details className="group border-b border-border pb-4 pt-2 last:border-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground marker:hidden list-none">
                Can I use this for a commercial project?
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-90">
                  <span className="text-xs leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Yes. Code you analyze remains yours. Reports and suggestions are provided as engineering assistance, not legal certification.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">
              Ready to start?
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Begin reviewing <span className="font-medium text-brand">code.</span>
            </h2>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
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

function PlanCard({
  plan,
}: {
  plan: {
    name: string;
    price: string;
    cadence: string;
    copy: string;
    cta: string;
    href: string;
    highlight: boolean;
    note: string;
    features: string[];
  };
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-xl border p-8 ${
        plan.highlight ? "border-brand bg-brand/5" : "border-border bg-card"
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-8 rounded-full border border-brand bg-brand px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-foreground">
          {plan.note}
        </span>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {plan.note}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-[32px] font-medium leading-none tracking-tight text-foreground">
          {plan.price}
        </span>
        <span className="text-xs text-muted-foreground">{plan.cadence}</span>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{plan.copy}</p>
      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-3 w-3 shrink-0 text-brand" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        key="cta"
        variant={plan.highlight ? "default" : "outline"}
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
