import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  Clock,
  Code2,
  CreditCard,
  FileCode,
  GitBranch,
  GitPullRequest,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";

export interface AppNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  shortcut?: string;
}

export interface AppNavGroup {
  label: string;
  items: AppNavItem[];
}

export const appNavGroups: AppNavGroup[] = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, shortcut: "D" },
      { title: "Repositories", url: "/repositories", icon: GitBranch, shortcut: "R" },
      { title: "AI code review", url: "/code-review", icon: Code2, shortcut: "C" },
      { title: "Pull requests", url: "/pull-requests", icon: GitPullRequest, shortcut: "P" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Security", url: "/security", icon: Shield },
      { title: "Performance", url: "/performance", icon: Zap },
      { title: "Architecture", url: "/architecture", icon: Boxes },
      { title: "Custom rules", url: "/custom-rules", icon: FileCode },
      { title: "AI agent", url: "/autonomous-agent", icon: Bot },
      { title: "History", url: "/history", icon: Clock },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Workspace settings", url: "/organization", icon: Users },
      { title: "Billing & usage", url: "/billing", icon: CreditCard },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export const adminNavItem: AppNavItem = {
  title: "Platform admin",
  url: "/admin",
  icon: BarChart3,
};

export const appNavFlat = appNavGroups.flatMap((group) => group.items);

export const pageMeta: Record<string, { title: string; group: string }> = {
  "/dashboard": { title: "Dashboard", group: "Workspace" },
  "/repositories": { title: "Repositories", group: "Workspace" },
  "/code-review": { title: "AI code review", group: "Workspace" },
  "/pull-requests": { title: "Pull requests", group: "Workspace" },
  "/security": { title: "Security", group: "Intelligence" },
  "/performance": { title: "Performance", group: "Intelligence" },
  "/architecture": { title: "Architecture", group: "Intelligence" },
  "/custom-rules": { title: "Custom rules", group: "Intelligence" },
  "/autonomous-agent": { title: "AI agent", group: "Intelligence" },
  "/history": { title: "History", group: "Intelligence" },
  "/organization": { title: "Workspace settings", group: "Account" },
  "/billing": { title: "Billing & usage", group: "Account" },
  "/settings": { title: "Settings", group: "Account" },
  "/admin": { title: "Platform admin", group: "Admin" },
};

export const quickActions: AppNavItem[] = [
  { title: "Analyze a repository", url: "/repositories", icon: GitBranch },
  { title: "Review a pull request", url: "/pull-requests", icon: GitPullRequest },
  { title: "Dispatch the AI agent", url: "/autonomous-agent", icon: Bot },
  { title: "View security findings", url: "/security", icon: Shield },
  { title: "View activity", url: "/history", icon: Activity },
];
