import { useState } from "react";
import {
  CreditCard, Activity, BarChart3, Clock, TrendingUp,
  AlertCircle, CheckCircle2, DollarSign, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface BillingPlan {
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    repos: number;
    analyses: number;
    team_members: number;
  };
}

interface Invoice {
  id: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  description: string;
}

const plans: BillingPlan[] = [
  {
    name: "Starter",
    price: 0,
    interval: "month",
    features: ["5 repositories", "Basic AI analysis", "Community support"],
    limits: { repos: 5, analyses: 100, team_members: 1 },
  },
  {
    name: "Professional",
    price: 49,
    interval: "month",
    features: ["50 repositories", "Nemotron 3 Ultra AI", "PR review comments", "Team workspaces", "Priority support"],
    limits: { repos: 50, analyses: 5000, team_members: 10 },
  },
  {
    name: "Enterprise",
    price: 499,
    interval: "month",
    features: ["Unlimited repositories", "Custom AI models", "SOC2 Type II", "SAML SSO", "Dedicated SRE", "24/7 support", "API access"],
    limits: { repos: -1, analyses: -1, team_members: -1 },
  },
];

const invoices: Invoice[] = [
  { id: "INV-001", amount: 499, status: "paid", date: "2026-10-01", description: "Enterprise Plan - October 2026" },
  { id: "INV-002", amount: 499, status: "paid", date: "2026-09-01", description: "Enterprise Plan - September 2026" },
  { id: "INV-003", amount: 499, status: "pending", date: "2026-11-01", description: "Enterprise Plan - November 2026" },
];

export default function Billing() {
  const [plan, setPlan] = useState("enterprise");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { toast } = useToast();

  const currentPlan = plans.find((p) => p.name.toLowerCase() === plan);

  const handleUpgrade = async (p: BillingPlan) => {
    toast({
      title: "Plan Updated",
      description: `Successfully upgraded to ${p.name} plan`,
    });
  };

  const addPaymentMethod = async () => {
    if (!paymentMethod) {
      toast({ title: "Error", description: "Enter payment method details", variant: "destructive" });
      return;
    }
    toast({ title: "Payment Method Added", description: "Securely stored for future billing" });
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your plan, payment methods, and invoices
          </p>
        </div>
        <Button variant="outline">
          <DollarSign className="w-4 h-4 mr-2" /> Download Tax Receipts
        </Button>
      </div>

      {/* Current Plan */}
      <div className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-foreground">{currentPlan?.name}</h3>
              <p className="text-sm text-muted-foreground">${currentPlan?.price}/month</p>
            </div>
            <Badge variant={currentPlan?.name === "Enterprise" ? "primary" : "secondary"}>
              {currentPlan?.name}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-border/50">
            <div>
              <p className="text-xs font-bold text-foreground">{currentPlan?.limits.repos === -1 ? "∞" : currentPlan?.limits.repos}</p>
              <p className="text-xs text-muted-foreground">Repositories</p>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{currentPlan?.limits.analyses === -1 ? "∞" : currentPlan?.limits.analyses}</p>
              <p className="text-xs text-muted-foreground">AI Analyses/mo</p>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{currentPlan?.limits.team_members === -1 ? "∞" : currentPlan?.limits.team_members}</p>
              <p className="text-xs text-muted-foreground">Team Members</p>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Plan Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.name} className={`enterprise-card ${plan === p.name.toLowerCase() ? "ring-2 ring-blue-500" : "hover:border-primary/30 cursor-pointer"}`}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">${p.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleUpgrade(p)}
                className={`w-full ${plan === p.name.toLowerCase() ? "enterprise-btn" : "enterprise-btn-outline"}`}
              >
                {plan === p.name.toLowerCase() ? "Current Plan" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method */}
      <div className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" /> Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Payment Method</h3>
                <p className="text-sm text-muted-foreground">Securely stored with Stripe</p>
              </div>
              <Badge variant={paymentMethod ? "default" : "destructive"}>
                {paymentMethod ? "Active" : "Not configured"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Card number"
                className="enterprise-input"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Input placeholder="MM/YY" className="enterprise-input max-w-xs" />
              <Input placeholder="CVC" className="enterprise-input max-w-xs" />
            </div>
            <Button onClick={addPaymentMethod} disabled={!paymentMethod}>
              Save Payment Method
            </Button>
          </div>
        </CardContent>
      </div>

      {/* Invoices */}
      <div className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" /> Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border/50">
                  <th className="pb-3 text-muted-foreground font-medium">Invoice ID</th>
                  <th className="pb-3 text-muted-foreground font-medium">Amount</th>
                  <th className="pb-3 text-muted-foreground font-medium">Status</th>
                  <th className="pb-3 text-muted-foreground font-medium">Date</th>
                  <th className="pb-3 text-muted-foreground font-medium">Description</th>
                  <th className="pb-3 text-muted-foreground font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">#{inv.id}</td>
                    <td className="py-3 text-foreground">${inv.amount}</td>
                    <td className="py-3">
                      <Badge variant={inv.status === "paid" ? "default" : inv.status === "pending" ? "secondary" : "destructive"}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{inv.date}</td>
                    <td className="py-3 text-muted-foreground">{inv.description}</td>
                    <td className="py-3">
                      <Button variant="outline" size="sm">Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>

      {/* Usage Analytics */}
      <div className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Analyses</p>
              <p className="text-2xl font-bold text-foreground">340</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">+12% vs last month</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Repos Connected</p>
              <p className="text-2xl font-bold text-foreground">12</p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Updated 2h ago</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Cost</p>
              <p className="text-2xl font-bold text-foreground">$499</p>
              <div className="flex items-center gap-1 mt-2">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span className="text-xs text-amber-600 font-medium">Within budget</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
