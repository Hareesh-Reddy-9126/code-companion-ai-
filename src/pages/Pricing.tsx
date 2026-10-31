import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    description: "For individual developers and hobbyists",
    features: [
      "5 repositories/month",
      "Basic AI code analysis",
      "Security scanning",
      "Public reports",
      "Community support",
    ],
    highlighted: false,
    cta: "Get Started",
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$49",
    description: "For growing engineering teams",
    features: [
      "50 repositories/month",
      "Advanced AI analysis (Nemotron 3 Ultra)",
      "PR review comments on GitHub",
      "Security vulnerability scanning",
      "Team workspaces (up to 10 members)",
      "Priority email support",
      "Executive dashboards",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "$499",
    description: "For tech giants and enterprises",
    features: [
      "Unlimited repositories",
      "Custom AI models",
      "SOC2 Type II compliance",
      "SAML SSO (Okta, Azure AD)",
      "Unlimited team members",
      "Dedicated SRE support",
      "White-label options",
      "Full API access",
      "24/7 phone support",
      "Custom data residency",
    ],
    highlighted: false,
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

export default function Pricing() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Choose the plan that fits your team. Upgrade anytime.
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
                      Most Popular
                    </span>
                  )}
                  <h3 className={`text-xl font-bold text-foreground mt-4 ${plan.highlighted ? "text-blue-600" : ""}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="flex-1 space-y-3 px-6 py-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-3 ${plan.highlighted ? "enterprise-btn" : "enterprise-btn-outline"}`}
                >
                  {plan.cta}
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
              Join hundreds of engineering teams using Code Companion AI to ship secure,
              high-quality code faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative w-full sm:w-96">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="enterprise-input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button className="enterprise-btn w-full sm:w-auto">Get Started</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
