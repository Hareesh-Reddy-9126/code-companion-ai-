import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Code2,
  Database,
  GitBranch,
  KeyRound,
  Link as LinkIcon,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

const toc = [
  { id: "overview", label: "Overview" },
  { id: "cli", label: "CLI" },
  { id: "functions", label: "Edge functions" },
  { id: "examples", label: "Request examples" },
  { id: "data", label: "Data model" },
  { id: "limits", label: "Limits and auth" },
];

const functions = [
  {
    name: "analyze-repo",
    method: "POST",
    body: `{ "repoId": "uuid", "analysisType": "full_review" }`,
    desc: "Runs a repository review and stores a structured report.",
  },
  {
    name: "analyze-pr",
    method: "POST",
    body: `{ "prUrl": "https://github.com/owner/repo/pull/184" }`,
    desc: "Reviews a pull request diff and can post findings to GitHub.",
  },
  {
    name: "autonomous-fix",
    method: "POST",
    body: `{ "repo_id": "uuid", "pr_number": 184 }`,
    desc: "Runs the agent over a PR and posts fix suggestions as a review comment.",
  },
  {
    name: "github-auth-url",
    method: "POST",
    body: `{ "state": "opaque-value" }`,
    desc: "Returns the GitHub OAuth authorization URL for the signed-in user.",
  },
  {
    name: "revoke-github",
    method: "POST",
    body: `{ }`,
    desc: "Deletes the stored encrypted GitHub credential for the caller.",
  },
  {
    name: "health",
    method: "GET",
    body: "—",
    desc: "Public liveness probe. Returns service status and timestamp.",
  },
];

const schema = [
  { table: "profiles", description: "Name, avatar, GitHub username and admin flag. Scoped to auth.uid()." },
  { table: "repositories", description: "Connected repositories with language, stars and metadata." },
  { table: "analyses", description: "Scores, structured report JSON, analysis type and public flag." },
  { table: "pull_requests", description: "PR review records with URL, assessment and comment payloads." },
  { table: "autonomous_fixes", description: "Agent runs, status transitions, issue counts and confidence." },
  { table: "github_credentials", description: "Encrypted tokens only. No client policies; service role required." },
];

export default function ApiDocs() {
  return (
    <div className="relative overflow-hidden">
      <DocsBackdrop />

      <section className="relative pb-10 pt-32 sm:pt-40">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <span className="chip">
              <Terminal className="h-3 w-3 text-primary" />
              Developer docs
            </span>
            <h1 className="display-lg mt-6 text-foreground">
              Build on the same{" "}
              <span className="font-display italic text-primary">pipeline.</span>
            </h1>
            <p className="mt-6 max-w-[58ch] text-[15px] leading-7 text-muted-foreground sm:text-[16px]">
              Code Companion exposes its review engine through a CLI and a set
              of authenticated Supabase edge functions. There is no separate
              public API key program yet — this page documents what actually
              exists.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-primary" /> Session-authenticated
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-primary" /> Open-source
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-primary" /> No webhooks yet
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative py-10 sm:py-14">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
            {/* TOC */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">On this page</p>
              <nav className="mt-3 space-y-0.5 border-l border-border/70 pl-3">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 rounded-xl border border-border/60 bg-card p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                  <GitBranch className="h-3 w-3 text-primary" /> Source of truth
                </p>
                <p className="mt-1.5 text-[10.5px] leading-5 text-muted-foreground">
                  The functions in <span className="font-mono text-foreground/70">supabase/functions</span>{" "}
                  define the contract.
                </p>
                <a
                  href="https://github.com/Hareesh-Reddy-9126/code-companion-ai-"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[10.5px] text-primary hover:underline"
                >
                  Open repository <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0 space-y-16">
              {/* Overview */}
              <Reveal id="overview" className="scroll-mt-24">
                <SectionHeading icon={Workflow} eyebrow="Overview" title="Three ways in" />
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      icon: Code2,
                      title: "Web app",
                      copy: "The dashboard is the reference client. Everything the API can do is exercised there.",
                    },
                    {
                      icon: Terminal,
                      title: "CLI",
                      copy: "Best for local checks and scripts. Stores a refresh token, never your password.",
                    },
                    {
                      icon: LinkIcon,
                      title: "Edge functions",
                      copy: "Call the same endpoints with a Supabase access token from your own service.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-border/70 bg-card p-4">
                      <item.icon className="h-4 w-4 text-primary" />
                      <p className="mt-3 text-[12.5px] font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">{item.copy}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-info/20 bg-info/[0.04] p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                  <p className="text-[11.5px] leading-6 text-muted-foreground">
                    <span className="font-medium text-foreground/90">Not documented here:</span>{" "}
                    public API keys, outbound webhooks and organization-scoped
                    tokens. They are on the roadmap and are deliberately not
                    presented as available.
                  </p>
                </div>
              </Reveal>

              {/* CLI */}
              <Reveal id="cli" className="scroll-mt-24">
                <SectionHeading icon={Terminal} eyebrow="CLI" title="Review from the terminal" />
                <p className="mt-4 max-w-[62ch] text-[13px] leading-6 text-muted-foreground">
                  The CLI lives in <span className="font-mono text-foreground/80">cli/</span> and is
                  built with TypeScript. It is not published to npm yet; build
                  it from the repository.
                </p>

                <div className="mt-5 overflow-hidden rounded-xl border border-border/80 bg-[#0A0C0D]">
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                      install
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground/50">bash</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-[11.5px] leading-6 text-foreground/75">
{`git clone https://github.com/Hareesh-Reddy-9126/code-companion-ai-
cd code-companion-ai-/cli
npm install
npm run build
node dist/index.js login`}
                  </pre>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-border/80 bg-[#0A0C0D]">
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                      commands
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground/50">ccai</span>
                  </div>
                  <div className="divide-y divide-border/40">
                    {[
                      { cmd: "login", desc: "Authenticate against your Supabase project." },
                      { cmd: "whoami", desc: "Print the signed-in account." },
                      { cmd: "logout", desc: "Remove the local refresh token." },
                      { cmd: "analyze <repoId>", desc: "Run a repository analysis (--type full_review | security | performance | architecture)." },
                      { cmd: "pr <prUrl>", desc: "Review a GitHub pull request by URL." },
                      { cmd: "fix <repoId> <prNumber>", desc: "Dispatch the agent and post a fix suggestion." },
                    ].map((row) => (
                      <div key={row.cmd} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
                        <code className="w-[190px] shrink-0 font-mono text-[11px] text-primary">{row.cmd}</code>
                        <span className="text-[11.5px] leading-5 text-muted-foreground">{row.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Functions */}
              <Reveal id="functions" className="scroll-mt-24">
                <SectionHeading icon={Database} eyebrow="Edge functions" title="Endpoint reference" />
                <p className="mt-4 max-w-[62ch] text-[13px] leading-6 text-muted-foreground">
                  Base URL:{" "}
                  <span className="font-mono text-[11.5px] text-foreground/80">
                    https://gcszjbtdofquemrbumvg.supabase.co/functions/v1
                  </span>
                  . Send the caller's access token as{" "}
                  <span className="font-mono text-[11.5px] text-foreground/80">Authorization: Bearer &lt;jwt&gt;</span>.
                </p>

                <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
                  <div className="hidden grid-cols-[1.1fr_0.7fr_1.4fr_1.6fr] gap-4 border-b border-border/60 bg-white/[0.02] px-4 py-2.5 sm:grid">
                    {["function", "method", "body", "purpose"].map((heading) => (
                      <span key={heading} className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground">
                        {heading}
                      </span>
                    ))}
                  </div>
                  <div className="divide-y divide-border/40">
                    {functions.map((fn) => (
                      <div
                        key={fn.name}
                        className="grid gap-1.5 px-4 py-3.5 transition-colors hover:bg-white/[0.015] sm:grid-cols-[1.1fr_0.7fr_1.4fr_1.6fr] sm:items-center sm:gap-4"
                      >
                        <code className="font-mono text-[11px] text-primary">{fn.name}</code>
                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                          {fn.method}
                        </span>
                        <code className="break-all font-mono text-[10px] text-foreground/60">{fn.body}</code>
                        <span className="text-[11px] leading-5 text-muted-foreground">{fn.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Examples */}
              <Reveal id="examples" className="scroll-mt-24">
                <SectionHeading icon={Code2} eyebrow="Examples" title="Make a request" />
                <p className="mt-4 max-w-[62ch] text-[13px] leading-6 text-muted-foreground">
                  You need a signed-in Supabase session. In the browser the
                  client handles this; server-side, use the refresh token or a
                  service-role key on your own infrastructure.
                </p>

                <div className="mt-5 space-y-3">
                  <CodePanel
                    title="Repository analysis"
                    lines={[
                      `curl -X POST \\`,
                      `  "$SUPABASE_URL/functions/v1/analyze-repo" \\`,
                      `  -H "Authorization: Bearer $ACCESS_TOKEN" \\`,
                      `  -H "Content-Type: application/json" \\`,
                      `  -d '{"repoId":"9f2c...","analysisType":"full_review"}'`,
                    ]}
                  />
                  <CodePanel
                    title="Pull request review"
                    lines={[
                      `curl -X POST \\`,
                      `  "$SUPABASE_URL/functions/v1/analyze-pr" \\`,
                      `  -H "Authorization: Bearer $ACCESS_TOKEN" \\`,
                      `  -H "Content-Type: application/json" \\`,
                      `  -d '{"prUrl":"https://github.com/acme/api/pull/184"}'`,
                    ]}
                  />
                  <CodePanel
                    title="Agent fix suggestion"
                    lines={[
                      `curl -X POST \\`,
                      `  "$SUPABASE_URL/functions/v1/autonomous-fix" \\`,
                      `  -H "Authorization: Bearer $ACCESS_TOKEN" \\`,
                      `  -H "Content-Type: application/json" \\`,
                      `  -d '{"repo_id":"9f2c...","pr_number":184}'`,
                    ]}
                  />
                </div>
              </Reveal>

              {/* Data model */}
              <Reveal id="data" className="scroll-mt-24">
                <SectionHeading icon={Database} eyebrow="Data model" title="Tables you can query" />
                <p className="mt-4 max-w-[62ch] text-[13px] leading-6 text-muted-foreground">
                  All client-visible tables enforce row-level security scoped to
                  the authenticated user. The encrypted credential table has no
                  client policies at all.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {schema.map((row) => (
                    <div key={row.table} className="rounded-xl border border-border/70 bg-card p-4">
                      <code className="font-mono text-[11px] text-primary">{row.table}</code>
                      <p className="mt-1.5 text-[11.5px] leading-5 text-muted-foreground">{row.description}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Limits */}
              <Reveal id="limits" className="scroll-mt-24">
                <SectionHeading icon={KeyRound} eyebrow="Auth and limits" title="Before you build" />
                <div className="mt-5 space-y-3">
                  {[
                    {
                      title: "Authentication",
                      copy: "Edge functions accept a Supabase access token and resolve the caller with getUser. Requests without a valid token are rejected.",
                    },
                    {
                      title: "Rate limits",
                      copy: "The beta tier allows 10 analyses per day per account. The dashboard shows current usage; the API returns an error when exhausted.",
                    },
                    {
                      title: "Model failover",
                      copy: "Inference uses NVIDIA Nemotron 3 Ultra with two automatic fallbacks. A provider outage does not change your request shape.",
                    },
                    {
                      title: "Agent boundary",
                      copy: "The agent posts suggestions as PR comments. It does not push commits, approve reviews or merge pull requests.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3.5 rounded-xl border border-border/60 bg-white/[0.015] p-4">
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                      <div>
                        <p className="text-[12.5px] font-medium text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">{item.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Need a specific integration?</p>
                    <p className="mt-1 text-[11.5px] text-muted-foreground">
                      Tell us what you are building and we will scope it honestly.
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="mailto:support@codecompanion.ai?subject=Integration%20question">
                      <span>Ask a question <ArrowUpRight className="h-3.5 w-3.5" /></span>
                    </a>
                  </Button>
                </div>
              </Reveal>

              <div className="border-t border-border/60 pt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] text-muted-foreground">
                    Ready to try it in the product?
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link to="/signup">Start free</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/features">Platform overview</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DocsBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="absolute left-1/2 top-[-16rem] h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[110px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: typeof Code2;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="eyebrow flex items-center gap-2">
        <Icon className="h-3 w-3 text-primary" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.04em] text-foreground">{title}</h2>
    </div>
  );
}

function CodePanel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-[#0A0C0D]">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
        <span className="font-mono text-[9px] text-muted-foreground/50">bash</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-6 text-foreground/75">
        {lines.join("\n")}
      </pre>
    </div>
  );
}
