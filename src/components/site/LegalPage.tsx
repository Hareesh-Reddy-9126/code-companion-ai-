import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, FileText, ShieldCheck } from "lucide-react";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}

export function LegalPage({ eyebrow, title, description, updated, toc, children }: LegalPageProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="absolute left-1/2 top-[-15rem] h-[26rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[110px]" />
      </div>

      <section className="relative pb-10 pt-32 sm:pt-36">
        <div className="container-page">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <div className="mt-7 max-w-3xl">
            <span className="chip">
              <FileText className="h-3 w-3 text-primary" />
              {eyebrow}
            </span>
            <h1 className="display-md mt-5 text-foreground">{title}</h1>
            <p className="mt-4 max-w-[62ch] text-[14px] leading-7 text-muted-foreground">{description}</p>
            <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/60">
              Last updated {updated}
            </p>
          </div>
        </div>
      </section>

      <section className="relative pb-20 pt-8 sm:pb-28">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[210px_1fr] lg:gap-16">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">Contents</p>
              <nav className="mt-3 space-y-0.5 border-l border-border/70 pl-3">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-1.5 text-[11.5px] leading-5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-7 rounded-xl border border-border/60 bg-card p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" /> Questions
                </p>
                <p className="mt-1.5 text-[10.5px] leading-5 text-muted-foreground">
                  security@codecompanion.ai
                </p>
                <a
                  href="mailto:security@codecompanion.ai"
                  className="mt-2 inline-flex items-center gap-1 text-[10.5px] text-primary hover:underline"
                >
                  Contact us <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </aside>

            <article className="prose-editorial max-w-[72ch]">{children}</article>
          </div>
        </div>
      </section>
    </div>
  );
}

export function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border/60 py-8 first:border-t-0 first:pt-0">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/60">{number}</p>
      <h2 className="mt-2 text-[19px] font-semibold tracking-[-0.025em] text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-[13.5px] leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}
