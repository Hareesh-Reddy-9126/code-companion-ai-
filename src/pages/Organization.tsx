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
  available: "border-brand bg-brand/10 text-brand",
  roadmap: "border-border bg-card text-muted-foreground",
  "self-hosted": "border-warning bg-warning/10 text-warning",
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
        supabase.from("analyses").select("security_score").order("created_at", { ascending: false }).limit(1),
      ]);
      if (!cancelled) {
        setStats({
          repositories: repos.count || 0,
          analyses: analyses.count || 0,
          openIssues: 0,
        });
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  const workspaceName = profile?.name || user?.email || "Personal workspace";

  return (
    <div className="relative">
      <PageHeader
        group="Account"
        title="Workspace"
        description="Who is in this workspace, how it is secured and where the data lives."
        actions={
          <Button variant="outline" asChild>
            <Link to="/billing">
              <span>Billing & usage <ArrowUpRight className="h-3 w-3" /></span>
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCardLite
          title="Repositories"
          value={stats.repositories}
          icon={Building2}
          change="Connected to this workspace"
        />
        <StatCardLite
          title="Analyses"
          value={stats.analyses}
          icon={ShieldCheck}
          change="On-demand reviews"
        />
        <StatCardLite
          title="Open issues"
          value={stats.openIssues}
          icon={AlertTriangleLite}
          change="Across all analyses"
        />
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Invite member
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Add workspace member
            </h2>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Invite sent", description: `Invitation sent to ${memberEmail}` }); }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              placeholder="teammate@company.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">Invite</Button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Availability
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Deployment options
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Managed cloud", availability: "available" as Availability, icon: Cloud },
            { label: "EU data region", availability: "available" as Availability, icon: Globe },
            { label: "Self-hosted", availability: "self-hosted" as Availability, icon: Server },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <item.icon className="h-4 w-4 text-brand" />
                <span
                  className={`rounded-full border px-2 py-0 font-mono text-[8px] uppercase tracking-wider ${availabilityClass[item.availability]}`}
                >
                  {availabilityLabel[item.availability]}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Infrastructure
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              View infrastructure
            </h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Kubernetes manifests, monitoring config and compliance drafts live in the
          public repository. Reference material, not a supported managed offering.
        </p>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-/tree/main/infra"
            target="_blank"
            rel="noreferrer"
          >
            <span>View infrastructure <ArrowUpRight className="h-3.5 w-3.5" /></span>
          </a>
        </Button>
      </section>
    </div>
  );
}

function StatCardLite({
  title,
  value,
  icon: Icon,
  change,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-brand" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {title}
        </span>
      </div>
      <div className="text-[32px] font-medium leading-none tracking-tight text-foreground mb-2">
        {value}
      </div>
      <p className="text-sm text-muted-foreground">{change}</p>
    </div>
  );
}

function AlertTriangleLite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function Cloud() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.19 14.85c-1.32.44-2.75.52-4.19.29-3.39-.55-5.89-3.45-5.89-7.13A5.73 5.73 0 0 1 10 2c2.19 0 4.17 1.2 5.16 2.93a4 4 0 0 1 .44 1.1c.26.71.27 1.46.04 2.16l-.04.11c-.1.24-.31.41-.55.5-.12.05-.23.09-.34.12l-.22.06c-.31.08-.64.03-.94-.14a2 2 0 0 0-.54-.5l-.11-.04c-.7-.26-1.43-.05-2.09.33a5.88 5.88 0 0 0-3.13 2.33c-.61 1.19-.61 2.62-.01 3.9.39.82 1.02 1.53 1.79 2.04a3.82 3.82 0 0 0 3.23.52c1.14-.1 2.19-.62 2.95-1.59" />
    </svg>
  );
}

function Globe() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function Server() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}
