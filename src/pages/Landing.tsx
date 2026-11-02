import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Layers,
  Code2,
  Users,
  BarChart3,
  Clock,
  Mail,
  Lock,
  Globe,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const featureGrid = [
  {
    icon: Cpu,
    title: "AI-Powered Code Analysis",
    desc: "Deep review with NVIDIA Nemotron models and automatic fallback for reliable results.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade Security",
    desc: "AES-256-GCM token encryption and row-level security. SOC 2 aligned controls.",
  },
  {
    icon: Zap,
    title: "Live Analysis Tracking",
    desc: "Follow every analysis job from queued to complete with instant results.",
  },
  {
    icon: Layers,
    title: "Workspace Ready",
    desc: "Per-user isolation today, with team workspaces and RBAC on the enterprise roadmap.",
  },
  {
    icon: Code2,
    title: "GitHub Integration",
    desc: "OAuth connection, automatic repository sync and pull request fix comments.",
  },
  {
    icon: BarChart3,
    title: "Executive Dashboards",
    desc: "Security scores, quality trends and architecture health for leadership.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    description: "For individual developers",
    features: ["5 repositories", "10 AI analyses per day", "Security scanning", "Community support"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    description: "For growing teams",
    features: ["50 repositories", "5,000 analyses per month", "PR review comments", "Priority support", "Team workspaces"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with compliance needs",
    features: ["Unlimited repositories", "Custom AI models", "SOC 2 aligned controls", "Data residency", "Self-hosted option", "Priority support", "API access"],
    highlighted: false,
  },
];

export default function Landing() {
  const heroStats = [
    { label: "Primary model", value: "Nemotron 3" },
    { label: "Token encryption", value: "AES-256" },
    { label: "Data region", value: "EU" },
    { label: "Free tier", value: "$0" },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px] dark:bg-blue-900/20" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[120px] dark:bg-purple-900/20" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Code<span className="text-blue-600">Companion</span> AI
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Enterprise Code Intelligence</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Features</Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Pricing</Link>
            <Link to="/docs" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Docs</Link>
            <Link to="/enterprise" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Enterprise</Link>
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">Login</Link>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25" asChild>
              <Link to="/signup">Start Free</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
              <CheckCircle2 className="w-3 h-3 mr-1.5" /> SOC 2 aligned
            </span>
            <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400">
              <ShieldCheck className="w-3 h-3 mr-1.5" /> Enterprise Ready
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 text-balance">
            Enterprise Code Intelligence,{' '}
            <span className="gradient-text">Powered by AI</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            Automated code review, security scanning, and architecture analysis for engineering teams.
            Autonomous PR fixes, transparent scoring, and a free tier to start today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button className="enterprise-btn text-base px-8 py-4" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button className="enterprise-btn-outline text-base px-8 py-4" asChild>
              <Link to="/docs">View Documentation</Link>
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/50">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-left">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Everything You Need for Code Excellence
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From security scanning to architecture analysis, Code Companion AI gives your team
              complete visibility into every line of code.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featureGrid.map((feature) => (
              <div key={feature.title} className="enterprise-card">
                <div className="w-12 h-12 rounded-xl bg-blue-50/60 flex items-center justify-center text-blue-600 mb-6 dark:bg-blue-900/20 dark:text-blue-400">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-muted/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free today. Paid plans are in early access; enterprise agreements are scoped with our team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`enterprise-card flex flex-col ${plan.highlighted ? "ring-2 ring-blue-500 scale-105" : ""}`}>
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
                    {plan.price.startsWith("$") && plan.price !== "$0" && (
                      <span className="text-sm text-muted-foreground">/month</span>
                    )}
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
                  asChild
                  className={`w-full py-3 ${plan.highlighted ? "enterprise-btn" : "enterprise-btn-outline"}`}
                  key={plan.name}
                >
                  <Link to={plan.name === "Enterprise" ? "/enterprise" : "/signup"}>
                    {plan.name === "Enterprise" ? "Contact sales" : "Start free"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="enterprise-card p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
              Ready to Ship Better Code?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start reviewing your first repository in minutes with a free account.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="enterprise-btn w-full sm:w-auto" asChild>
                <Link to="/signup">Get started free</Link>
              </Button>
              <Button className="enterprise-btn-outline w-full sm:w-auto" asChild>
                <Link to="/enterprise">Talk to sales</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Code Companion AI</h3>
                <p className="text-xs text-muted-foreground">Enterprise Code Intelligence</p>
              </div>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
              <Link to="/security-policy" className="hover:text-blue-600 transition-colors">Security</Link>
              <Link to="/enterprise" className="hover:text-blue-600 transition-colors">Enterprise</Link>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@codecompanion.ai"
                aria-label="Email support"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <Link
                to="/security-policy"
                aria-label="Security policy"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <Lock className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-8 text-center">
            © 2026 Code Companion AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
