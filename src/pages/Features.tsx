import { Link } from "react-router-dom";
import {
  Cpu, ShieldCheck, Zap, Layers, Code2, Users, BarChart3,
  Clock, GitBranch, AlertTriangle, Lightbulb, Smartphone,
  Monitor, CheckCircle2, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const featureItems = [
  {
    title: "AI-Powered Code Review",
    description: "Enterprise-grade LLM analysis using Nemotron 3 Ultra with 1M token context window.",
    icon: Cpu,
  },
  {
    title: "Real-Time PR Analysis",
    description: "Instantly analyze pull requests with inline review comments posted to GitHub.",
    icon: GitBranch,
  },
  {
    title: "Security Vulnerability Scanning",
    description: "Detect hardcoded secrets, SQL injection, XSS, and OWASP Top 10 vulnerabilities.",
    icon: ShieldCheck,
  },
  {
    title: "Performance & Architecture",
    description: "Analyze bundle size, detect inefficient loops, and visualize project architecture.",
    icon: BarChart3,
  },
  {
    title: "Multi-Organization Workspaces",
    description: "Separate workspaces for teams with role-based access control and data isolation.",
    icon: Users,
  },
  {
    title: "GitHub Integration",
    description: "Seamless OAuth connection, automatic repository syncing, and PR review comments.",
    icon: Code2,
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-6">
            Enterprise-Grade Code Intelligence
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything engineering teams need to ship secure, high-quality code at scale.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {featureItems.map((f) => (
              <div key={f.title} className="enterprise-card">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 dark:bg-blue-900/20 dark:text-blue-400">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
              Built for Modern Engineering Teams
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="enterprise-card p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">GitHub PR Reviews</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Our AI reviews every pull request and posts inline comments directly on GitHub.
                Never merge broken code again.
              </p>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-foreground">PR Review Comments</span>
              </div>
            </div>
            <div className="enterprise-card p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Security First</h3>
              <p className="text-muted-foreground text-sm mb-4">
                AES-256-GCM encryption for stored tokens, SOC2 compliance, and RLS for data isolation.
                Your code never leaves your control.
              </p>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-foreground">SOC2 Type II Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
            Start Analyzing Code Today
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join engineering teams shipping secure, high-quality code with Code Companion AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="enterprise-btn text-base px-8 py-4" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button className="enterprise-btn-outline text-base px-8 py-4" asChild>
              <Link to="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
