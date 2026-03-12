import { GitBranch, Star, GitFork, Search, Filter, Loader2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRepos = useCallback(async () => {
    const { data, error } = await supabase
      .from("repositories")
      .select("*")
      .order("last_updated", { ascending: false });
    if (!error && data) setRepos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    if (error) {
      window.history.replaceState({}, "", "/repositories");
      toast({ title: "GitHub authorization denied", description: params.get("error_description") || error, variant: "destructive" });
      return;
    }
    if (code && !connecting) {
      setConnecting(true);
      window.history.replaceState({}, "", "/repositories");
      handleGitHubCallback(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGitHubCallback = async (code: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("github-callback", {
        body: { code },
      });
      if (error) {
        // Try to extract message from FunctionsHttpError
        let message = error.message;
        try {
          const body = JSON.parse(error.context?.body || "{}");
          if (body.error) message = body.error;
        } catch {}
        throw new Error(message);
      }
      if (data?.error) throw new Error(data.error);
      toast({ title: "GitHub connected!", description: `Synced ${data.repoCount} repositories` });
      await refreshProfile();
      await fetchRepos();
    } catch (e: any) {
      toast({ title: "GitHub connection failed", description: e.message, variant: "destructive" });
    } finally {
      setConnecting(false);
    }
  };

  const connectGitHub = async () => {
    try {
      const redirectUri = `http://localhost:8080/auth/github/callback`;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-auth-url?redirect_uri=${encodeURIComponent(redirectUri)}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const authData = await res.json();
      if (authData.error) {
        toast({ title: "GitHub not configured", description: authData.error, variant: "destructive" });
        return;
      }
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${authData.client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const analyzeRepo = async (repoId: string) => {
    setAnalyzingId(repoId);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-repo", {
        body: { repoId, analysisType: "full_review" },
      });
      if (error) throw error;
      toast({ title: "Analysis complete!" });
      navigate(`/code-review?analysisId=${data.analysis.id}`);
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzingId(null);
    }
  };

  const filtered = repos.filter(
    (r) =>
      r.repo_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.language || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {connecting && (
        <div className="glass-card p-6 flex items-center gap-4 border-primary/30 bg-primary/5">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <div>
            <h3 className="font-semibold">Connecting to GitHub...</h3>
            <p className="text-sm text-muted-foreground">Exchanging authorization and syncing your repositories. This may take a moment.</p>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Repositories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile?.github_username
              ? `Connected as @${profile.github_username}`
              : "Connect your GitHub to analyze repos"}
          </p>
        </div>
        {profile?.github_username ? (
          <Button variant="outline" onClick={connectGitHub} disabled={connecting}>
            {connecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Github className="h-4 w-4 mr-2" />}
            Sync Repos
          </Button>
        ) : (
          <Button onClick={connectGitHub} disabled={connecting}>
            {connecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Github className="h-4 w-4 mr-2" />}
            Connect GitHub
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 border border-border/50">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-2.5 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-muted-foreground">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No repositories found</h3>
          <p className="text-sm text-muted-foreground">
            {profile?.github_username ? "No repos match your search." : "Connect your GitHub account to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((repo) => (
            <div key={repo.id} className="glass-card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <GitBranch className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="font-semibold truncate">{repo.repo_name}</h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`h-2.5 w-2.5 rounded-full ${langColors[repo.language || ""] || "bg-muted-foreground"}`} />
                  <span className="text-xs text-muted-foreground">{repo.language || "N/A"}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{repo.description || "No description"}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stars || 0}</span>
                  <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks || 0}</span>
                  <span>{formatDate(repo.last_updated)}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => analyzeRepo(repo.id)}
                  disabled={analyzingId === repo.id}
                >
                  {analyzingId === repo.id ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Analyzing...</>
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
