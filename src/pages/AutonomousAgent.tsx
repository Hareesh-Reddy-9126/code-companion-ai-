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
import { StatCard } from "@/components/StatCard";

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
  pending: "border-border bg-secondary text-muted-foreground",
  analyzing: "border-info/25 bg-info/10 text-info",
  fixing: "border-warning/25 bg-warning/10 text-warning",
  review: "border-warning/25 bg-warning/10 text-warning",
  completed: "border-primary/25 bg-primary/10 text-primary",
  failed: "border-destructive/25 bg-destructive/10 text-destructive",
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
      supabase.from("autonomous_fixes").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("repositories").select("id, repo_name").order("repo_name"),
    ]);
    setFixes((fixRes.data ?? []) as AutonomousFix[]);
    setRepos((repoRes.data ?? []) as Repo[]);
    setSelectedRepo((current) => current || repoRes.data?.[0]?.id || "");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const dispatch = async () => {
    const pr = Number(prNumber);
    if (!selectedRepo || !Number.isInteger(pr) || pr <= 0) {
      toast({
        title: "Missing details",
        description: "Select a repository and enter a valid pull request number.",
        variant: "destructive",
      });
      return;
    }
    setDispatching(true);
    const { data, error } = await supabase.functions.invoke("autonomous-fix", {
      body: { repo_id: selectedRepo, pr_number: pr },
    });
    setDispatching(false);
    if (error) {
      toast({ title: "Agent failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Agent finished",
        description: `${data?.fixes_found ?? 0} issues found, ${data?.fixes_applied ?? 0} fix comments posted.`,
      });
      setPrNumber("");
      load();
    }
  };

  const active = fixes.filter((fix) => fix.status === "analyzing" || fix.status === "fixing").length;
  const posted = fixes.reduce((sum, fix) => sum + (fix.fixes_applied || 0), 0);
  const confidence = fixes.length
    ? Math.round(fixes.reduce((sum, fix) => sum + (fix.confidence_score || 0), 0) / fixes.length)
    : 0;

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Intelligence"
        title="AI agent"
        description="Reads a pull request, drafts fixes and posts each high-confidence suggestion as a GitHub PR comment. A human still decides what ships."
        actions={
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </Button>
        }
      />

      {!loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard title="Active runs" value={active} icon={Bot} change="Analyzing or fixing" />
          <StatCard title="Fix comments" value={posted} icon={GitPullRequest} change="Across the last 20 runs" />
          <StatCard
            title="Avg confidence"
            value={fixes.length ? `${confidence}%` : "—"}
            icon={Sparkles}
            change={fixes.length ? "Mean of the last 20 runs" : "No runs yet"}
          />
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <Bot className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Dispatch the agent</h2>
          </div>
          <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">
            The agent reads the diff with your GitHub token. Fixes below 70%
            confidence are not posted.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : repos.length === 0 ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/[0.04] p-4">
              <Github className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <p className="text-[12px] font-medium text-foreground">No repositories connected</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  Connect GitHub and sync at least one repository before the agent
                  can read a pull request.
                </p>
                <Button size="sm" className="mt-3" asChild>
                  <Link to="/repositories">
                    Connect a repository <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_150px_auto]">
                <select
                  value={selectedRepo}
                  onChange={(event) => setSelectedRepo(event.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-white/[0.02] px-3 text-[12.5px] text-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                  aria-label="Repository"
                >
                  {repos.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.repo_name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={1}
                  placeholder="PR number"
                  value={prNumber}
                  onChange={(event) => setPrNumber(event.target.value)}
                  className="h-10 text-[12.5px]"
                  aria-label="Pull request number"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !dispatching && prNumber) dispatch();
                  }}
                />
                <Button onClick={dispatch} disabled={dispatching || !prNumber}>
                  {dispatching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                  {dispatching ? "Working" : "Dispatch"}
                </Button>
              </div>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                Typical run: 30–60 seconds · comments only · no commits
              </p>
            </>
          )}
        </section>

        <section className="panel p-5">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
            The boundary
          </p>
          <div className="mt-3 space-y-3">
            {[
              {
                icon: Github,
                title: "Posts comments",
                copy: "Each high-confidence fix becomes a PR comment with the current code and a suggested replacement.",
              },
              {
                icon: AlertTriangle,
                title: "Does not write code to your branch",
                copy: "No commits are pushed and no pull request is merged. Nothing changes until a person applies it.",
              },
              {
                icon: CheckCircle2,
                title: "Confidence filter",
                copy: "Only fixes scored 70 or above are posted. Lower-confidence findings stay in the run record.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl border border-border/60 bg-white/[0.015] p-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-primary">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[12px] font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[13.5px] font-medium text-foreground">Agent activity</h2>
          </div>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
            Last {fixes.length} runs
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : fixes.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Bot}
              title="No agent runs yet"
              description="Dispatch the agent on a pull request to see run status and the number of fix comments posted."
              compact
            />
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {fixes.map((fix) => (
              <div
                key={fix.id}
                className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-muted-foreground">
                    <GitPullRequest className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-foreground">
                      {fix.pr_title || `PR #${fix.pr_number}`}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                      {fix.repo_name || "Repository"} · PR #{fix.pr_number} ·{" "}
                      {new Date(fix.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span className="font-mono text-[9.5px] text-muted-foreground">
                    {fix.issues_found} found / {fix.fixes_applied} posted
                  </span>
                  <span className="font-mono text-[9.5px] text-muted-foreground/60">
                    {fix.confidence_score || 0}% conf.
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${
                      statusStyles[fix.status] || statusStyles.pending
                    }`}
                  >
                    {fix.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
