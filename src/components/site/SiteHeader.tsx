import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Platform", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "Enterprise", to: "/enterprise" },
  { label: "Docs", to: "/docs" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = scrolled || !transparent;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group inline-flex items-center" aria-label="Code Companion AI home">
          <Logo className="transition-opacity group-hover:opacity-90" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="site-nav-link"
              data-active={location.pathname === item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <span className="mr-1 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground xl:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
            Public beta
          </span>
          <Button variant="ghost" size="sm" className="text-[13px]" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="h-9 px-4 text-[13px]" asChild>
            <Link to="/signup">
              Start free <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 px-5 pb-6 pt-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between border-b border-border/40 py-3.5 text-[15px] text-foreground"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Start free</Link>
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Free during public beta
          </p>
        </div>
      )}
    </header>
  );
}
