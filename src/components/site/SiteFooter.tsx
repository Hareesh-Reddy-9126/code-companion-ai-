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
    <footer className="relative overflow-hidden border-t border-border/60 bg-[#070808]">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[52rem] -translate-x-1/2 rounded-full bg-primary/[0.055] blur-3xl" />

      <div className="container-page relative">
        <div className="grid gap-12 border-b border-border/60 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size="md" />
            <p className="mt-5 max-w-xs text-[13.5px] leading-6 text-muted-foreground">
              Code intelligence for teams that would rather ship than argue
              about review comments.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Button size="sm" asChild>
                <Link to="/signup">
                  Start free <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button variant="outline" size="icon-sm" asChild>
                <a
                  href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"to" in link && link.to ? (
                      <Link to={link.to} className="footer-link">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="footer-link"
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

        <div className="flex flex-col gap-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Code Companion AI. Built in public.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Public beta · EU data region
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
              Powered by NVIDIA NIM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
