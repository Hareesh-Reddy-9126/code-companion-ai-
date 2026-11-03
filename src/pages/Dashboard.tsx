import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Bot,
  Clock,
  Code2,
  GitBranch,
  History as HistoryIcon,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/app/PageHeader";

interface AnalysisWithRepo {
  id: string;
  quality_score: number | null;
  security_score: number | null;
  performance_score: number | null;
  created_at: string;
  repositories: { repo_name: string; language: string | null } | null;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisWithRepo[]>([]);
  const [repoCount, setRepoCount] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [analysesRes, repoRes, countRes] = await Promise.all([
        supabase
          .from("analyses")
          .select("id, quality_score, security_score, performance_score, created_at, repositories(repo_name, language)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("repositories").select("id", { count: "exact", head: true }),
        supabase.from("analyses").select("id", { count: "exact", head: true }),
      ]);
      if (analysesRes.data) setAnalyses(analysesRes.data as any);
      setRepoCount(repoRes.count || 0);
      setAnalysisCount(countRes.count || 0);
      setLoading(false);
    };
    load();
  }, []);

  const avgQuality = analyses.length
    ? Math.round(analyses.reduce((sum, a) => sum + (a.quality_score || 0), 0) / analyses.length)
    : 0;
  const avgSecurity = analyses.length
    ? Math.round(analyses.reduce((sum, a) => sum + (a.security_score || 0), 0) / analyses.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const firstName = profile?.name?.split(" ")[0] || user?.email?.split("@")[0];

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Workspace"
        title="Dashboard"
        description={
          firstName
            ? `Welcome back, ${firstName}. Here is the current state of your review workspace.`
            : "The current state of your review workspace."
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/history">
                <span><HistoryIcon className="h-3.5 w-3.5" /> History</span>
              </Link>
            </Button>
            <Button asChild>
              <Link to="/repositories">
                <span><GitBranch className="h-3.5 w-3.5" /> Analyze a repository</span>
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Repositories"
          value={repoCount}
          icon={GitBranch}
          change={repoCount === 0 ? "Connect GitHub to begin" : "Connected to your account"}
        />
        <StatCard
          title="Avg quality"
          value={analyses.length ? avgQuality : "—"}
          icon={Code2}
          change={analyses.length ? "Across the last 10 analyses" : "No analyses yet"}
        />
        <StatCard
          title="Security"
          value={analyses.length ? avgSecurity : "—"}
          icon={Shield}
          change={analyses.length ? "Average security score" : "No analyses yet"}
        />
        <StatCard
          title="Analyses"
          value={analysisCount}
          icon={Clock}
          change="All time, on demand"
        />
      </div>

      {analyses.length === 0 ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <GettingStarted />
          <WorkspacePanel
            githubUsername={profile?.github_username ?? null}
            workspaceName={profile?.name || user?.email || "Personal workspace"}
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <section className="panel overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-[13.5px] font-medium text-foreground">Recent analyses</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                  Reports are stored with the code snapshot used for the review.
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/history">
                  <span>View all <ArrowUpRight className="h-3 w-3" /></span>
                </Link>
              </Button>
            </div>

            <div className="divide-y divide-border/50">
              {analyses.slice(0, 6).map((analysis) => (
                <button
                  key={analysis.id}
                  type="button"
                  onClick={() => navigate(`/code-review?analysisId=${analysis.id}`)}
                  className="group flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-muted-foreground transition-colors group-hover:text-primary">
                    <GitBranch className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-foreground">
                      {analysis.repositories?.repo_name || "Unknown repository"}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
                      {analysis.repositories?.language || "unknown"}
                      <span className="text-border">/</span>
                      {formatDate(analysis.created_at)}
                    </span>
                  </span>
                  <span className="hidden items-center gap-3 sm:flex">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      sec {analysis.security_score ?? 0}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      perf {analysis.performance_score ?? 0}
                    </span>
                  </span>
                  <span
                    className={`w-9 text-right font-mono text-[12px] font-medium ${
                      (analysis.quality_score || 0) >= 80
                        ? "text-primary"
                        : (analysis.quality_score || 0) >= 60
                          ? "text-warning"
                          : "text-destructive"
                    }`}
                  >
                    {analysis.quality_score ?? 0}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                </button>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-4">
            <QualityTrend analyses={analyses} />
            <WorkspacePanel
              githubUsername={profile?.github_username ?? null}
              workspaceName={profile?.name || user?.email || "Personal workspace"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function GettingStarted() {
  const steps = [
    {
      title: "Connect GitHub",
      copy: "Authorize repository access. The token is encrypted before it is stored.",
      href: "/repositories",
      label: "Connect",
    },
    {
      title: "Run a review",
      copy: "Pick a repository and request an analysis. Reviews run when you ask, not in the background.",
      href: "/repositories",
      label: "Choose a repo",
    },
    {
      title: "Read the report",
      copy: "Scores, findings and refactors land in History, ready to share or act on.",
      href: "/history",
      label: "Open history",
    },
  ];

  return (
    <section className="panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-30 mask-fade-y" />
      <div className="relative">
        <span className="chip-signal">
          <Sparkles className="h-3 w-3" /> First run
        </span>
        <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.035em] text-foreground">
          Three steps to your first review.
        </h2>
        <p className="mt-1.5 max-w-[46ch] text-[12.5px] leading-6 text-muted-foreground">
          No pipeline to install and no webhook to configure. Connect a
          repository and request an analysis when you want one.
        </p>

        <div className="mt-6 space-y-px overflow-hidden rounded-xl border border-border/70 bg-border/50">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center gap-4 bg-card px-4 py-3.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/70 bg-secondary/60 font-mono text-[10px] text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-medium text-foreground">{step.title}</p>
                <p className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">{step.copy}</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={step.href}>
                  <span>{step.label} <ArrowUpRight className="h-3 w-3" /></span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QualityTrend({ analyses }: { analyses: AnalysisWithRepo[] }) {
  const series = analyses.slice(0, 8).slice().reverse();
  const average = series.length
    ? Math.round(series.reduce((sum, item) => sum + (item.quality_score || 0), 0) / series.length)
    : 0;

  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
            Quality trend
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">Most recent {series.length} reviews</p>
        </div>
        <span className="font-mono text-[13px] text-primary">{average}</span>
      </div>

      <div className="mt-5 flex h-28 items-end gap-1.5">
        {series.map((analysis) => {
          const score = analysis.quality_score || 0;
          return (
            <div
              key={analysis.id}
              title={`${analysis.repositories?.repo_name || "Repository"} — ${score}/100`}
              className="flex-1 rounded-t-[3px] bg-primary/20 transition-colors hover:bg-primary/35"
              style={{ height: `${Math.max(6, score)}%` }}
            />
          );
        })}
      </div>

      <div className="mt-2 flex gap-1.5">
        {series.map((analysis) => (
          <span
            key={analysis.id}
            className="flex-1 text-center font-mono text-[8.5px] text-muted-foreground/60"
          >
            {analysis.quality_score ?? 0}
          </span>
        ))}
      </div>
    </section>
  );
}

function WorkspacePanel({
  githubUsername,
  workspaceName,
}: {
  githubUsername: string | null;
  workspaceName: string;
}) {
  return (
    <section className="panel p-5">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
        Workspace
      </p>
      <p className="mt-2 truncate text-[13px] font-medium text-foreground">{workspaceName}</p>

      <div className="mt-4 space-y-2.5">
        <StatusRow
          label="GitHub"
          value={githubUsername ? `@${githubUsername}` : "Not connected"}
          tone={githubUsername ? "good" : "warning"}
        />
        <StatusRow label="Plan" value="Free public beta" />
        <StatusRow label="Data region" value="EU · eu-north-1" />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border/60 bg-white/[0.015] p-3">
        <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-[10.5px] leading-5 text-muted-foreground">
          The agent posts fix suggestions as a PR comment. It never pushes a
          commit on its own.
        </p>
      </div>

      <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
        <Link to="/settings">
          <span>Account settings <ArrowUpRight className="h-3 w-3" /></span>
        </Link>
      </Button>
    </section>
  );
}

function StatusRow({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warning";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11.5px] text-muted-foreground">{label}</span>
      <span
        className={`truncate font-mono text-[10px] ${
          tone === "good" ? "text-primary" : tone === "warning" ? "text-warning" : "text-foreground/75"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
