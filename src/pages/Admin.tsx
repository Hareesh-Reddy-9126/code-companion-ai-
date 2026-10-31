import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Database,
  Activity,
  AlertCircle,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";

interface Stats {
  users: number;
  repositories: number;
  analyses: number;
  errors_24h: number;
  jobs_last_24h: Record<string, number>;
  timestamp: string;
}

export default function Admin() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.functions.invoke("admin-stats");
      if (error) {
        toast({ title: "Failed to load stats", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      setStats(data as Stats);
      setLoading(false);
    };
    if (profile?.is_admin) {
      load();
    } else {
      setLoading(false);
    }
  }, [profile, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground text-sm">
            Contact support to request admin access to view platform metrics.
          </p>
        </div>
      </div>
    );
  }

  const totalJobs24h = Object.values(stats!.jobs_last_24h).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform health and usage metrics
          </p>
        </div>
        <Button variant="outline" size="sm">
          <LayoutDashboard className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Users
              </p>
              <p className="text-2xl font-bold">{stats?.users || 0}</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Repositories
              </p>
              <p className="text-2xl font-bold">{stats?.repositories || 0}</p>
            </div>
            <div className="p-2 rounded-lg bg-info/10 text-info">
              <Database className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Analyses (All Time)
              </p>
              <p className="text-2xl font-bold">{stats?.analyses || 0}</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Errors (24h)
              </p>
              <p className="text-2xl font-bold">
                {stats?.errors_24h || 0}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Jobs Last 24h</h3>
          <div className="space-y-3">
            {Object.entries(stats?.jobs_last_24h || {}).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <span className="text-sm text-muted-foreground capitalize">
                  {status}
                </span>
                <span className="font-mono text-sm font-semibold">{count}</span>
              </div>
            ))}
            {Object.keys(stats?.jobs_last_24h || {}).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No jobs in the last 24 hours
              </p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Total jobs (24h): <span className="font-medium">{totalJobs24h}</span>
            </p>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Platform Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm">API Uptime</span>
              <span className="text-xs font-medium text-primary">99.9%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm">Database</span>
              <span className="text-xs font-medium text-primary">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm">Last Sync</span>
              <span className="text-xs font-medium text-muted-foreground">
                {new Date(stats?.timestamp || Date.now()).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" /> View Detailed Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
