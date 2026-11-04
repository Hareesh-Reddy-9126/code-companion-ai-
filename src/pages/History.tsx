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
    const matchesSearch = report.repositories?.repo_name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === "all" || report.analysis_type === type;
    return matchesSearch && matchesType;
  });

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
        title="History"
        description="Past analyses and review reports. Click any row to open the full report."
        actions={
          <Button variant="outline" asChild>
            <Link to="/repositories">
              <span><HistoryIcon className="h-3.5 w-3.5" /> Run a review</span>
            </Link>
          </Button>
        }
      />

      <section className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground translate-y-[-50%]" />
            <Input
              placeholder="Search repositories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 sm:flex-1 sm:max-w-md">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            >
              <option value="all">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t] || t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Clock}
          title="No reports found"
          description="Run a repository review to see results here."
          action={
            <Button variant="outline" asChild>
              <Link to="/repositories">Run a review</Link>
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
                    Repository
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => navigate(`/code-review?analysisId=${report.id}`)}
                    className="group hover:bg-surface-hover cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <GitBranch className="h-3.5 w-3.5 text-muted-foreground/40" />
                        <span className="text-sm font-medium text-foreground truncate">
                          {report.repositories?.repo_name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {typeLabels[report.analysis_type] || report.analysis_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono text-sm font-medium ${
                          (report.quality_score || 0) >= 80 ? "text-brand" : (report.quality_score || 0) >= 60 ? "text-warning" : "text-destructive"
                        }`}
                      >
                        {report.quality_score ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Eye className="h-4 w-4 text-muted-foreground/40 group-hover:text-brand transition-colors" />
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
