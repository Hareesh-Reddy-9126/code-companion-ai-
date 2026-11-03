import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Eye,
  GitBranch,
  History as HistoryIcon,
  Loader2,
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";

interface HistoryItem {
  id: string;
  quality_score: number | null;
  security_score: number | null;
  performance_score: number | null;
  architecture_score: number | null;
  analysis_type: string;
  created_at: string;
  repositories: { repo_name: string } | null;
}

const typeLabels: Record<string, string> = {
  full_review: "Full review",
  security: "Security scan",
  performance: "Performance",
  architecture: "Architecture",
};

export default function History() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("analyses")
        .select("id, quality_score, security_score, performance_score, architecture_score, analysis_type, created_at, repositories(repo_name)")
        .order("created_at", { ascending: false });
      if (data) setReports(data as any);
      setLoading(false);
    };
    load();
  }, []);

  const types = useMemo(
    () => Array.from(new Set(reports.map((report) => report.analysis_type).filter(Boolean))),
    [reports],
  );

  const filtered = reports.filter((report) => {
    const matchesSearch = ((report.repositories as any)?.repo_name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = type === "all" || report.analysis_type === type;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <PageHeader
        group="Intelligence"
        title="History"
        description="Every analysis stored for your account. Reports remain until you delete them."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              Run a new review <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        }
      />

      {reports.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No analyses yet"
          description="Run a review from your repositories and the report will appear here with its scores and findings."
          action={
            <Button asChild>
              <Link to="/repositories">
                Go to repositories <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="panel mb-4 flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filter by repository…"
                className="h-9 pl-9 text-[12.5px]"
                aria-label="Filter analyses by repository"
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="type-filter"
                className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Type
              </label>
              <select
                id="type-filter"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="h-9 min-w-[150px] rounded-xl border border-input bg-white/[0.02] px-2.5 text-[12px] text-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
              >
                <option value="all">All types</option>
                {types.map((item) => (
                  <option key={item} value={item}>
                    {typeLabels[item] || item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <section className="panel overflow-hidden">
            <div className="hidden grid-cols-[1.6fr_0.8fr_0.4fr_0.7fr_auto] gap-4 border-b border-border/60 bg-white/[0.02] px-5 py-2.5 sm:grid">
              {["Repository", "Type", "Quality", "Date", ""].map((heading, index) => (
                <span
                  key={heading || index}
                  className={`font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground ${
                    index === 2 ? "text-right" : ""
                  }`}
                >
                  {heading}
                </span>
              ))}
            </div>

            <div className="divide-y divide-border/50">
              {filtered.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-[12.5px] text-muted-foreground">
                    No analyses match those filters.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setSearch("");
                      setType("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                filtered.map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => navigate(`/code-review?analysisId=${report.id}`)}
                    className="group grid w-full grid-cols-1 gap-2 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] sm:grid-cols-[1.6fr_0.8fr_0.4fr_0.7fr_auto] sm:items-center sm:gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-muted-foreground group-hover:text-primary">
                        <GitBranch className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-foreground">
                          {(report.repositories as any)?.repo_name || "Unknown repository"}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground/70 sm:hidden">
                          {typeLabels[report.analysis_type] || report.analysis_type}
                          <span className="text-border">/</span>
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span className="hidden w-fit rounded-full border border-border/70 bg-secondary/50 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.08em] text-muted-foreground sm:inline-flex">
                      {typeLabels[report.analysis_type] || report.analysis_type}
                    </span>

                    <span
                      className={`hidden text-right font-mono text-[12px] font-medium sm:block ${
                        (report.quality_score || 0) >= 80
                          ? "text-primary"
                          : (report.quality_score || 0) >= 60
                            ? "text-warning"
                            : "text-destructive"
                      }`}
                    >
                      {report.quality_score ?? 0}
                    </span>

                    <span className="hidden items-center gap-1.5 font-mono text-[9.5px] text-muted-foreground sm:flex">
                      <Clock className="h-3 w-3" />
                      {new Date(report.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-muted-foreground sm:hidden">
                        Quality {report.quality_score ?? 0} / 100
                      </span>
                      <Button variant="ghost" size="sm" className="ml-auto sm:ml-0">
                        View <Eye className="h-3 w-3" />
                      </Button>
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>

          <p className="mt-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
            <span>{filtered.length} reports</span>
            <span>On-demand analyses · no background scanning</span>
          </p>
        </>
      )}
    </div>
  );
}
