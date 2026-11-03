import * as vscode from "vscode";
import { APIClient, AnalysisResponse, Repository } from "./api";
import { AuthManager } from "./auth";
import { FindingsPanel } from "./findingsPanel";

interface Finding {
  file: string;
  line?: number;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  code?: string;
}

export class AnalysisEngine {
  private context: vscode.ExtensionContext;
  private auth: AuthManager;
  private api: APIClient;
  private findingsPanel: FindingsPanel;
  private diagnostics: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext, auth: AuthManager, findingsPanel: FindingsPanel) {
    this.context = context;
    this.auth = auth;
    this.api = auth.getApi();
    this.findingsPanel = findingsPanel;
    this.diagnostics = vscode.languages.createDiagnosticCollection("code-companion");
  }

  async analyzeCurrentFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor");
      return;
    }
    await this.analyzeFile(editor.document.uri);
  }

  async analyzeFile(uri: vscode.Uri): Promise<void> {
    const session = this.auth.getSession();
    if (!session) {
      vscode.window.showWarningMessage("Please sign in first");
      return;
    }

    const document = await vscode.workspace.openTextDocument(uri);
    const content = document.getText();
    const filePath = vscode.workspace.asRelativePath(uri);

    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `Analyzing ${filePath}...` },
      async () => {
        try {
          const result = await this.api.analyzeFile(filePath, content);
          this.processFindings(uri, result);
          this.findingsPanel.addFinding(filePath, result);
          vscode.window.showInformationMessage(`Analysis complete: Quality ${result.quality_score}, Security ${result.security_score}`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Analysis failed: ${error.message}`);
        }
      }
    );
  }

  async analyzeWorkspace(): Promise<void> {
    const session = this.auth.getSession();
    if (!session) {
      vscode.window.showWarningMessage("Please sign in first");
      return;
    }

    const repos = await this.api.getRepositories();
    if (repos.length === 0) {
      vscode.window.showWarningMessage("No repositories connected. Connect a repo in the web dashboard first.");
      return;
    }

    const selected = await vscode.window.showQuickPick(
      repos.map((r) => ({ label: r.repo_name, description: r.language || "Unknown", detail: r.repo_url, repo: r })),
      { placeHolder: "Select repository to analyze" }
    );

    if (!selected) return;

    const analysisType = await vscode.window.showQuickPick(
      [
        { label: "Full Review", description: "Quality, security, performance, architecture", type: "full_review" },
        { label: "Security Scan", description: "Security-focused analysis", type: "security" },
        { label: "Performance", description: "Performance-focused analysis", type: "performance" },
        { label: "Architecture", description: "Architecture pattern detection", type: "architecture" },
      ],
      { placeHolder: "Select analysis type" }
    );

    if (!analysisType) return;

    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `Analyzing ${selected.label}...` },
      async () => {
        try {
          const result = await this.api.analyzeWorkspace(selected.repo.id, analysisType.type);
          this.findingsPanel.addFinding(selected.repo.repo_name, result);
          vscode.window.showInformationMessage(`Workspace analysis complete`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Analysis failed: ${error.message}`);
        }
      }
    );
  }

  async reviewPR(): Promise<void> {
    const session = this.auth.getSession();
    if (!session) {
      vscode.window.showWarningMessage("Please sign in first");
      return;
    }

    const prUrl = await vscode.window.showInputBox({
      prompt: "Enter GitHub PR URL",
      placeHolder: "https://github.com/owner/repo/pull/123",
      validateInput: (value) => value.includes("github.com") && value.includes("/pull/") ? null : "Invalid PR URL format",
    });

    if (!prUrl) return;

    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Reviewing PR..." },
      async () => {
        try {
          const result = await this.api.reviewPR(prUrl);
          this.findingsPanel.addFinding(prUrl, result);
          vscode.window.showInformationMessage(`PR review complete: ${result.comments?.length || 0} comments`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`PR review failed: ${error.message}`);
        }
      }
    );
  }

  async dispatchAgent(): Promise<void> {
    const session = this.auth.getSession();
    if (!session) {
      vscode.window.showWarningMessage("Please sign in first");
      return;
    }

    const repos = await this.api.getRepositories();
    if (repos.length === 0) {
      vscode.window.showWarningMessage("No repositories connected");
      return;
    }

    const selectedRepo = await vscode.window.showQuickPick(
      repos.map((r) => ({ label: r.repo_name, repo: r })),
      { placeHolder: "Select repository" }
    );

    if (!selectedRepo) return;

    const prNumber = await vscode.window.showInputBox({
      prompt: "Enter PR number",
      placeHolder: "123",
      validateInput: (value) => /^\d+$/.test(value) ? null : "Must be a number",
    });

    if (!prNumber) return;

    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Dispatching AI agent..." },
      async () => {
        try {
          const result = await this.api.dispatchAgent({ repoId: selectedRepo.repo.id, prNumber: parseInt(prNumber) });
          vscode.window.showInformationMessage(`Agent complete: ${result.fixes_applied} fixes posted to PR`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Agent failed: ${error.message}`);
        }
      }
    );
  }

  private processFindings(uri: vscode.Uri, result: AnalysisResponse): void {
    const diagnostics: vscode.Diagnostic[] = [];

    const addDiagnostics = (items: any[], severity: vscode.DiagnosticSeverity, prefix: string) => {
      for (const item of items) {
        const range = new vscode.Range(
          Math.max(0, (item.line || 1) - 1),
          0,
          Math.max(0, (item.line || 1) - 1),
          100
        );
        const diagnostic = new vscode.Diagnostic(range, `${prefix}: ${item.issue || item.comment || item}`, severity);
        diagnostic.source = "Code Companion AI";
        diagnostic.code = item.type || item.severity;
        diagnostics.push(diagnostic);
      }
    };

    if (result.security_issues) {
      for (const issue of result.security_issues) {
        const severity = issue.severity === "critical" ? vscode.DiagnosticSeverity.Error :
                        issue.severity === "high" ? vscode.DiagnosticSeverity.Error :
                        issue.severity === "medium" ? vscode.DiagnosticSeverity.Warning :
                        vscode.DiagnosticSeverity.Information;
        const range = new vscode.Range(Math.max(0, (issue.line || 1) - 1), 0, Math.max(0, (issue.line || 1) - 1), 100);
        const diagnostic = new vscode.Diagnostic(range, `Security (${issue.severity}): ${issue.issue}`, severity);
        diagnostic.source = "Code Companion AI";
        diagnostic.code = "security";
        diagnostics.push(diagnostic);
      }
    }

    if (result.performance_issues) {
      for (const issue of result.performance_issues) {
        const severity = issue.impact === "high" ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Information;
        const diagnostic = new vscode.Diagnostic(new vscode.Range(0, 0, 0, 100), `Performance (${issue.impact}): ${issue.issue}`, severity);
        diagnostic.source = "Code Companion AI";
        diagnostic.code = "performance";
        diagnostics.push(diagnostic);
      }
    }

    if (result.comments) {
      for (const comment of result.comments) {
        const severity = comment.type === "bug" || comment.type === "security" ? vscode.DiagnosticSeverity.Error :
                        comment.type === "improvement" ? vscode.DiagnosticSeverity.Warning :
                        vscode.DiagnosticSeverity.Information;
        const range = new vscode.Range(Math.max(0, (comment.line || 1) - 1), 0, Math.max(0, (comment.line || 1) - 1), 100);
        const diagnostic = new vscode.Diagnostic(range, `${comment.type}: ${comment.comment}`, severity);
        diagnostic.source = "Code Companion AI";
        diagnostic.code = comment.type;
        diagnostics.push(diagnostic);
      }
    }

    this.diagnostics.set(uri, diagnostics);
  }

  updateAnnotations(document: vscode.TextDocument): void {
    // Inline annotations would be implemented here
  }

  getDiagnostics(): vscode.DiagnosticCollection {
    return this.diagnostics;
  }

  dispose(): void {
    this.diagnostics.dispose();
  }
}