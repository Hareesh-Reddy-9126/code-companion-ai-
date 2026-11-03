import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "during public beta",
    copy: "For individual engineers who want a rigorous second pair of eyes.",
    cta: "Start free",
    href: "/signup",
    external: false,
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
    cadence: "per month, when available",
    copy: "For teams shipping to production every day, with review volume to match.",
    cta: "Join early access",
    href: "mailto:sales@codecompanion.ai?subject=Professional%20early%20access",
    external: true,
    highlight: true,
    note: "Planned tier",
    features: [
      "50 repositories",
      "5,000 analyses per month",
      "PR review comments on GitHub",
      "Team workspaces (roadmap)",
      "Priority email support (roadmap)",
      "Executive dashboards (roadmap)",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "scoped agreement",
    copy: "For organizations with procurement, residency and compliance requirements.",
    cta: "Talk to us",
    href: "/enterprise",
    external: false,
    highlight: false,
    note: "By conversation",
    features: [
      "Unlimited repositories",
      "SAML SSO (roadmap)",
      "Data residency options",
      "Self-hosted option (roadmap)",
      "Onboarding and support",
      "Security review support",
    ],
  },
];

const comparison: { label: string; starter: string | boolean; pro: string | boolean; ent: string | boolean }[] = [
  { label: "Repositories", starter: "5", pro: "50", ent: "Unlimited" },
  { label: "AI analyses", starter: "10 / day", pro: "5,000 / month", ent: "Scoped" },
  { label: "Quality + security scores", starter: true, pro: true, ent: true },
  { label: "Architecture review", starter: true, pro: true, ent: true },
  { label: "PR review comments", starter: true, pro: true, ent: true },
  { label: "Shareable reports", starter: true, pro: true, ent: true },
  { label: "CLI and API access", starter: true, pro: true, ent: true },
  { label: "Team workspaces", starter: false, pro: "Roadmap", ent: "Roadmap" },
  { label: "SAML SSO", starter: false, pro: false, ent: "Roadmap" },
  { label: "Data residency", starter: "EU", pro: "EU", ent: "Scoped" },
  { label: "Support", starter: "Community", pro: "Priority (roadmap)", ent: "Dedicated" },
];

const faqs = [
  {
    q: "Is the free plan really free?",
    a: "Yes. Starter is free for the duration of the public beta. There is no card on file, no trial countdown and no automatic charge at the end of a period.",
  },
  {
    q: "When will paid plans be available?",
    a: "We are not taking payments yet. Professional is a planned tier; the feature list reflects the intended scope and roadmap items are labeled. Join early access and we will contact you before anything is charged.",
  },
  {
    q: "What happens if I hit the analysis limit?",
    a: "The limit resets daily for Starter. You will see the remaining count in the dashboard. Nothing is charged and no overage invoice is generated during the beta.",
  },
  {
    q: "Can I use this for a commercial project?",
    a: "Yes. Code you analyze remains yours. Reports and suggestions are provided as engineering assistance, not legal or security certification.",
  },
  {
    q: "Do you offer startup or open-source discounts?",
    a: "Paid plans are not live yet, so there is nothing to discount. When they launch, public open-source projects will have a free path.",
  },
];

export default function Pricing() {
  return (
    <div className="relative overflow-hidden">
      <PricingBackdrop />

      <section className="relative pb-10 pt-32 sm:pt-40">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="chip">
              <Sparkles className="h-3 w-3 text-primary" />
              Pricing
            </span>
            <h1 className="display-lg mt-6 text-foreground">
              Free while we earn{" "}
              <span className="font-display italic text-primary">trust.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-7 text-muted-foreground sm:text-[16px]">
              Every capability is available during the public beta. Paid tiers
              are planned, clearly labeled, and not yet charging anyone.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-primary" /> No credit card
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-primary" /> No automatic charges
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-primary" /> Cancel anytime
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative py-14 sm:py-16">
        <div className="container-page">
          <div className="grid items-stretch gap-3 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 70} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-6 sm:p-7 ${
                    plan.highlight
                      ? "border-primary/35 bg-[linear-gradient(180deg,hsl(var(--brand)/0.075),hsl(var(--card))_42%)] shadow-signal"
                      : "border-border/70 bg-card"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-2.5 left-6 rounded-full border border-primary/30 bg-primary px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-primary-foreground">
                      Planned tier
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-foreground">{plan.name}</h2>
                    <span
                      className={`font-mono text-[8.5px] uppercase tracking-[0.12em] ${
                        plan.note === "Available now" ? "text-primary" : "text-muted-foreground/60"
                      }`}
                    >
                      {plan.note}
                    </span>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-[42px] font-semibold leading-none tracking-[-0.055em] text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-[11px] leading-4 text-muted-foreground">{plan.cadence}</span>
                  </div>

                  <p className="mt-4 text-[12.5px] leading-6 text-muted-foreground">{plan.copy}</p>

                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-border/60 pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[12.5px] leading-5 text-muted-foreground">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlight ? "default" : "outline"}
                    className="mt-7 w-full"
                    asChild
                  >
                    {plan.external ? (
                      <a href={plan.href}>
                        {plan.cta} <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <Link to={plan.href}>
                        {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-6">
            <div className="flex flex-col items-start gap-3 rounded-xl border border-warning/20 bg-warning/[0.04] p-4 sm:flex-row sm:items-center">
              <CircleDot className="h-4 w-4 shrink-0 text-warning" />
              <p className="text-[12px] leading-6 text-muted-foreground">
                <span className="font-medium text-foreground/90">Payment honesty:</span>{" "}
                no payment method is collected during the beta, no invoices are
                issued, and no trial converts into a charge. When paid plans go
                live, existing users will be told before anything changes.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative py-16 sm:py-24">
        <div className="container-page">
          <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Compare</p>
              <h2 className="display-md mt-4 text-foreground">What you get today.</h2>
            </div>
            <p className="max-w-[38ch] text-[13px] leading-6 text-muted-foreground">
              Rows marked <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70">roadmap</span>{" "}
              are not shipped yet. They are listed so the plan's direction is
              clear, not to imply availability.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
              <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-b border-border/60 bg-white/[0.02]">
                <div className="px-4 py-3 sm:px-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    capability
                  </span>
                </div>
                {["Starter", "Professional", "Enterprise"].map((name) => (
                  <div key={name} className="border-l border-border/50 px-3 py-3 text-center sm:px-4">
                    <span className="text-[11.5px] font-medium text-foreground">{name}</span>
                  </div>
                ))}
              </div>

              {comparison.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-b border-border/40 last:border-b-0 hover:bg-white/[0.015]"
                >
                  <div className="px-4 py-3 text-[12px] text-muted-foreground sm:px-5">
                    {row.label}
                  </div>
                  {[row.starter, row.pro, row.ent].map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center border-l border-border/40 px-2 py-3 text-center"
                    >
                      {typeof value === "boolean" ? (
                        value ? (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Minus className="h-3.5 w-3.5 text-muted-foreground/30" />
                        )
                      ) : (
                        <span className="text-[11px] text-foreground/80">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-t border-border/60 py-16 sm:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Questions</p>
              <h2 className="display-md mt-4 max-w-[12ch] text-foreground">
                Straight{" "}
                <span className="font-display italic text-primary">answers.</span>
              </h2>
              <p className="mt-5 max-w-[34ch] text-[13px] leading-6 text-muted-foreground">
                If something is unclear, ask. We would rather explain a limit
                than bury it in fine print.
              </p>
              <a
                href="mailto:support@codecompanion.ai"
                className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline"
              >
                Ask a question <ArrowUpRight className="h-3.5 w-3.5" />
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

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60 bg-bone text-bone-foreground">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)]" />
        <div className="container-page relative py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                Start now
              </p>
              <h2 className="display-lg mt-4 max-w-[16ch]">
                No card. No timer.{" "}
                <span className="font-display italic">Just code.</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-[14px] leading-7 text-black/60">
                Create an account and run your first analysis in a few minutes.
              </p>
            </Reveal>
            <Reveal delay={100} className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-black/20 bg-transparent text-bone-foreground hover:bg-black/[0.05]"
                asChild
              >
                <Link to="/enterprise">
                  <ShieldCheck className="h-4 w-4" /> Enterprise
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px] overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="absolute left-1/2 top-[-16rem] h-[30rem] w-[46rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[110px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

