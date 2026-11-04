import { Link } from "react-router-dom";
import { ArrowRight, Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <header className="relative z-10">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" aria-label="Code Companion AI home">
            <Logo />
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/docs">
              <span><Compass className="h-3.5 w-3.5" /> Docs</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand">
            404 · route not found
          </p>
          <p className="mt-6 font-display text-[80px] leading-none tracking-[-0.06em] text-foreground sm:text-[128px]">
            4<span className="italic text-brand">0</span>4
          </p>
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.04em] text-foreground sm:text-[28px]">
            This page was never merged.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-[48ch] mx-auto">
            The URL you requested doesn't exist. Head back to the dashboard or
            browse the docs.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/dashboard">
                <span>Go to dashboard <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">
                <span>Browse features <Compass className="h-4 w-4" /></span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
