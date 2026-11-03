import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Command, CreditCard, LogOut, Search, Settings, ShieldCheck, User } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandMenu } from "@/components/app/CommandMenu";
import { pageMeta } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [commandOpen, setCommandOpen] = useState(false);

  const meta = pageMeta[location.pathname] ?? { title: "Workspace", group: "Code Companion" };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const initials = (profile?.name || user?.email || "?")
    .split(/[\s@]+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-sticky flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger className="h-8 w-8 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors" />
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="hidden min-w-0 items-center gap-2 text-xs sm:flex">
                <Link
                  to="/dashboard"
                  className="font-mono text-2xs uppercase tracking-wider text-foreground-subtle transition-colors hover:text-foreground"
                >
                  {meta.group}
                </Link>
                <ChevronRight className="h-3 w-3 text-foreground-subtle/40" />
                <span className="truncate font-medium text-foreground">{meta.title}</span>
              </div>
              <span className="truncate text-sm font-medium text-foreground sm:hidden">{meta.title}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="group hidden h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 pr-2 text-xs text-foreground-muted transition-colors hover:border-border-strong hover:text-foreground md:flex press-scale"
                aria-label="Open command menu (⌘K)"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="pr-6">Search or jump to…</span>
                <kbd className="inline-flex items-center gap-1 rounded border-border bg-background px-1.5 text-2xs font-mono text-foreground-subtle">
                  <Command className="h-2.5 w-2.5" />⌘K
                </kbd>
              </button>
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground md:hidden press-scale"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              <div className="mx-1 hidden h-4 w-px bg-border sm:block" />

              <div className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-surface px-2.5 py-1 sm:flex">
                <span className={cn("h-1.5 w-1.5 rounded-full", profile?.github_username ? "bg-success" : "bg-warning")} />
                <span className="max-w-[130px] truncate font-mono text-2xs uppercase tracking-wider text-foreground-subtle">
                  {profile?.github_username ? `@${profile.github_username}` : "GitHub not linked"}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-2xs font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-background-hover press-scale"
                    aria-label="Account menu"
                  >
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl border-border p-1.5">
                  <DropdownMenuLabel className="px-3 py-2">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {profile?.name || "Your account"}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-foreground-muted">
                      {user?.email}
                    </span>
                  </DropdownMenuLabel>
                  <div className="mx-2 mb-1.5 flex items-center gap-2 rounded-lg border border-border/70 bg-surface px-2.5 py-1.5">
                    <ShieldCheck className={cn("h-3.5 w-3.5", profile?.github_username ? "text-success" : "text-warning")} />
                    <span className="text-xs text-foreground-muted">
                      {profile?.github_username ? `GitHub connected as @${profile.github_username}` : "GitHub not connected"}
                    </span>
                  </div>
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuItem asChild className="rounded-lg text-sm">
                    <Link to="/settings">
                      <User className="mr-2 h-3.5 w-3.5" /> Account settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg text-sm">
                    <Link to="/billing">
                      <CreditCard className="mr-2 h-3.5 w-3.5" /> Billing & usage
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg text-sm">
                    <Link to="/organization">
                      <Settings className="mr-2 h-3.5 w-3.5" /> Workspace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg text-sm text-danger focus:text-danger"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="relative flex-1 overflow-auto">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.035),transparent_100%)]" />
            <div className="relative mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </SidebarProvider>
  );
}