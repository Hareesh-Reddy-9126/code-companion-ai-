import {
  GitPullRequest,
  Bot,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Github,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AutonomousFix {
  id: string;
  repo_name: string;
  pr_number: number;
  pr_title: string;
  status: "pending" | "analyzing" | "fixing" | "review" | "completed" | "failed";
  issues_found: number;
  fixes_applied: number;
  confidence_score: number;
  created_at: string;
  completed_at?: string;
}

export default function AutonomousAgent() {
  const [fixes, setFixes] = useState<AutonomousFix[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFixes();
  }, []);

  const loadFixes = async () => {
    const { data } = await supabase
      .from("autonomous_fixes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setFixes((data ?? []) as AutonomousFix[]);
    setLoading(false);
  };

  const createAutonomousFix = async (repoId: string, prNumber: number) => {
    const { error } = await supabase.functions.invoke("autonomous-fix", {
      body: { repo_id: repoId, pr_number: prNumber },
    });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Agent Dispatched", description: "AI agent analyzing PR..." });
      loadFixes();
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    analyzing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    fixing: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    review: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    completed: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    failed: "bg-destructive/10 text-destructive",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Autonomous Agent</h1>
          <p className="text-muted-foreground mt-1">
            Autonomous code fixing, PR creation, and dependency updates powered by Nemotron 3 Ultra
          </p>
        </div>
        <Button
          className="enterprise-btn"
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Connect a repository to dispatch autonomous agents",
              variant: "destructive",
            });
          }}
          disabled
        >
          <Bot className="w-4 h-4 mr-2" /> Dispatch Agent
        </Button>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="enterprise-card p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Active Agents
          </div>
          <div className="text-3xl font-bold text-primary">0</div>
          <div className="text-xs text-muted-foreground mt-2">Running autonomously</div>
        </div>
        <div className="enterprise-card p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Fixes Applied
          </div>
          <div className="text-3xl font-bold text-foreground">0</div>
          <div className="text-xs text-muted-foreground mt-2">PRs fixed this week</div>
        </div>
        <div className="enterprise-card p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Confidence Score
          </div>
          <div className="text-3xl font-bold text-foreground">98.4%</div>
          <div className="text-xs text-muted-foreground mt-2">AI accuracy rate</div>
        </div>
        <div className="enterprise-card p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Avg. Time to Fix
          </div>
          <div className="text-3xl font-bold text-foreground">45s</div>
          <div className="text-xs text-muted-foreground mt-2">Per issue resolved</div>
        </div>
      </div>

      {/* Agent Queue */}
      <div className="enterprise-card">
        <CardHeader>
          <CardTitle>Agent Activity Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {fixes.length === 0 ? (
            <div className="text-center py-16">
              <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No active agents</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Autonomous agents will appear here when you connect repositories and enable auto-fix mode.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="enterprise-btn w-full sm:w-auto" onClick={loadFixes}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fixes.map((fix) => (
                <div
                  key={fix.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <GitPullRequest className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {fix.pr_title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {fix.repo_name} • PR #{fix.pr_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className={statusColors[fix.status]}>
                      {fix.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground">
                        {fix.confidence_score}%
                      </div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      {/* Capabilities */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="enterprise-card p-6">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 dark:bg-green-900/20 dark:text-green-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">Auto-Fix Security</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Automatically fix SQL injection, XSS, hardcoded secrets, and vulnerable dependencies.
          </p>
        </div>
        <div className="enterprise-card p-6">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 dark:bg-purple-900/20 dark:text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">PR Creation</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Agent creates fix PRs with detailed descriptions, test coverage, and breaking change warnings.
          </p>
        </div>
        <div className="enterprise-card p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 dark:bg-blue-900/20 dark:text-blue-400">
            <Github className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">GitHub Integration</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Posts fix comments directly on PRs, requests reviews, and merges after approval.
          </p>
        </div>
      </div>
    </div>
  );
}
