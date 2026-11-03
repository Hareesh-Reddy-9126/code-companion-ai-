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
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="hidden min-w-0 items-center gap-1.5 text-[11.5px] sm:flex">
                <Link
                  to="/dashboard"
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {meta.group}
                </Link>
                <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                <span className="truncate font-medium text-foreground/90">{meta.title}</span>
              </div>
              <span className="truncate text-[13px] font-medium text-foreground sm:hidden">{meta.title}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="group hidden h-8 items-center gap-2 rounded-full border border-border/80 bg-white/[0.02] pl-3 pr-1.5 text-[11.5px] text-muted-foreground transition-colors hover:border-muted-foreground/30 hover:text-foreground md:flex"
                aria-label="Open command menu"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="pr-6">Search or jump to…</span>
                <kbd className="kbd gap-0.5 border-border/60 bg-secondary/80 px-1.5">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </button>
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground md:hidden"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              <div className="mx-1 hidden h-4 w-px bg-border sm:block" />

              <div className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-white/[0.02] px-2.5 py-1 sm:flex">
                <span className={`h-1.5 w-1.5 rounded-full ${profile?.github_username ? "bg-primary" : "bg-warning"}`} />
                <span className="max-w-[130px] truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                  {profile?.github_username ? `@${profile.github_username}` : "GitHub not linked"}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-[10px] font-semibold text-foreground transition-colors hover:border-muted-foreground/40"
                    aria-label="Account menu"
                  >
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/80 p-1.5">
                  <DropdownMenuLabel className="px-2.5 py-2">
                    <span className="block truncate text-[13px] font-medium text-foreground">
                      {profile?.name || "Your account"}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                  </DropdownMenuLabel>
                  <div className="mx-2 mb-1.5 flex items-center gap-1.5 rounded-lg border border-border/70 bg-white/[0.02] px-2 py-1.5">
                    <ShieldCheck className={`h-3 w-3 ${profile?.github_username ? "text-primary" : "text-warning"}`} />
                    <span className="text-[10.5px] text-muted-foreground">
                      {profile?.github_username ? `GitHub connected as @${profile.github_username}` : "GitHub not connected"}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg text-[13px]">
                    <Link to="/settings">
                      <User className="mr-2 h-3.5 w-3.5" /> Account settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg text-[13px]">
                    <Link to="/billing">
                      <CreditCard className="mr-2 h-3.5 w-3.5" /> Billing & usage
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg text-[13px]">
                    <Link to="/organization">
                      <Settings className="mr-2 h-3.5 w-3.5" /> Workspace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg text-[13px] text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="relative flex-1 overflow-auto">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--primary)/0.035),transparent_100%)]" />
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
