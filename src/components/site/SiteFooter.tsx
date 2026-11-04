import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Overview", to: "/features" },
      { label: "AI code review", to: "/features#review" },
      { label: "Security", to: "/features#security" },
      { label: "Autonomous agent", to: "/features#agent" },
      { label: "Architecture", to: "/features#architecture" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", to: "/pricing" },
      { label: "Enterprise", to: "/enterprise" },
      { label: "Docs", to: "/docs" },
      { label: "Security policy", to: "/security-policy" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "GitHub", href: "https://github.com/Hareesh-Reddy-9126/code-companion-ai-" },
      { label: "support@codecompanion.ai", href: "mailto:support@codecompanion.ai" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container relative py-12">
        <div className="grid gap-8 border-b border-border pb-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size="md" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground-muted">
              Code intelligence for teams that ship.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Button size="sm" asChild>
                <Link to="/signup">
                  Start free <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9" asChild>
                <a
                  href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"to" in link && link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-foreground-muted hover:text-brand transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-foreground-muted hover:text-brand transition-colors"
                        target={link.href?.startsWith("http") ? "_blank" : undefined}
                        rel={link.href?.startsWith("http") ? "noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 pt-8 border-t border-border text-xs text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Code Companion AI. Built in public.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Public beta · EU data region
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
              Powered by NVIDIA NIM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
