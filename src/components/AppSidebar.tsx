import { Link, useLocation } from "react-router-dom";
import { ChevronsUpDown, Github, Mail, Plus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { appNavGroups, adminNavItem } from "@/lib/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile, user } = useAuth();
  const workspaceName = profile?.name ? `${profile.name.split(" ")[0]}'s workspace` : "Personal workspace";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60 bg-background">
      <SidebarHeader className={cn("border-b border-border/60 px-3 py-3.5", collapsed && "px-2")}>
        <Link
          to="/dashboard"
          className={cn("flex items-center gap-2.5 rounded-xl py-1.5", collapsed ? "justify-center" : "px-1")}
          aria-label="Code Companion AI dashboard"
        >
          {collapsed ? <LogoMark size="sm" /> : <Logo size="sm" />}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1 pt-3 scrollbar-none">
        {!collapsed && (
          <div className="px-2 pb-3">
            <Link
              to="/organization"
              className="group flex w-full items-center gap-2.5 rounded-xl border border-border/70 bg-surface px-2.5 py-2 transition-colors hover:border-border-strong hover:bg-background-hover"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-semibold text-brand">
                {(profile?.name || user?.email || "W").charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium text-foreground">{workspaceName}</span>
                <span className="block truncate text-xs text-foreground-muted">Free beta · EU</span>
              </span>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-foreground-muted/60" />
            </Link>
          </div>
        )}

        {appNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-2 py-1">
            {!collapsed && (
              <SidebarGroupLabel className="mb-1 h-6 px-2 font-mono text-2xs weight-medium uppercase tracking-wider text-foreground-subtle/60">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const active = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined} className="h-auto p-0">
                        <NavLink
                          to={item.url}
                          end={item.url === "/dashboard"}
                          className={cn(
                            "group/nav relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground",
                            collapsed && "justify-center px-0 py-2.5",
                            active && "bg-brand/10 font-medium text-brand",
                          )}
                          activeClassName="bg-brand/10 font-medium text-brand"
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              active ? "text-brand" : "text-foreground-muted/70 group-hover/nav:text-foreground",
                            )}
                          />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                          {!collapsed && active && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_hsl(var(--brand))]" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {profile?.is_admin && (
          <SidebarGroup className="px-2 py-1">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={collapsed ? adminNavItem.title : undefined} className="h-auto p-0">
                    <NavLink
                      to={adminNavItem.url}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground",
                        collapsed && "justify-center px-0 py-2.5",
                      )}
                      activeClassName="bg-brand/10 font-medium text-brand"
                    >
                      <adminNavItem.icon className="h-4 w-4 shrink-0 text-foreground-muted/70" />
                      {!collapsed && <span>{adminNavItem.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-3">
        {!collapsed ? (
          <div className="space-y-2.5">
            <Link
              to="/repositories"
              className="flex items-center gap-2 rounded-lg border border-dashed border-border px-2.5 py-2 text-sm text-foreground-muted transition-colors hover:border-brand/40 hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5 text-brand" />
              Connect a repository
            </Link>
            <div className="flex items-center justify-between px-1">
              <a
                href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-foreground-muted/60 transition-colors hover:text-foreground"
              >
                <Github className="h-3 w-3" /> Source
              </a>
              <a
                href="mailto:support@codecompanion.ai"
                className="flex items-center gap-1.5 text-xs text-foreground-muted/60 transition-colors hover:text-foreground"
              >
                <Mail className="h-3 w-3" /> Support
              </a>
              <span className="font-mono text-2xs uppercase tracking-wider text-foreground-muted/40">v1.0</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" title="Public beta" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}