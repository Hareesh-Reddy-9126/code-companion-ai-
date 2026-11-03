import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDashed,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Server,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/StatCard";

interface OrgStats {
  repositories: number;
  analyses: number;
  openIssues: number;
}

type Availability = "available" | "roadmap" | "self-hosted";

const availabilityLabel: Record<Availability, string> = {
  available: "Available",
  roadmap: "Roadmap",
  "self-hosted": "Preview",
};

const availabilityClass: Record<Availability, string> = {
  available: "border-primary/25 bg-primary/10 text-primary",
  roadmap: "border-border bg-secondary text-muted-foreground",
  "self-hosted": "border-warning/25 bg-warning/10 text-warning",
};

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
        latest.data?.filter((analysis) => (analysis.security_score ?? 100) < 80).length ?? 0;
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
      title: "Team workspaces are not live yet",
      description: `We have not enabled invitations during the beta. Email sales@codecompanion.ai to register interest for ${memberEmail}.`,
    });
    setMemberEmail("");
  };

  const workspaceName = profile?.name || user?.email || "Personal workspace";

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Account"
        title="Workspace"
        description="Who is in this workspace, how it is secured and where the data lives. Single-user during the public beta."
        actions={
          <Button variant="outline" asChild>
            <Link to="/billing">
              Billing &amp; usage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          title="Repositories"
          value={loading ? "—" : stats.repositories}
          icon={Building2}
          change="Connected to this workspace"
        />
        <StatCard
          title="Analyses"
          value={loading ? "—" : stats.analyses}
          icon={ShieldCheck}
          change="Reports generated"
        />
        <StatCard
          title="Recent risk"
          value={loading ? "—" : stats.openIssues}
          icon={Shield}
          change="Last 20 analyses below security 80"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Workspace</h2>
          </div>

          <div className="mt-5 flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-[15px] font-semibold text-primary">
              {workspaceName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium text-foreground">{workspaceName}</p>
              <p className="truncate font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4">
            <InfoRow label="Plan" value="Free public beta" />
            <InfoRow label="Seats" value="1 · single user" />
            <InfoRow label="Region" value="EU · eu-north-1" />
            <InfoRow label="Role" value="Owner" />
          </div>

          <div className="mt-4 rounded-xl border border-border/60 bg-white/[0.015] p-3.5">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">
              Team workspaces
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
              Multi-user workspaces, shared reports and role-based access are on
              the roadmap. Nothing is shared between accounts today — every row
              is scoped to its owner by row-level security.
            </p>
          </div>
        </section>

        <section className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-primary" />
              <h2 className="text-[13.5px] font-medium text-foreground">Members</h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              1 of 1 seat
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-white/[0.018] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-[11px] font-medium text-primary">
                {(profile?.name || user?.email || "?").charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-medium text-foreground">
                  {profile?.name || user?.email}
                </p>
                <p className="truncate text-[10.5px] text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-primary">
              Owner
            </span>
          </div>

          <div className="mt-4 border-t border-border/60 pt-4">
            <label
              htmlFor="invite-email"
              className="mb-1.5 block text-[11.5px] font-medium text-foreground/85"
            >
              Invite a teammate
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="invite-email"
                  placeholder="teammate@company.com"
                  value={memberEmail}
                  onChange={(event) => setMemberEmail(event.target.value)}
                  className="h-10 pl-9 text-[13px]"
                  type="email"
                />
              </div>
              <Button onClick={handleInvite} disabled={!memberEmail} variant="outline">
                Register interest
              </Button>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-5 text-muted-foreground">
              <CircleDashed className="mt-0.5 h-3 w-3 shrink-0" />
              Invitations are not enabled. This form does not send an email.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Security &amp; compliance</h2>
          </div>

          <div className="divide-y divide-border/50">
            <StatusRow
              icon={ShieldCheck}
              title="Encryption"
              copy="GitHub tokens encrypted with AES-256-GCM before storage; TLS in transit."
              label="Enabled"
              availability="available"
            />
            <StatusRow
              icon={KeyRound}
              title="Row-level security"
              copy="Every table is scoped to the owning user in Postgres."
              label="Enabled"
              availability="available"
            />
            <StatusRow
              icon={Shield}
              title="SOC 2 Type II"
              copy="Controls are aligned with the trust criteria; certification is in progress."
              label="In progress"
              availability="roadmap"
            />
            <StatusRow
              icon={Users}
              title="SAML / OIDC SSO"
              copy="Not available yet. Planned alongside team workspaces."
              label="Roadmap"
              availability="roadmap"
            />
          </div>

          <div className="border-t border-border/60 px-5 py-3">
            <Link
              to="/security-policy"
              className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Read the security overview <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        <section className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Data residency</h2>
          </div>

          <div className="space-y-2.5 p-4">
            <div className="rounded-xl border border-primary/25 bg-primary/[0.045] p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12.5px] font-medium text-foreground">European Union</p>
                  <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
                    Supabase eu-north-1 · Stockholm
                  </p>
                </div>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-primary">
                  Active
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-white/[0.012] p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12.5px] font-medium text-foreground/70">United States</p>
                  <p className="mt-0.5 text-[10.5px] leading-5 text-muted-foreground">
                    No region exists yet. Planned for a future release.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-secondary px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                  Roadmap
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-white/[0.012] p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12.5px] font-medium text-foreground/70">Asia Pacific</p>
                  <p className="mt-0.5 text-[10.5px] leading-5 text-muted-foreground">
                    No region exists yet. Planned for a future release.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-secondary px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                  Roadmap
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 px-5 py-3">
            <p className="text-[10.5px] leading-5 text-muted-foreground">
              Data stays in the region shown above. Region selection is not a
              self-serve setting today.
            </p>
          </div>
        </section>
      </div>

      <section className="panel mt-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-warning/25 bg-warning/10 text-warning">
            <Server className="h-4 w-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[13px] font-medium text-foreground">Self-hosted deployment</h2>
              <span className={badgeClass("self-hosted")}>{availabilityLabel["self-hosted"]}</span>
            </div>
            <p className="mt-1 max-w-[70ch] text-[11px] leading-5 text-muted-foreground">
              Kubernetes manifests, monitoring config and compliance drafts live
              in the public repository. They are reference material, not a
              supported managed offering. Managed deployments run on Supabase and
              Cloudflare.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-/tree/main/infra"
            target="_blank"
            rel="noreferrer"
          >
            View infrastructure <ArrowUpRight className="h-3 w-3" />
          </a>
        </Button>
      </section>
    </div>
  );
}

function badgeClass(availability: Availability) {
  return `rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${availabilityClass[availability]}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11.5px] text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-[10px] text-foreground/75">{value}</span>
    </div>
  );
}

function StatusRow({
  icon: Icon,
  title,
  copy,
  label,
  availability,
}: {
  icon: typeof Shield;
  title: string;
  copy: string;
  label: string;
  availability: Availability;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium text-foreground">{title}</p>
          <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">{copy}</p>
        </div>
      </div>
      <span className={`shrink-0 ${badgeClass(availability)}`}>{label}</span>
    </div>
  );
}
