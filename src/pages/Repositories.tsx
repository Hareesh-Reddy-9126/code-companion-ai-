import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Code2,
  GitBranch,
  GitFork,
  Github,
  Loader2,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";

interface Repo {
  id: string;
  repo_name: string;
  description: string | null;
  language: string | null;
  stars: number | null;
  forks: number | null;
  last_updated: string | null;
  repo_url: string;
}

const langColors: Record<string, string> = {
  TypeScript: "bg-info",
  JavaScript: "bg-warning",
  CSS: "bg-info",
  HTML: "bg-destructive",
  Python: "bg-warning",
  Java: "bg-destructive",
  Go: "bg-primary",
  Rust: "bg-destructive",
  Ruby: "bg-destructive",
};

export default function Repositories() {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRepos = useCallback(async () => {
    const { data, error } = await supabase
      .from("repositories")
      .select("*")
      .order("last_updated", { ascending: false });
    if (error) {
      toast({ title: "Could not load repositories", description: error.message, variant: "destructive" });
    } else if (data) {
      setRepos(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const connectGitHub = async () => {
    setConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/auth/github/callback`;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-auth-url?redirect_uri=${encodeURIComponent(redirectUri)}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        },
      );
      const authData = await res.json();
      if (!res.ok || authData.error) {
        toast({
          title: "GitHub is not configured",
          description: authData.error || "The authorization endpoint returned an error.",
          variant: "destructive",
        });
        setConnecting(false);
        return;
      }
      const state = crypto.randomUUID();
      sessionStorage.setItem("github_oauth_state", state);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${authData.client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${state}`;
    } catch (error: any) {
      setConnecting(false);
      toast({ title: "Could not start GitHub OAuth", description: error.message, variant: "destructive" });
    }
  };

  const analyzeRepo = async (repoId: string) => {
    setAnalyzingId(repoId);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-repo", {
        body: { repoId, analysisType: "full_review" },
      });
      if (error) throw error;
      toast({ title: "Analysis complete", description: "Your report is ready." });
      navigate(`/code-review?analysisId=${data.analysis.id}`);
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setAnalyzingId(null);
    }
  };

  const languages = useMemo(
    () => Array.from(new Set(repos.map((repo) => repo.language).filter(Boolean) as string[])).sort(),
    [repos],
  );

  const filtered = repos.filter((repo) => {
    const matchesSearch =
      repo.repo_name.toLowerCase().includes(search.toLowerCase()) ||
      (repo.language || "").toLowerCase().includes(search.toLowerCase());
    const matchesLanguage = language === "all" || repo.language === language;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Workspace"
        title="Repositories"
        description={
          profile?.github_username
            ? `Connected as @${profile.github_username}. Choose a repository to review on demand.`
            : "Connect GitHub to sync repositories and run your first review."
        }
        actions={
          profile?.github_username ? (
            <Button variant="outline" onClick={connectGitHub} disabled={connecting}>
              {connecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Sync repositories
            </Button>
          ) : (
            <Button onClick={connectGitHub} disabled={connecting}>
              {connecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Github className="h-3.5 w-3.5" />
              )}
              Connect GitHub
            </Button>
          )
        }
      />

      {connecting && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/[0.045] px-4 py-3">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          <p className="text-[12px] leading-5 text-muted-foreground">
            Redirecting to GitHub to authorize repository access. If nothing
            happens, check that pop-ups and redirects are allowed.
          </p>
        </div>
      )}

      <div className="panel mb-4 flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or language…"
            className="h-9 pl-9 text-[12.5px]"
            aria-label="Search repositories"
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="language-filter"
            className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground"
          >
            Language
          </label>
          <select
            id="language-filter"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="h-9 min-w-[140px] rounded-xl border border-input bg-white/[0.02] px-2.5 text-[12px] text-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
          >
            <option value="all">All languages</option>
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : repos.length === 0 ? (
        <EmptyState
          icon={Github}
          title={profile?.github_username ? "No repositories synced" : "No repositories connected"}
          description={
            profile?.github_username
              ? "Your GitHub connection is active, but no repositories are stored yet. Re-run the sync to fetch them."
              : "Connect GitHub to import repositories. Access is read-only until you dispatch an analysis."
          }
          action={
            <Button onClick={connectGitHub} disabled={connecting}>
              <Github className="h-4 w-4" />
              {profile?.github_username ? "Sync repositories" : "Connect GitHub"}
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No repositories match"
          description="Clear the search or choose a different language to see the rest of your repositories."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setLanguage("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "repository" : "repositories"}
            </p>
            <p className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60 sm:block">
              Reviews run on demand
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((repo) => (
              <article key={repo.id} className="panel-hover flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-primary">
                      <GitBranch className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-[13px] font-medium text-foreground">{repo.repo_name}</h3>
                      <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${langColors[repo.language || ""] || "bg-muted-foreground"}`} />
                        {repo.language || "unknown"}
                      </p>
                    </div>
                  </div>
                  <a
                    href={repo.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${repo.repo_name} on GitHub`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-white/[0.05] hover:text-foreground"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <p className="mt-4 line-clamp-2 min-h-[40px] text-[12px] leading-5 text-muted-foreground">
                  {repo.description || "No description provided."}
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-3 font-mono text-[9.5px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {repo.stars || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {repo.forks || 0}
                  </span>
                  <span className="ml-auto">{formatDate(repo.last_updated)}</span>
                </div>

                <Button
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => analyzeRepo(repo.id)}
                  disabled={analyzingId === repo.id}
                >
                  {analyzingId === repo.id ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing
                    </>
                  ) : (
                    <>
                      <Code2 className="h-3.5 w-3.5" /> Run review
                    </>
                  )}
                </Button>
              </article>
            ))}
          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground/70">
            Need a different repository?{" "}
            <button onClick={connectGitHub} className="text-primary hover:underline">
              Re-authorize GitHub
            </button>{" "}
            or{" "}
            <Link to="/pull-requests" className="text-primary hover:underline">
              review a pull request
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Not synced";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Updated just now";
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Updated ${days}d ago`;
  return `Updated ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
