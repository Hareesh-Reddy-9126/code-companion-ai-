import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PATTERN_PLACEHOLDER = "e.g., console\\.(log|warn|error)\\(|apiKey\\s*=\\s*['\"][^'\"]+['\"]";

import {
  Plus,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Code2,
  Shield,
  Zap,
  Bug,
  Palette,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface CustomRule {
  id: string;
  org_id: string;
  name: string;
  description: string;
  language: string | null;
  pattern: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "security" | "performance" | "bug" | "style" | "best-practice";
  enabled: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const severityConfig: Record<string, { icon: typeof Shield; color: string; bg: string }> = {
  critical: { icon: Shield, color: "text-destructive", bg: "bg-destructive/10" },
  high: { icon: Shield, color: "text-warning", bg: "bg-warning/10" },
  medium: { icon: Zap, color: "text-info", bg: "bg-info/10" },
  low: { icon: Code2, color: "text-muted-foreground", bg: "bg-secondary" },
};

const categoryConfig: Record<string, { icon: typeof Shield; label: string }> = {
  security: { icon: Shield, label: "Security" },
  performance: { icon: Zap, label: "Performance" },
  bug: { icon: Bug, label: "Bug" },
  style: { icon: Palette, label: "Style" },
  "best-practice": { icon: CheckCircle2, label: "Best Practice" },
};

const languageOptions = [
  { value: "ts", label: "TypeScript" },
  { value: "tsx", label: "TSX" },
  { value: "js", label: "JavaScript" },
  { value: "jsx", label: "JSX" },
  { value: "py", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rs", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "cs", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "rb", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kt", label: "Kotlin" },
];

export default function CustomRules() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [rules, setRules] = useState<CustomRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CustomRule | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "ts",
    pattern: "",
    severity: "medium" as const,
    category: "best-practice" as const,
    enabled: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.org_id) loadRules();
  }, [profile?.org_id]);

  const loadRules = async () => {
    if (!profile?.org_id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("custom_rules")
      .select("*")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load rules", description: error.message, variant: "destructive" });
    } else {
      setRules((data || []) as CustomRule[]);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingRule(null);
    setFormData({
      name: "",
      description: "",
      language: "ts",
      pattern: "",
      severity: "medium",
      category: "best-practice",
      enabled: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (rule: CustomRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || "",
      language: rule.language || "ts",
      pattern: rule.pattern,
      severity: rule.severity,
      category: rule.category,
      enabled: rule.enabled,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!profile?.org_id || !profile?.user_id) return;
    if (!formData.name.trim() || !formData.pattern.trim()) {
      toast({ title: "Name and pattern are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      if (editingRule) {
        const { error } = await supabase
          .from("custom_rules")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingRule.id);
        if (error) throw error;
        toast({ title: "Rule updated" });
      } else {
        const { error } = await supabase
          .from("custom_rules")
          .insert({
            ...formData,
            org_id: profile.org_id,
            created_by: profile.user_id,
          });
        if (error) throw error;
        toast({ title: "Rule created" });
      }
      setDialogOpen(false);
      loadRules();
    } catch (error: any) {
      toast({ title: "Failed to save rule", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRule = async (rule: CustomRule) => {
    if (!window.confirm(`Delete rule "${rule.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("custom_rules").delete().eq("id", rule.id);
    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rule deleted" });
      loadRules();
    }
  };

  const toggleEnabled = async (rule: CustomRule) => {
    const { error } = await supabase
      .from("custom_rules")
      .update({ enabled: !rule.enabled, updated_at: new Date().toISOString() })
      .eq("id", rule.id);
    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    } else {
      loadRules();
    }
  };

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
        title="Custom Rules"
        description="Define organization-specific patterns that every analysis must check. Rules run as regex against source code and findings are surfaced alongside AI analysis."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" /> Create rule
          </Button>
        }
      />

      {rules.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No custom rules yet"
          description="Create rules to enforce your team's coding standards, security policies, or architectural conventions. Each rule is a regex pattern that runs against every analysis."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-3.5 w-3.5" /> Create your first rule
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              expanded={expandedId === rule.id}
              onToggleExpand={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
              onEdit={openEdit}
              onDelete={deleteRule}
              onToggle={toggleEnabled}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Rule" : "Create Custom Rule"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11.5px] font-medium text-foreground/85">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., No console.log in production" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11.5px] font-medium text-foreground/85">Language (optional)</label>
                <Select value={formData.language} onValueChange={(v) => setFormData({ ...formData, language: v })}>
                  <SelectTrigger><SelectValue placeholder="All languages" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    {languageOptions.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11.5px] font-medium text-foreground/85">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this rule detect? Why does it matter?"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-[11.5px] font-medium text-foreground/85">Severity</label>
                <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11.5px] font-medium text-foreground/85">Category</label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="style">Style</SelectItem>
                    <SelectItem value="best-practice">Best Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-[12px] font-medium text-foreground">Enabled</span>
                </label>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11.5px] font-medium text-foreground/85">Regex Pattern</label>
              <Textarea
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                placeholder={PATTERN_PLACEHOLDER}
                className="font-mono text-[12px] min-h-[100px]"
                spellCheck={false}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                JavaScript regex syntax. Test at <a href="https://regex101.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">regex101.com</a>.
                Use capture groups for extraction. Pattern runs against each file's content.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              {editingRule ? "Save changes" : "Create rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RuleCard({
  rule,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggle,
}: {
  rule: CustomRule;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: (rule: CustomRule) => void;
  onDelete: (rule: CustomRule) => void;
  onToggle: (rule: CustomRule) => void;
}) {
  const sev = severityConfig[rule.severity];
  const cat = categoryConfig[rule.category];
  const CatIcon = cat.icon;

  return (
    <Card className="panel-hover group relative overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sev.bg}`}>
              <sev.icon className={`h-4 w-4 ${sev.color}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="truncate text-[13px] font-medium text-foreground">{rule.name}</h3>
                <Badge variant="outline" className="shrink-0">{rule.severity}</Badge>
                <Badge variant="secondary" className="shrink-0">
                  <CatIcon className="h-2.5 w-2.5 mr-1" /> {cat.label}
                </Badge>
                {rule.language && (
                  <Badge variant="outline" className="shrink-0 font-mono text-[8px]">{rule.language}</Badge>
                )}
                {!rule.enabled && (
                  <Badge variant="outline" className="shrink-0 bg-muted text-muted-foreground">Disabled</Badge>
                )}
              </div>
              {rule.description && (
                <p className="mt-1.5 truncate text-[11.5px] text-muted-foreground">{rule.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onToggle(rule)} aria-label={rule.enabled ? "Disable" : "Enable"}>
              {rule.enabled ? <ToggleRight className="h-4 w-4 text-primary" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}><Edit2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(rule)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            <Button variant="ghost" size="icon" onClick={onToggleExpand} aria-label={expanded ? "Collapse" : "Expand"}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
            <div className="rounded-xl border border-border/60 bg-white/[0.012] p-3 font-mono text-[11px] overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Pattern:</span>
                <span className="text-[9px] text-muted-foreground/60">JavaScript RegExp</span>
              </div>
              <code>{rule.pattern}</code>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>Created: {new Date(rule.created_at).toLocaleDateString()}</span>
              <span>Updated: {new Date(rule.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}