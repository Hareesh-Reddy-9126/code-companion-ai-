import * as vscode from "vscode";
import { AuthManager } from "./auth";
import { AnalysisResponse } from "./api";

interface FindingItem {
  id: string;
  title: string;
  file: string;
  type: string;
  severity: string;
  score: { quality: number; security: number; performance: number; architecture: number };
  summary: string;
  timestamp: string;
  result: AnalysisResponse;
}

export class FindingsPanel implements vscode.WebviewViewProvider {
  public static readonly viewType = "code-companion.findings";
  private context: vscode.ExtensionContext;
  private auth: AuthManager;
  private view?: vscode.WebviewView;
  private findings: FindingItem[] = [];

  constructor(context: vscode.ExtensionContext, auth: AuthManager) {
    this.context = context;
    this.auth = auth;
    this.loadFindings();
  }

  private loadFindings(): void {
    const stored = this.context.globalState.get<FindingItem[]>("code-companion.findings");
    if (stored) {
      this.findings = stored;
    }
  }

  private saveFindings(): void {
    this.context.globalState.update("code-companion.findings", this.findings);
  }

  public addFinding(title: string, result: AnalysisResponse): void {
    const finding: FindingItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      file: "",
      type: result.overall_assessment || "analysis",
      severity: this.getOverallSeverity(result),
      score: {
        quality: result.quality_score,
        security: result.security_score,
        performance: result.performance_score,
        architecture: result.architecture_score,
      },
      summary: result.summary,
      timestamp: new Date().toISOString(),
      result,
    };
    this.findings.unshift(finding);
    if (this.findings.length > 50) this.findings.pop();
    this.saveFindings();
    this.refresh();
  }

  private getOverallSeverity(result: AnalysisResponse): string {
    if (result.security_score < 50) return "critical";
    if (result.security_score < 70) return "high";
    if (result.quality_score < 70) return "medium";
    return "low";
  }

  public refresh(): void {
    if (this.view) {
      this.view.webview.postMessage({ type: "refresh", findings: this.findings });
    }
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case "openFinding":
          this.openFinding(message.id);
          break;
        case "clearAll":
          this.findings = [];
          this.saveFindings();
          this.refresh();
          break;
      }
    });
  }

  private openFinding(id: string): void {
    const finding = this.findings.find((f) => f.id === id);
    if (!finding) return;

    const panel = vscode.window.createWebviewPanel(
      "code-companion-finding",
      finding.title,
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    panel.webview.html = this.getFindingHtml(finding);
  }

  private getHtml(): string {
    const items = this.findings.map((f) => `
      <div class="finding-item" data-id="${f.id}">
        <div class="finding-header">
          <span class="finding-title">${this.escapeHtml(f.title)}</span>
          <span class="severity-badge ${f.severity}">${f.severity.toUpperCase()}</span>
        </div>
        <div class="finding-scores">
          <span class="score quality">Q: ${f.score.quality}</span>
          <span class="score security">S: ${f.score.security}</span>
          <span class="score performance">P: ${f.score.performance}</span>
          <span class="score architecture">A: ${f.score.architecture}</span>
        </div>
        <div class="finding-summary">${this.escapeHtml(f.summary.slice(0, 120))}...</div>
        <div class="finding-time">${new Date(f.timestamp).toLocaleString()}</div>
      </div>
    `).join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); margin: 0; padding: 12px; font-size: 13px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--vscode-panel-border); }
          .header h3 { margin: 0; font-size: 14px; font-weight: 600; }
          .clear-btn { background: none; border: 1px solid var(--vscode-button-secondaryBorder); color: var(--vscode-button-secondaryForeground); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; }
          .clear-btn:hover { background: var(--vscode-button-secondaryBackground); }
          .finding-item { background: var(--vscode-editor-inactiveSelectionBackground); border: 1px solid var(--vscode-panel-border); border-radius: 6px; padding: 10px; margin-bottom: 8px; cursor: pointer; transition: background 0.15s; }
          .finding-item:hover { background: var(--vscode-list-hoverBackground); }
          .finding-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
          .finding-title { font-weight: 500; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .severity-badge { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
          .severity-badge.critical { background: var(--vscode-errorForeground); color: white; }
          .severity-badge.high { background: var(--vscode-testing-iconFailed); color: white; }
          .severity-badge.medium { background: var(--vscode-testing-iconQueued); color: white; }
          .severity-badge.low { background: var(--vscode-testing-iconPassed); color: white; }
          .finding-scores { display: flex; gap: 8px; margin-bottom: 6px; font-size: 11px; color: var(--vscode-descriptionForeground); }
          .score { padding: 1px 6px; background: var(--vscode-badge-background); border-radius: 3px; }
          .finding-summary { font-size: 11px; color: var(--vscode-descriptionForeground); margin-bottom: 4px; }
          .finding-time { font-size: 10px; color: var(--vscode-descriptionForeground); opacity: 0.7; }
          .empty { text-align: center; padding: 40px 20px; color: var(--vscode-descriptionForeground); opacity: 0.6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h3>Recent Findings</h3>
          <button class="clear-btn" onclick="clearAll()">Clear All</button>
        </div>
        <div id="findings">
          ${this.findings.length === 0 ? '<div class="empty">No findings yet. Run an analysis to see results here.</div>' : items}
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          document.querySelectorAll('.finding-item').forEach(item => {
            item.addEventListener('click', () => vscode.postMessage({ type: 'openFinding', id: item.dataset.id }));
          });
          function clearAll() { vscode.postMessage({ type: 'clearAll' }); }
        </script>
      </body>
      </html>
    `;
  }

  private getFindingHtml(finding: FindingItem): string {
    const result = finding.result;
    const sections = [];

    if (result.security_issues?.length) {
      sections.push(`
        <h3>Security Issues (${result.security_issues.length})</h3>
        ${result.security_issues.map((i) => `
          <div class="issue critical">
            <span class="badge">${i.severity.toUpperCase()}</span>
            <strong>${i.file}${i.line ? `:${i.line}` : ""}</strong>
            <p>${i.issue}</p>
          </div>
        `).join("")}
      `);
    }

    if (result.performance_issues?.length) {
      sections.push(`
        <h3>Performance Issues (${result.performance_issues.length})</h3>
        ${result.performance_issues.map((i) => `
          <div class="issue ${i.impact}">
            <span class="badge">${i.impact.toUpperCase()}</span>
            <strong>${i.file}</strong>
            <p>${i.issue}</p>
          </div>
        `).join("")}
      `);
    }

    if (result.comments?.length) {
      sections.push(`
        <h3>Review Comments (${result.comments.length})</h3>
        ${result.comments.map((c) => `
          <div class="issue ${c.type}">
            <span class="badge">${c.type.toUpperCase()}</span>
            <strong>${c.file}${c.line ? `:${c.line}` : ""}</strong>
            <p>${c.comment}</p>
          </div>
        `).join("")}
      `);
    }

    if (result.strengths?.length) {
      sections.push(`
        <h3>Strengths</h3>
        <ul>${result.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>
      `);
    }

    if (result.weaknesses?.length) {
      sections.push(`
        <h3>Weaknesses</h3>
        <ul>${result.weaknesses.map((w) => `<li>${w}</li>`).join("")}</ul>
      `);
    }

    if (result.suggestions?.length) {
      sections.push(`
        <h3>Suggestions</h3>
        <ul>${result.suggestions.map((s) => `<li>${s}</li>`).join("")}</ul>
      `);
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); margin: 0; padding: 20px; line-height: 1.6; }
          .header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--vscode-panel-border); }
          .header h2 { margin: 0 0 8px; font-size: 20px; }
          .meta { display: flex; gap: 16px; font-size: 13px; color: var(--vscode-descriptionForeground); }
          .score { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--vscode-badge-background); border-radius: 4px; font-weight: 500; }
          .score-bar { height: 6px; background: var(--vscode-progressBar-background); border-radius: 3px; overflow: hidden; width: 60px; }
          .score-fill { height: 100%; border-radius: 3px; }
          .score-fill.quality { background: var(--vscode-charts-blue); }
          .score-fill.security { background: var(--vscode-charts-red); }
          .score-fill.performance { background: var(--vscode-charts-orange); }
          .score-fill.architecture { background: var(--vscode-charts-green); }
          h3 { font-size: 15px; margin: 24px 0 12px; color: var(--vscode-editor-foreground); }
          .issue { background: var(--vscode-editor-inactiveSelectionBackground); border: 1px solid var(--vscode-panel-border); border-radius: 6px; padding: 12px; margin-bottom: 12px; }
          .issue.critical { border-left: 3px solid var(--vscode-errorForeground); }
          .issue.high { border-left: 3px solid var(--vscode-testing-iconFailed); }
          .issue.medium { border-left: 3px solid var(--vscode-testing-iconQueued); }
          .issue.low { border-left: 3px solid var(--vscode-testing-iconPassed); }
          .issue.bug { border-left: 3px solid var(--vscode-errorForeground); }
          .issue.security { border-left: 3px solid var(--vscode-testing-iconFailed); }
          .issue.improvement { border-left: 3px solid var(--vscode-charts-blue); }
          .issue.suggestion { border-left: 3px solid var(--vscode-testing-iconQueued); }
          .badge { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px; margin-right: 8px; text-transform: uppercase; }
          .badge.critical { background: var(--vscode-errorForeground); color: white; }
          .badge.high { background: var(--vscode-testing-iconFailed); color: white; }
          .badge.medium { background: var(--vscode-testing-iconQueued); color: white; }
          .badge.low { background: var(--vscode-testing-iconPassed); color: white; }
          .badge.bug { background: var(--vscode-errorForeground); color: white; }
          .badge.security { background: var(--vscode-testing-iconFailed); color: white; }
          .badge.improvement { background: var(--vscode-charts-blue); color: white; }
          .badge.suggestion { background: var(--vscode-testing-iconQueued); color: white; }
          .issue strong { display: block; margin-bottom: 4px; font-size: 13px; }
          .issue p { margin: 0; font-size: 13px; color: var(--vscode-editor-foreground); opacity: 0.9; }
          ul { margin: 8px 0; padding-left: 20px; }
          li { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${this.escapeHtml(finding.title)}</h2>
          <div class="meta">
            <span>${new Date(finding.timestamp).toLocaleString()}</span>
            <span class="score">
              <span>Quality</span>
              <div class="score-bar"><div class="score-fill quality" style="width: ${finding.score.quality}%"></div></div>
              <span>${finding.score.quality}</span>
            </span>
            <span class="score">
              <span>Security</span>
              <div class="score-bar"><div class="score-fill security" style="width: ${finding.score.security}%"></div></div>
              <span>${finding.score.security}</span>
            </span>
            <span class="score">
              <span>Performance</span>
              <div class="score-bar"><div class="score-fill performance" style="width: ${finding.score.performance}%"></div></div>
              <span>${finding.score.performance}</span>
            </span>
            <span class="score">
              <span>Architecture</span>
              <div class="score-bar"><div class="score-fill architecture" style="width: ${finding.score.architecture}%"></div></div>
              <span>${finding.score.architecture}</span>
            </span>
          </div>
        </div>
        <div class="summary">
          <p>${this.escapeHtml(finding.summary)}</p>
        </div>
        ${sections.join("")}
      </body>
      </html>
    `;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """)
      .replace(/'/g, "&#039;");
  }
}