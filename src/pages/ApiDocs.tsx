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
    desc: "Returns platform health status.",
  },
];

const baseUrl = "https://code-companion-ai.hareeshreddy916.workers.dev/api";

export default function ApiDocs() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-36 pb-32 sm:pb-40">
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              API documentation
            </p>
            <h1 className="text-h1 mx-auto mt-6 max-w-[48ch] text-foreground">
              Programmatic access to{" "}
              <span className="font-medium text-brand">code review.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
              Trigger reviews, fetch reports and manage repositories through
              REST edge functions. All endpoints require a valid session.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  <span>Start free <ArrowUpRight className="h-4 w-4" /></span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/features">
                  <span>See the platform</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-4xl mb-16">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Contents
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Browse the <span className="font-medium text-brand">API.</span>
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {toc.map((item) => (
              <TOCItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Edge functions */}
      <section className="border-y border-border py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-4xl mb-16">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Edge functions
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Serverless <span className="font-medium text-brand">endpoints.</span>
            </h2>
          </div>

          <div className="grid gap-4">
            {functions.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} />
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-24 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-3xl mb-16">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Example
            </p>
            <h2 className="text-h2 mt-4 text-foreground">
              Trigger a <span className="font-medium text-brand">review.</span>
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-4 w-4 text-brand" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                cURL example
              </span>
            </div>
            <pre className="overflow-auto rounded-lg border border-border bg-[#08090A] p-4 font-mono text-xs leading-relaxed text-muted-foreground">
              {`curl -X POST ${baseUrl}/analyze-repo \\\n  -H "Authorization: Bearer $SESSION_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '${functions[0].body}'`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

function TOCItem({ id, label }: { id: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Link to={`/docs#${id}`} className="text-sm font-medium text-foreground hover:text-brand transition-colors">
        {label}
      </Link>
    </div>
  );
}

function FunctionCard({ fn }: { fn: typeof functions[0] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${fn.method === "POST" ? "border-brand bg-brand/10 text-brand" : "border-info bg-info/10 text-info"}`}>
          {fn.method}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          /api/{fn.name}
        </span>
      </div>
      <h3 className="text-sm font-medium text-foreground mb-2">{fn.name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{fn.desc}</p>
      <pre className="overflow-auto rounded-lg border border-border bg-[#08090A] p-3 font-mono text-[9px] leading-relaxed text-muted-foreground">
        {fn.body}
      </pre>
    </div>
  );
}
