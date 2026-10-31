import { useEffect, useState } from "react";
import {
  Users, Shield, CreditCard, Activity, TrendingUp,
  BarChart3, Settings, Mail, Lock, Globe, Monitor,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface OrgMember {
  id: string;
  email: string;
  role: "admin" | "developer" | "viewer" | "billing";
  status: "active" | "invited";
  joined_at: string;
}

interface OrgStats {
  repositories: number;
  analyses_today: number;
  security_issues: number;
  team_members: number;
}

export default function Enterprise() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [org, setOrg] = useState<any>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  [0]; // placeholder for stats
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrg();
  }, []);

  const loadOrg = async () => {
    // In production, this would query orgs table
    setOrg({
      id: "org_1",
      name: profile?.name || "My Organization",
      plan: "Enterprise",
      members_count: 1,
      domains: ["example.com"],
      sso_enabled: false,
      data_residency: "US",
      created_at: new Date().toISOString(),
    });
    setMembers([
      { id: "1", email: profile?.email || "admin@example.com", role: "admin", status: "active", joined_at: new Date().toISOString() },
    ]);
    setLoading(false);
  };

  const inviteMember = async (email: string, role: string) => {
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${email} as ${role}`,
    });
    loadOrg();
  };

  const toggleSSO = async () => {
    toast({
      title: "SAML SSO",
      description: "Configure SAML SSO in Enterprise settings",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organization Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage team, billing, security, and compliance for {org?.name}
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">
            <span>← Back to Dashboard</span>
          </Link>
        </Button>
      </div>

      {/* Organization Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="enterprise-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">{org?.name}</h3>
                <p className="text-xs text-muted-foreground">Organization ID: {org?.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Plan</p>
                <Badge variant="primary">{org?.plan}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Data Residency</p>
                <span className="text-sm font-medium text-foreground">{org?.data_residency}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                SAML SSO: {org?.sso_enabled ? "Enabled" : "Not configured"}
              </span>
              <Button variant="outline" size="sm" onClick={toggleSSO}>
                {org?.sso_enabled ? "Manage" : "Configure"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {m.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.email}</p>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                  <Badge variant={m.status === "active" ? "default" : "secondary"}>
                    {m.status}
                  </Badge>
                </div>
              ))}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Input placeholder="Enter email address" className="flex-1" />
                  <select
                    className="enterprise-input flex-1 max-w-xs"
                    defaultValue="developer"
                  >
                    <option value="developer">Developer</option>
                    <option value="viewer">Viewer</option>
                    <option value="billing">Billing Admin</option>
                  </select>
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Enter email address"]') as HTMLInputElement;
                      const select = document.querySelector('select') as HTMLSelectElement;
                      if (input.value) {
                        inviteMember(input.value, select.value);
                        input.value = "";
                      }
                    }}
                  >
                    Invite
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="enterprise-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" /> Security & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">SOC2 Type II</h3>
                <p className="text-xs text-muted-foreground">Third-party audited security controls</p>
              </div>
              <Badge variant="outline">Certified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">GDPR / CCPA</h3>
                <p className="text-xs text-muted-foreground">Data privacy compliance</p>
              </div>
              <Badge variant="outline">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Data Encryption</h3>
                <p className="text-xs text-muted-foreground">AES-256-GCM at rest, TLS 1.3 in transit</p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div>
                <h3 className="font-medium text-foreground">Custom Domain</h3>
                <p className="text-xs text-muted-foreground">White-label your instance</p>
              </div>
              <Input placeholder="analytics.yourcompany.com" className="w-full max-w-xs" />
            </div>
          </CardContent>
        </Card>

        {/* Usage Metrics */}
        <Card className="enterprise-card lg:col-span-1">
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Repositories Analyzed</span>
                <span className="text-sm font-medium text-foreground">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">AI Analyses</span>
                <span className="text-sm font-medium text-foreground">340</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Security Issues</span>
                <span className="text-sm font-medium text-destructive">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Members</span>
                <span className="text-sm font-medium text-foreground">{members.length}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Plan: Enterprise ($499/month)</p>
              <p className="text-xs text-muted-foreground">Next billing: Dec 1, 2026</p>
              <Button variant="outline" size="sm" className="w-full">
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Residency */}
      <div className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" /> Data Residency & Sovereignty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Choose where your code and analysis data is stored to meet regulatory requirements.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/50">
              <h4 className="font-medium text-foreground">United States</h4>
              <p className="text-sm text-muted-foreground">AWS us-east-1 • Primary</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50">
              <h4 className="font-medium text-foreground">European Union</h4>
              <p className="text-sm text-muted-foreground">AWS eu-west-1 • GDPR</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50">
              <h4 className="font-medium text-foreground">Asia Pacific</h4>
              <p className="text-sm text-muted-foreground">AWS ap-southeast-1 • PDPA</p>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
