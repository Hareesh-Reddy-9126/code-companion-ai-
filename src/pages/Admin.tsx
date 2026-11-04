import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Database,
  Download,
  HeartPulse,
  Loader2,
  Lock,
  RefreshCw,
  Server,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";

interface Stats {
  users: number;
  repositories: number;
  analyses: number;
  errors_24h: number;
  jobs_last_24h: Record<string, number>;
  timestamp: string;
}

interface HealthState {
  status: string;
  database: string;
  latency: number;
  checkedAt: string;
}

export default function Admin() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [health, setHealth] = useState<HealthState | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const load = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setRefreshing(true);
      const { data, error } = await supabase.functions.invoke("admin-stats");
      if (error) {
        toast({ title: "Failed to load platform stats", description: error.message, variant: "destructive" });
      } else {
        setStats(data as Stats);
      }
      setLoading(false);
      setRefreshing(false);
    },
    [],
  );

  const loadHealth = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setCheckingHealth(true);
      const { data, error } = await supabase.functions.invoke("health");
      if (error) {
        toast({ title: "Failed to load health", description: error.message, variant: "destructive" });
      } else {
        setHealth(data as HealthState);
      }
      setCheckingHealth(false);
    },
    [],
  );

  useEffect(() => {
    load();
    loadHealth();
  }, []);

  if (!profile?.is_admin) {
    return (
      <div className="relative">
        <PageHeader group="Account" title="Admin" />
        <EmptyState
          icon={Lock}
          title="Admin access required"
          description="This page is restricted to workspace administrators."
          action={
            <Button variant="outline" asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="relative">
      <PageHeader
        group="Account"
        title="Admin"
        description="Platform health, usage statistics and system status."
        actions={
          <Button variant="outline" size="sm" onClick={() => load(true)}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardLite
            title="Users"
            value={stats.users}
            icon={Users}
            change="Active accounts"
          />
          <StatCardLite
            title="Repositories"
            value={stats.repositories}
            icon={Database}
            change="Connected repos"
          />
          <StatCardLite
            title="Analyses"
            value={stats.analyses}
            icon={Activity}
            change="Completed reviews"
          />
          <StatCardLite
            title="Errors (24h)"
            value={stats.errors_24h}
            icon={AlertCircle}
            change={stats.errors_24h > 0 ? "Investigate" : "All clear"}
            tone={stats.errors_24h > 0 ? "warning" : "good"}
          />
        </div>
      )}

      {health && (
        <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                System health
              </p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">Platform status</h2>
            </div>
            <Button variant="outline" size="sm" disabled={checkingHealth} onClick={() => loadHealth(true)}>
              {checkingHealth ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <HealthStat
              label="Status"
              value={health.status}
              tone={health.status === "healthy" ? "good" : "warning"}
            />
            <HealthStat label="Database" value={health.database} tone="good" />
            <HealthStat label="Latency" value={`${health.latency}ms`} tone={health.latency < 100 ? "good" : "warning"} />
          </div>
        </section>
      )}
    </div>
  );
}

function StatCardLite({
  title,
  value,
  icon: Icon,
  change,
  tone = "neutral",
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  tone?: "neutral" | "good" | "warning";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-4 w-4 ${tone === "good" ? "text-brand" : tone === "warning" ? "text-warning" : "text-muted-foreground"}`} />
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

function HealthStat({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "warning" }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-sm font-medium ${tone === "good" ? "text-brand" : tone === "warning" ? "text-warning" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
