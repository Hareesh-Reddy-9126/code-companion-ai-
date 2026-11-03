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
import { StatCard } from "@/components/StatCard";

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
    [toast],
  );

  useEffect(() => {
    if (profile?.is_admin) {
      load();
    } else {
      setLoading(false);
    }
  }, [profile?.is_admin, load]);

  const runHealthCheck = async () => {
    setCheckingHealth(true);
    const started = performance.now();
    try {
      const { data, error } = await supabase.functions.invoke("health");
      const latency = Math.round(performance.now() - started);
      if (error) throw error;
      setHealth({
        status: data?.status ?? "unknown",
        database: data?.checks?.database ?? "unknown",
        latency,
        checkedAt: new Date().toLocaleTimeString(),
      });
    } catch (error: any) {
      setHealth({
        status: "unreachable",
        database: error.message || "unknown",
        latency: Math.round(performance.now() - started),
        checkedAt: new Date().toLocaleTimeString(),
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  const exportStats = () => {
    if (!stats) return;
    const payload = {
      exported_at: new Date().toISOString(),
      source: "admin-stats",
      stats,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `code-companion-stats-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast({ title: "Stats exported", description: "JSON file downloaded." });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="animate-slide-in">
        <PageHeader group="Admin" title="Platform admin" />
        <EmptyState
          icon={Lock}
          title="Admin access required"
          description="This page shows aggregate platform metrics and is limited to accounts with the admin role. Contact support if you believe you should have access."
          action={
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="animate-slide-in">
        <PageHeader
          group="Admin"
          title="Platform admin"
          actions={
            <Button variant="outline" onClick={() => load(true)} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Retry
            </Button>
          }
        />
        <EmptyState
          icon={AlertCircle}
          title="Stats are unavailable"
          description="The admin-stats function did not return a payload. Retry the request or check the function logs in Supabase."
          action={
            <Button onClick={() => load(true)} disabled={refreshing}>
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          }
        />
      </div>
    );
  }

  const totalJobs24h = Object.values(stats.jobs_last_24h).reduce((sum, count) => sum + count, 0);
  const jobEntries = Object.entries(stats.jobs_last_24h);

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Admin"
        title="Platform admin"
        description="Aggregate counts for the deployed platform. This page does not expose repository contents or user-level records."
        actions={
          <>
            <Button variant="outline" onClick={exportStats}>
              <Download className="h-3.5 w-3.5" /> Export JSON
            </Button>
            <Button variant="outline" onClick={() => load(true)} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Refresh
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Users" value={stats.users} icon={Users} change="Profiles with an account" />
        <StatCard title="Repositories" value={stats.repositories} icon={Database} change="Connected across the platform" />
        <StatCard title="Analyses" value={stats.analyses} icon={Activity} change="All time" />
        <StatCard
          title="Error events"
          value={stats.errors_24h}
          icon={AlertCircle}
          change="Total recorded, not a 24h window"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <h2 className="text-[13.5px] font-medium text-foreground">Jobs last 24h</h2>
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
              {totalJobs24h} total
            </span>
          </div>

          {jobEntries.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[12.5px] text-muted-foreground">No analysis jobs in the last 24 hours.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {jobEntries.map(([status, count]) => {
                const share = totalJobs24h ? Math.round((count / totalJobs24h) * 100) : 0;
                return (
                  <div key={status} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="w-20 shrink-0 font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
                      {status}
                    </span>
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                      <span className="block h-full rounded-full bg-primary/60" style={{ width: `${Math.max(3, share)}%` }} />
                    </span>
                    <span className="w-8 text-right font-mono text-[11px] text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-border/60 px-5 py-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
              Counts by job status, last 24 hours
            </p>
          </div>
        </section>

        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-3.5 w-3.5 text-primary" />
              <h2 className="text-[13.5px] font-medium text-foreground">Platform status</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={runHealthCheck} disabled={checkingHealth}>
              {checkingHealth ? <Loader2 className="h-3 w-3 animate-spin" /> : <HeartPulse className="h-3 w-3" />}
              Run probe
            </Button>
          </div>

          <div className="divide-y divide-border/50">
            <StatusRow
              label="Health probe"
              value={health ? health.status : "Not run in this session"}
              tone={!health ? "muted" : health.status === "healthy" ? "good" : "bad"}
            />
            <StatusRow
              label="Database check"
              value={health ? health.database : "Run the probe to check"}
              tone={!health ? "muted" : health.database === "ok" ? "good" : "bad"}
            />
            <StatusRow label="Probe latency" value={health ? `${health.latency} ms` : "—"} />
            <StatusRow label="Last stats refresh" value={new Date(stats.timestamp).toLocaleString()} />
            <StatusRow label="Data region" value="EU · eu-north-1" />
          </div>

          <div className="flex items-start gap-2.5 border-t border-border/60 bg-white/[0.015] px-5 py-3.5">
            <Server className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <p className="text-[10.5px] leading-5 text-muted-foreground">
              The probe calls the public <span className="font-mono text-foreground/70">health</span>{" "}
              edge function. It checks database reachability, not a historical
              uptime percentage.
              {health && (
                <span className="ml-1 text-muted-foreground/60">Checked at {health.checkedAt}.</span>
              )}
            </p>
          </div>
        </section>
      </div>

      <p className="mt-4 rounded-xl border border-border/60 bg-white/[0.015] p-4 text-[11px] leading-5 text-muted-foreground">
        <span className="font-medium text-foreground/80">Aggregate only:</span>{" "}
        admin-stats returns counts from the service role. It does not return
        repository contents, analysis reports or user-level records.
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "bad" | "muted";
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3">
      <span className="text-[11.5px] text-muted-foreground">{label}</span>
      <span
        className={`truncate font-mono text-[9.5px] uppercase tracking-[0.08em] ${
          tone === "good"
            ? "text-primary"
            : tone === "bad"
              ? "text-destructive"
              : tone === "muted"
                ? "text-muted-foreground/50"
                : "text-foreground/75"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
