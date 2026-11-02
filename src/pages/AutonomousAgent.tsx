import {
  GitPullRequest,
  Bot,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Github,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  pending: "bg-muted text-muted-foreground",
  analyzing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  fixing: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  review: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  completed: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  failed: "bg-destructive/10 text-destructive",
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
      supabase
        .from("autonomous_fixes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("repositories").select("id, repo_name").order("repo_name"),
    ]);
    setFixes((fixRes.data ?? []) as AutonomousFix[]);
    setRepos((repoRes.data ?? []) as Repo[]);
    if (!selectedRepo && repoRes.data?.length) {
      setSelectedRepo(repoRes.data[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = async () => {
    const pr = Number(prNumber);
    if (!selectedRepo || !Number.isInteger(pr) || pr <= 0) {
      toast({
        title: "Missing details",
        description: "Select a repository and enter a valid PR number.",
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
        description: `${data?.fixes_found ?? 0} issues found, ${data?.fixes_applied ?? 0} fixes posted.`,
      });
      setPrNumber("");
      load();
    }
  };

  const active = fixes.filter((f) => f.status === "analyzing" || f.status === "fixing").length;
  const applied = fixes.reduce((sum, f) => sum + (f.fixes_applied || 0), 0);
  const confidence = fixes.length
    ? Math.round(fixes.reduce((sum, f) => sum + (f.confidence_score || 0), 0) / fixes.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Autonomous Agent</h1>
          <p className="text-muted-foreground mt-1">
            Reviews a pull request and posts precise fix suggestions, powered by NVIDIA Nemotron
          </p>
        </div>
        <Button variant="outline" onClick={load}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="enterprise-card p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Active agents
          </div>
          <div className="text-3xl font-bold text-primary">{active}</div>
          <div className="text-xs text-muted-foreground mt-2">Running now</div>
        </div>
        <div className="enterprise-card p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Fixes posted
          </div>
          <div className="text-3xl font-bold text-foreground">{applied}</div>
          <div className="text-xs text-muted-foreground mt-2">Across recent runs</div>
        </div>
        <div className="enterprise-card p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Avg. confidence
          </div>
          <div className="text-3xl font-bold text-foreground">{confidence}%</div>
          <div className="text-xs text-muted-foreground mt-2">Last 20 runs</div>
        </div>
      </div>

      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Dispatch the agent</CardTitle>
        </CardHeader>
        <CardContent>
          {repos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Connect a GitHub repository first, then return here to review a PR.
            </p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm flex-1"
              >
                {repos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.repo_name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min={1}
                placeholder="PR number"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                className="sm:max-w-[160px]"
              />
              <Button onClick={dispatch} disabled={dispatching}>
                {dispatching ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4 mr-2" />
                )}
                {dispatching ? "Analyzing..." : "Dispatch agent"}
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            The agent reads the PR diff, finds issues and posts fix suggestions as a
            GitHub comment. Runs typically take 30-60 seconds.
          </p>
        </CardContent>
      </Card>

      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Agent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {fixes.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No agent runs yet</h3>
              <p className="text-sm text-muted-foreground">
                Dispatch the agent on a pull request to see results here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fixes.map((fix) => (
                <div
                  key={fix.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <GitPullRequest className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {fix.pr_title || `PR #${fix.pr_number}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {fix.repo_name || "Repository"} · PR #{fix.pr_number} ·{" "}
                        {new Date(fix.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <span className="text-xs text-muted-foreground">
                      {fix.issues_found} found / {fix.fixes_applied} posted
                    </span>
                    <Badge variant="secondary" className={statusStyles[fix.status]}>
                      {fix.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="enterprise-card p-6">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 dark:bg-green-900/20 dark:text-green-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">Security review</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Flags injection, XSS, hardcoded secrets and vulnerable dependency usage.
          </p>
        </div>
        <div className="enterprise-card p-6">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 dark:bg-purple-900/20 dark:text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">Actionable fixes</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each comment includes the current code, a corrected version and a confidence score.
          </p>
        </div>
        <div className="enterprise-card p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 dark:bg-blue-900/20 dark:text-blue-400">
            <Github className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">GitHub native</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Posts directly to the pull request using your connected GitHub account.
          </p>
        </div>
      </div>
    </div>
  );
}
