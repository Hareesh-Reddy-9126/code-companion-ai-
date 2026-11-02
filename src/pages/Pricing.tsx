import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    description: "Free beta for individual developers",
    features: [
      "Up to 5 repositories",
      "10 AI analyses per day",
      "Security scanning",
      "Analysis history and shared reports",
      "Community support",
    ],
    highlighted: false,
    cta: "Start free",
    href: "/signup",
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$49",
    description: "Planned tier for growing engineering teams",
    features: [
      "50 repositories",
      "5,000 analyses per month",
      "PR review comments on GitHub",
      "Team workspaces (roadmap)",
      "Priority email support (roadmap)",
      "Executive dashboards",
    ],
    highlighted: true,
    cta: "Join early access",
    href: "mailto:sales@codecompanion.ai?subject=Professional%20early%20access",
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Scoped agreements for larger organizations",
    features: [
      "Unlimited repositories",
      "SAML SSO (roadmap)",
      "SOC 2 aligned controls",
      "Self-hosted option",
      "EU data residency today",
      "Priority support",
    ],
    highlighted: false,
    cta: "Contact sales",
    href: "/enterprise",
    variant: "outline" as const,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Everything is free during the public beta. Paid plans are not yet
            available.
          </p>
          <p className="text-sm text-muted-foreground mb-12">
            No credit card required. No automatic charges.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`enterprise-card flex flex-col ${
                  plan.highlighted ? "ring-2 ring-blue-500 scale-105 relative" : ""
                }`}
              >
                <div className={`px-6 py-4 ${plan.highlighted ? "bg-blue-600/10 border-blue-200" : ""}`}>
                  {plan.highlighted && (
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                      Planned
                    </span>
                  )}
                  <h3 className={`text-xl font-bold text-foreground mt-4 ${plan.highlighted ? "text-blue-600" : ""}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    {plan.price.startsWith("$") && plan.price !== "$0" && (
                      <span className="text-sm text-muted-foreground">/month when available</span>
                    )}
                    {plan.price === "$0" && (
                      <span className="text-sm text-muted-foreground">during beta</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="flex-1 space-y-3 px-6 py-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full py-3 ${plan.highlighted ? "enterprise-btn" : "enterprise-btn-outline"}`}
                >
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="enterprise-card p-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
              Ready to Ship Better Code?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Create a free account and analyze your first repository in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="enterprise-btn w-full sm:w-auto" asChild>
                <Link to="/signup">Start free</Link>
              </Button>
              <Button className="enterprise-btn-outline w-full sm:w-auto" asChild>
                <Link to="/enterprise">Talk to sales</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
