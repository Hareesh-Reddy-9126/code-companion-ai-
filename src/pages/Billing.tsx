import { useEffect, useState } from "react";
import {
  CreditCard, Activity, BarChart3, CheckCircle2, Zap, ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Usage {
  repositories: number;
  analyses: number;
  issues: number;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individual developers getting started.",
    features: ["5 repositories", "10 AI analyses per day", "Security scanning", "Community support"],
    current: true,
  },
  {
    name: "Professional",
    price: "$49",
    description: "For teams shipping to production every day.",
    features: ["50 repositories", "5,000 analyses per month", "PR comments", "Team workspaces", "Priority support"],
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with compliance requirements.",
    features: ["Unlimited repositories", "SAML SSO", "Data residency", "Self-hosted option", "Dedicated support"],
    current: false,
  },
];

const FREE_DAILY_LIMIT = 10;

export default function Billing() {
  const { toast } = useToast();
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
        issues: latest.data?.filter((a) => (a.security_score ?? 100) < 80).length ?? 0,
      });
      setAnalysesToday(today.count ?? 0);
      setLoading(false);
    };
    load();
  }, []);

  const upgrade = (plan: string) => {
    toast({
      title: `${plan} plan`,
      description:
        plan === "Enterprise"
          ? "Email sales@codecompanion.ai for a scoped enterprise agreement."
          : "Paid plans are rolling out. Contact sales to join the early access list.",
    });
  };

  const pct = Math.min(100, Math.round((analysesToday / FREE_DAILY_LIMIT) * 100));

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing &amp; usage</h1>
          <p className="text-muted-foreground mt-1">
            Track your plan, usage and limits
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/pricing">Compare plans</Link>
        </Button>
      </div>

      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Current plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">Free (beta)</h3>
              <p className="text-sm text-muted-foreground">$0 / month · No card required</p>
            </div>
            <Badge>Active</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-border/50 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : usage.repositories}</p>
              <p className="text-xs text-muted-foreground">Repositories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : usage.analyses}</p>
              <p className="text-xs text-muted-foreground">Total analyses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : usage.issues}</p>
              <p className="text-xs text-muted-foreground">Open risk signals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : `${analysesToday}/${FREE_DAILY_LIMIT}`}</p>
              <p className="text-xs text-muted-foreground">Analyses today</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Daily analysis quota</span>
              <span>{pct}% used</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${pct >= 90 ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`enterprise-card ${plan.current ? "ring-2 ring-primary" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.current && <Badge>Current</Badge>}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                {plan.price.startsWith("$") && plan.price !== "$0" && (
                  <span className="text-sm text-muted-foreground">/month</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
                onClick={() => upgrade(plan.name)}
              >
                {plan.current ? "Current plan" : plan.name === "Enterprise" ? "Contact sales" : "Join early access"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" /> Payment method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No payment method on file</p>
              <p className="text-sm text-muted-foreground">
                Paid plans will be billed securely through Stripe. This app never
                stores card details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            No invoices yet. You are on the free beta.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
