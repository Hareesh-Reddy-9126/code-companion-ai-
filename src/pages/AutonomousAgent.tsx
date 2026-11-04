import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Github,
  GitPullRequest,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";

interface AutonomousFix {
  id: string;
  repo_name: string | null;
  pr_number: number;
  pr_title: string | null;
  status: "pending" | "analyzing" | "fixing" | "review" | "completed" | "failed";
  issues_found: number;
  fixes_applied: number;
  confidence_score: number;
  created_at: string;
  completed_at?: string | null;
}

interface Repo {
  id: string;
  repo_name: string;
}

const statusStyles: Record<string, string> = {
  pending: "border-border bg-card text-muted-foreground",
  analyzing: "border-info bg-info/10 text-info",
  fixing: "border-warning bg-warning/10 text-warning",
  review: "border-warning bg-warning/10 text-warning",
  completed: "border-brand bg-brand/10 text-brand",
  failed: "border-destructive bg-destructive/10 text-destructive",
};

export default function AutonomousAgent() {
  const [fixes, setFixes] = useState<AutonomousFix[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const [fixRes, repoRes] = await Promise.all([
      supabase.from("agent_fixes").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("repositories").select("id, repo_name").order("repo_name", { ascending: true }),
    ]);
    if (fixRes.data) setFixes(fixRes.data as any);
    if (repoRes.data) setRepos(repoRes.data as any);
    setLoading(false);
  };

  const dispatch = async () => {
    if (!selectedRepo || !prNumber) return;
    setDispatching(true);
    try {
      const { error } = await supabase.from("agent_fixes").insert({
        repo_name: selectedRepo,
        pr_number: parseInt(prNumber, 10),
        status: "pending",
        issues_found: 0,
        fixes_applied: 0,
        confidence_score: 0,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast({ title: "Agent dispatched", description: "Reviewing the PR and will post fix suggestions." });
      setPrNumber("");
      load();
    } catch (error: any) {
      toast({ title: "Dispatch failed", description: error.message, variant: "destructive" });
    } finally {
      setDispatching(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="relative">
      <PageHeader
        group="Workspace"
        title="Autonomous agent"
        description="The AI agent reads a pull request and posts fix suggestions as a GitHub review comment. A human approves every action."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <span><Github className="h-3.5 w-3.5" /> Browse repositories</span>
            </Link>
          </Button>
        }
      />

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Dispatch agent
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Request a fix
            </h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); dispatch(); }} className="flex w-full flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              placeholder="Repository name (e.g. acme/platform)"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="PR number (e.g. 184)"
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              className="flex-1 sm:w-48"
            />
            <Button type="submit" size="sm" disabled={dispatching || !selectedRepo || !prNumber}>
              {dispatching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Dispatch <ArrowUpRight className="h-3 w-3" />
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      {fixes.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Bot}
          title="No agent runs yet"
          description="Dispatch the agent on a pull request to see results here."
          action={
            <Button variant="outline" asChild>
              <Link to="/repositories">Choose a repository</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-8 grid gap-4">
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    PR
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Repository
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Issues
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Fixes
                  </th>
                  <th className="px-4 py-3 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fixes.map((fix) => (
                  <tr key={fix.id} className="group hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-foreground">
                        #{fix.pr_number}
                      </span>
                      <p className="mt-0.5 text-[10px] text-muted-foreground truncate max-w-[20ch]">
                        {fix.pr_title || "Untitled PR"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-muted-foreground">
                        {fix.repo_name || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0 font-mono text-[9px] uppercase tracking-wider ${statusStyles[fix.status]}`}
                      >
                        {fix.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm text-muted-foreground">{fix.issues_found}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm text-brand">{fix.fixes_applied}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {Math.round(fix.confidence_score)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  );
}
