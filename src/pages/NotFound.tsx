import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, Compass, Home, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.055] blur-[120px]" />

      <header className="relative z-10">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" aria-label="Code Companion AI home">
            <Logo />
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/docs">
              <span><Terminal className="h-3.5 w-3.5" /> Docs</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">404 · route not found</p>
          <p className="mt-6 font-display text-[92px] leading-none tracking-[-0.06em] text-foreground sm:text-[128px]">
            4<span className="italic text-primary">0</span>4
          </p>
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.04em] text-foreground sm:text-[28px]">
            This page was never merged.
          </h1>
          <p className="mx-auto mt-3 max-w-[42ch] text-[13.5px] leading-6 text-muted-foreground">
            The route <code className="rounded border border-border/70 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-foreground/70">{location.pathname}</code>{" "}
            does not exist. It may have moved, or the link may be out of date.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/">
                <span><Home className="h-4 w-4" /> Back to home</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">
                <span>Open dashboard <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-12 grid max-w-md gap-px overflow-hidden rounded-xl border border-border/70 bg-border/60 sm:grid-cols-3">
            {[
              { label: "Platform", to: "/features" },
              { label: "Pricing", to: "/pricing" },
              { label: "Docs", to: "/docs" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-center gap-1.5 bg-card px-4 py-3 text-[12px] text-muted-foreground transition-colors hover:bg-[#0C0E0F] hover:text-foreground"
              >
                {item.label}
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/60">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-[11px] text-muted-foreground sm:flex-row">
          <span className="flex items-center gap-1.5">
            <Compass className="h-3 w-3" /> Lost? Email support@codecompanion.ai
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/50">
            Code Companion AI
          </span>
        </div>
      </footer>
    </div>
  );
}
