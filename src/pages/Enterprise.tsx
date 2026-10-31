import { Link } from "react-router-dom";
import {
  ShieldCheck, Users, Layers, Lock, Globe, Monitor,
  BarChart3, CheckCircle2, Smartphone, Cpu, Mail, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const enterpriseFeatures = [
  {
    title: "SOC2 Type II Compliance",
    description: "Full SOC2 Type II certification with regular third-party audits.",
    icon: ShieldCheck,
  },
  {
    title: "SAML SSO Integration",
    description: "Connect with Okta, Azure AD, Google Workspace, or any SAML 2.0 provider.",
    icon: Lock,
  },
  {
    title: "Unlimited Team Members",
    description: "Add unlimited developers with granular role-based access control.",
    icon: Users,
  },
  {
    title: "Custom AI Models",
    description: "Bring your own AI model or fine-tune Nemotron on your codebase patterns.",
    icon: Cpu,
  },
  {
    title: "White-Label Options",
    description: "Custom branding, custom domain, and white-labeled reports.",
    icon: Globe,
  },
  {
    title: "24/7 Dedicated Support",
    description: "Dedicated SRE, 24/7 phone support, and guaranteed response times.",
    icon: Monitor,
  },
  {
    title: "Full API Access",
    description: "REST API for code analysis, webhooks, and CLI for CI/CD integration.",
    icon: Layers,
  },
  {
    title: "Custom Data Residency",
    description: "Choose where your data is stored — US, EU, or custom regions.",
    icon: Clock,
  },
];

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
              <ShieldCheck className="w-3 h-3 mr-1.5" /> SOC2 Type II
            </span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-8 text-balance">
            Built for Tech Giants
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
            Enterprise-grade code intelligence with SOC2 compliance, SAML SSO,
            dedicated support, and unlimited scale.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {enterpriseFeatures.map((f) => (
              <div key={f.title} className="enterprise-card p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50/60 flex items-center justify-center text-blue-600 mb-5 dark:bg-blue-900/20 dark:text-blue-400">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="enterprise-card p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact our sales team for custom pricing, dedicated infrastructure,
              and white-label options.
            </p>
            <Button className="enterprise-btn text-base px-8 py-4" asChild>
              <Link to="/docs">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
