import { useEffect, useState } from "react";
import {
  Users, Shield, Activity, Globe, Lock, Mail, Server,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface OrgStats {
  repositories: number;
  analyses: number;
  openIssues: number;
}

export default function Organization() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<OrgStats>({ repositories: 0, analyses: 0, openIssues: 0 });
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [repos, analyses, latest] = await Promise.all([
        supabase.from("repositories").select("id", { count: "exact", head: true }),
        supabase.from("analyses").select("id", { count: "exact", head: true }),
        supabase
          .from("analyses")
          .select("security_score")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      if (cancelled) return;
      const issueCount =
        latest.data?.filter((a) => (a.security_score ?? 100) < 80).length ?? 0;
      setStats({
        repositories: repos.count ?? 0,
        analyses: analyses.count ?? 0,
        openIssues: issueCount,
      });
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInvite = () => {
    if (!memberEmail) return;
    toast({
      title: "Invitations are an Enterprise feature",
      description: `Contact sales to add ${memberEmail} to a team workspace.`,
    });
    setMemberEmail("");
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workspace Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your workspace, members, security and data residency
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/billing">Billing &amp; usage</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="enterprise-card lg:col-span-1">
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {profile?.name || "Personal workspace"}
                </h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Plan</p>
                <Badge variant="secondary">Free (beta)</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Region</p>
                <span className="text-sm font-medium text-foreground">EU (Stockholm)</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border/50 text-sm text-muted-foreground">
              Team workspaces, SAML SSO and role-based access are available on the
              Enterprise plan.
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-medium text-primary">
                  {(profile?.name || user?.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Owner</p>
                </div>
              </div>
              <Badge>Active</Badge>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="teammate@company.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="flex-1"
                  type="email"
                />
                <Button onClick={handleInvite} disabled={!memberEmail}>
                  <Mail className="w-4 h-4 mr-2" /> Invite
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Multi-user workspaces are part of the Enterprise plan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="enterprise-card p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Repositories</p>
          <p className="text-3xl font-bold text-foreground mt-1">{loading ? "-" : stats.repositories}</p>
          <p className="text-xs text-muted-foreground mt-2">Connected to this workspace</p>
        </div>
        <div className="enterprise-card p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI analyses</p>
          <p className="text-3xl font-bold text-foreground mt-1">{loading ? "-" : stats.analyses}</p>
          <p className="text-xs text-muted-foreground mt-2">Reports generated</p>
        </div>
        <div className="enterprise-card p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent risk</p>
          <p className="text-3xl font-bold text-foreground mt-1">{loading ? "-" : stats.openIssues}</p>
          <p className="text-xs text-muted-foreground mt-2">Analyses below security threshold</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" /> Security &amp; compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Encryption</p>
                <p className="text-xs text-muted-foreground">AES-256-GCM at rest, TLS 1.3 in transit</p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Row-level security</p>
                <p className="text-xs text-muted-foreground">Every table scoped to the owning user</p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SOC 2 Type II</p>
                <p className="text-xs text-muted-foreground">Controls are aligned; certification in progress</p>
              </div>
              <Badge variant="secondary">In progress</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SAML SSO</p>
                <p className="text-xs text-muted-foreground">Okta, Azure AD and Google Workspace</p>
              </div>
              <Badge variant="secondary">Enterprise</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" /> Data residency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">European Union</h4>
                  <p className="text-sm text-muted-foreground">Supabase eu-north-1 (Stockholm)</p>
                </div>
                <Badge>Active</Badge>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">United States</h4>
                <p className="text-sm text-muted-foreground">Available on Enterprise</p>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 rounded-xl border border-border/50 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Asia Pacific</h4>
                <p className="text-sm text-muted-foreground">Available on Enterprise</p>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="enterprise-card p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Server className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground">Self-hosted deployment</h3>
            <p className="text-sm text-muted-foreground">
              Kubernetes manifests and compliance documentation are available in the repository.
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-/tree/main/infra"
            target="_blank"
            rel="noreferrer"
          >
            View infrastructure
          </a>
        </Button>
      </div>
    </div>
  );
}
