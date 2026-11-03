import * as vscode from "vscode";
import { AuthManager } from "./auth";
import { APIClient, AnalysisResponse } from "./api";

interface ReviewItem {
  id: string;
  prUrl: string;
  prTitle: string;
  assessment: string;
  commentsCount: number;
  timestamp: string;
  result: AnalysisResponse;
}

export class ReviewsPanel implements vscode.WebviewViewProvider {
  public static readonly viewType = "code-companion.reviews";
  private context: vscode.ExtensionContext;
  private auth: AuthManager;
  private api: APIClient;
  private view?: vscode.WebviewView;
  private reviews: ReviewItem[] = [];

  constructor(context: vscode.ExtensionContext, auth: AuthManager) {
    this.context = context;
    this.auth = auth;
    this.api = auth.getApi();
    this.loadReviews();
  }

  private loadReviews(): void {
    const stored = this.context.globalState.get<ReviewItem[]>("code-companion.reviews");
    if (stored) this.reviews = stored;
  }

  private saveReviews(): void {
    this.context.globalState.update("code-companion.reviews", this.reviews);
  }

  public addReview(prUrl: string, result: AnalysisResponse): void {
    const review: ReviewItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prUrl,
      prTitle: result.pr_title || "Pull Request",
      assessment: result.overall_assessment || "comment",
      commentsCount: result.comments?.length || 0,
      timestamp: new Date().toISOString(),
      result,
    };
    this.reviews.unshift(review);
    if (this.reviews.length > 30) this.reviews.pop();
    this.saveReviews();
    this.refresh();
  }

  public async refresh(): Promise<void> {
    if (this.view) {
      this.view.webview.postMessage({ type: "refresh", reviews: this.reviews });
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

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case "openReview":
          this.openReview(message.id);
          break;
        case "openPR":
          vscode.env.openExternal(vscode.Uri.parse(message.url));
          break;
        case "refresh":
          await this.loadRemoteReviews();
          break;
      }
    });
  }

  private async loadRemoteReviews(): Promise<void> {
    try {
      const remote = await this.api.getPRReviews(20);
      // Merge with local (simplified)
      this.refresh();
    } catch {}
  }

  private openReview(id: string): void {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) return;

    const panel = vscode.window.createWebviewPanel(
      "code-companion-review",
      review.prTitle,
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    panel.webview.html = this.getReviewHtml(review);
  }

  private getHtml(): string {
    const items = this.reviews.map((r) => `
      <div class="review-item" data-id="${r.id}">
        <div class="review-header">
          <span class="review-title">${this.escapeHtml(r.prTitle)}</span>
          <span class="assessment-badge ${r.assessment}">${r.assessment.toUpperCase()}</span>
        </div>
        <div class="review-meta">
          <span class="comments">${r.commentsCount} comments</span>
          <span class="time">${new Date(r.timestamp).toLocaleString()}</span>
        </div>
        <div class="review-url" title="${this.escapeHtml(r.prUrl)}">${this.escapeHtml(r.prUrl).slice(0, 60)}...</div>
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
          .refresh-btn { background: none; border: 1px solid var(--vscode-button-secondaryBorder); color: var(--vscode-button-secondaryForeground); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; }
          .refresh-btn:hover { background: var(--vscode-button-secondaryBackground); }
          .review-item { background: var(--vscode-editor-inactiveSelectionBackground); border: 1px solid var(--vscode-panel-border); border-radius: 6px; padding: 10px; margin-bottom: 8px; cursor: pointer; transition: background 0.15s; }
          .review-item:hover { background: var(--vscode-list-hoverBackground); }
          .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
          .review-title { font-weight: 500; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .assessment-badge { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
          .assessment-badge.approve { background: var(--vscode-testing-iconPassed); color: white; }
          .assessment-badge.request_changes { background: var(--vscode-errorForeground); color: white; }
          .assessment-badge.comment { background: var(--vscode-charts-blue); color: white; }
          .review-meta { display: flex; gap: 12px; font-size: 11px; color: var(--vscode-descriptionForeground); margin-bottom: 4px; }
          .review-url { font-size: 10px; color: var(--vscode-descriptionForeground); opacity: 0.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .empty { text-align: center; padding: 40px 20px; color: var(--vscode-descriptionForeground); opacity: 0.6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h3>PR Reviews</h3>
          <button class="refresh-btn" onclick="refresh()">Refresh</button>
        </div>
        <div id="reviews">
          ${this.reviews.length === 0 ? '<div class="empty">No PR reviews yet. Review a PR to see it here.</div>' : items}
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          document.querySelectorAll('.review-item').forEach(item => {
            item.addEventListener('click', () => vscode.postMessage({ type: 'openReview', id: item.dataset.id }));
          });
          function refresh() { vscode.postMessage({ type: 'refresh' }); }
        </script>
      </body>
      </html>
    `;
  }

  private getReviewHtml(review: ReviewItem): string {
    const result = review.result;
    const comments = result.comments || [];

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
          .meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: var(--vscode-descriptionForeground); margin-bottom: 16px; }
          .badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 3px; text-transform: uppercase; }
          .badge.approve { background: var(--vscode-testing-iconPassed); color: white; }
          .badge.request_changes { background: var(--vscode-errorForeground); color: white; }
          .badge.comment { background: var(--vscode-charts-blue); color: white; }
          .pr-link { color: var(--vscode-textLink-foreground); text-decoration: none; }
          .pr-link:hover { text-decoration: underline; }
          .comment { background: var(--vscode-editor-inactiveSelectionBackground); border: 1px solid var(--vscode-panel-border); border-radius: 6px; padding: 12px; margin-bottom: 12px; }
          .comment.bug { border-left: 3px solid var(--vscode-errorForeground); }
          .comment.suggestion { border-left: 3px solid var(--vscode-charts-blue); }
          .comment.improvement { border-left: 3px solid var(--vscode-testing-iconQueued); }
          .comment.security { border-left: 3px solid var(--vscode-testing-iconFailed); }
          .comment.performance { border-left: 3px solid var(--vscode-charts-orange); }
          .comment-header { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
          .comment-type { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
          .comment-type.bug { background: var(--vscode-errorForeground); color: white; }
          .comment-type.suggestion { background: var(--vscode-charts-blue); color: white; }
          .comment-type.improvement { background: var(--vscode-testing-iconQueued); color: white; }
          .comment-type.security { background: var(--vscode-testing-iconFailed); color: white; }
          .comment-type.performance { background: var(--vscode-charts-orange); color: white; }
          .comment-file { font-size: 12px; font-family: monospace; color: var(--vscode-descriptionForeground); }
          .comment-body { font-size: 13px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${this.escapeHtml(review.prTitle)}</h2>
          <div class="meta">
            <span class="badge ${review.assessment}">${review.assessment.toUpperCase()}</span>
            <span>${review.commentsCount} comments</span>
            <span>${new Date(review.timestamp).toLocaleString()}</span>
            <a href="${this.escapeHtml(review.prUrl)}" class="pr-link" target="_blank">Open on GitHub →</a>
          </div>
        </div>
        ${comments.length === 0 ? '<p style="color: var(--vscode-descriptionForeground);">No line-level comments in this review.</p>' : comments.map((c) => `
          <div class="comment ${c.type}">
            <div class="comment-header">
              <span class="comment-type ${c.type}">${c.type.toUpperCase()}</span>
              <span class="comment-file">${this.escapeHtml(c.file)}${c.line ? `:${c.line}` : ""}</span>
            </div>
            <p class="comment-body">${this.escapeHtml(c.comment)}</p>
          </div>
        `).join("")}
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