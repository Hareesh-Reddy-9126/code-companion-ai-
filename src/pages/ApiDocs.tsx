import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Terminal, Globe, Link as LinkIcon } from "lucide-react";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">API Documentation</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            Integrate Code Companion AI into your CI/CD pipeline, IDE, or custom tools
            with our REST API and webhooks.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="enterprise-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">REST API</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Analyze repositories, pull requests, and get security reports via REST endpoints.
              </p>
              <div className="code-block mb-6">
                <span className="text-pink-600 font-mono text-xs">POST</span>{" "}
                <span className="text-blue-600 font-mono text-xs">/v1/analyze/repo</span>
              </div>
              <Button variant="outline" className="w-full">View API Reference</Button>
            </div>

            <div className="enterprise-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Webhooks</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Receive real-time notifications when analysis completes or issues are found.
              </p>
              <div className="code-block mb-6">
                <span className="text-pink-600 font-mono text-xs">WEBHOOK</span>{" "}
                <span className="text-blue-600 font-mono text-xs">analysis.completed</span>
              </div>
              <Button variant="outline" className="w-full">Configure Webhooks</Button>
            </div>

            <div className="enterprise-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">CLI Tool</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Run code analysis from your terminal and integrate with GitHub Actions.
              </p>
              <div className="code-block mb-6">
                <span className="text-pink-600 font-mono text-xs">$</span>{" "}
                <span className="text-blue-600 font-mono text-xs">ccai analyze --repo owner/repo</span>
              </div>
              <Button variant="outline" className="w-full">Install CLI</Button>
            </div>
          </div>

          <div className="mt-16 enterprise-card p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Start</h2>
            <div className="code-block">
              <span className="text-pink-600 font-mono text-xs">curl</span> <span className="text-blue-600 font-mono text-xs">-X POST https://api.codecompanion.ai/v1/analyze/repo \\</span><br />
              <span className="ml-4 text-blue-600 font-mono text-xs">-H "Authorization: Bearer $API_KEY" \\</span><br />
              <span className="ml-4 text-blue-600 font-mono text-xs">-H "Content-Type: application/json" \\</span><br />
              <span className="ml-4 text-blue-600 font-mono text-xs">-d 'example_payload'</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
