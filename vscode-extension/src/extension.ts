import * as vscode from "vscode";
import { CodeCompanionProvider } from "./provider";
import { AuthManager } from "./auth";
import { AnalysisEngine } from "./analysis";
import { FindingsPanel } from "./findingsPanel";
import { ReviewsPanel } from "./reviewsPanel";

export async function activate(context: vscode.ExtensionContext) {
  console.log("Code Companion AI extension activated");

  const authManager = new AuthManager(context);
  const analysisEngine = new AnalysisEngine(context, authManager);
  const findingsPanel = new FindingsPanel(context, authManager);
  const reviewsPanel = new ReviewsPanel(context, authManager);

  const provider = new CodeCompanionProvider(context, authManager, analysisEngine, findingsPanel, reviewsPanel);

  context.subscriptions.push(
    vscode.commands.registerCommand("code-companion.analyzeFile", () => provider.analyzeCurrentFile()),
    vscode.commands.registerCommand("code-companion.analyzeWorkspace", () => provider.analyzeWorkspace()),
    vscode.commands.registerCommand("code-companion.reviewPR", () => provider.reviewPR()),
    vscode.commands.registerCommand("code-companion.dispatchAgent", () => provider.dispatchAgent()),
    vscode.commands.registerCommand("code-companion.login", () => provider.login()),
    vscode.commands.registerCommand("code-companion.logout", () => provider.logout()),
    vscode.commands.registerCommand("code-companion.openDashboard", () => provider.openDashboard()),
    vscode.window.registerWebviewViewProvider("code-companion.findings", findingsPanel),
    vscode.window.registerWebviewViewProvider("code-companion.reviews", reviewsPanel),
    vscode.window.registerWebviewViewProvider("code-companion.settings", provider.getSettingsPanel()),
  );

  if (vscode.workspace.getConfiguration("code-companion").get("autoAnalyzeOnSave")) {
    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument((doc) => {
        if (doc.uri.scheme === "file") {
          provider.analyzeFile(doc.uri);
        }
      })
    );
  }

  authManager.checkSession().then((hasSession) => {
    if (hasSession) {
      findingsPanel.refresh();
      reviewsPanel.refresh();
    }
  });

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && vscode.workspace.getConfiguration("code-companion").get("showInlineAnnotations")) {
        provider.updateAnnotations(editor.document);
      }
    })
  );
}

export function deactivate() {}