import * as vscode from "vscode";
import { APIClient } from "./api";

const SESSION_KEY = "code-companion.session";
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    name: string;
    orgId?: string;
  };
}

export class AuthManager {
  private context: vscode.ExtensionContext;
  private api: APIClient;
  private session: Session | null = null;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.api = new APIClient();
    this.loadSession();
  }

  private loadSession(): void {
    const stored = this.context.globalState.get<Session>(SESSION_KEY);
    if (stored && stored.expiresAt > Date.now()) {
      this.session = stored;
      this.api.setToken(stored.accessToken);
    }
  }

  private saveSession(session: Session): void {
    this.session = session;
    this.api.setToken(session.accessToken);
    this.context.globalState.update(SESSION_KEY, session);
  }

  async checkSession(): Promise<boolean> {
    if (!this.session) return false;
    if (this.session.expiresAt - Date.now() < REFRESH_THRESHOLD_MS) {
      return await this.refreshSession();
    }
    return true;
  }

  private async refreshSession(): Promise<boolean> {
    if (!this.session?.refreshToken) return false;
    try {
      const response = await fetch(`${this.api.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: this.session.refreshToken }),
      });
      if (!response.ok) throw new Error("Refresh failed");
      const data = await response.json();
      this.saveSession({
        ...this.session!,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      });
      return true;
    } catch {
      await this.logout();
      return false;
    }
  }

  async login(): Promise<boolean> {
    const apiUrl = vscode.workspace.getConfiguration("code-companion").get<string>("apiUrl") || "https://code-companion-ai.hareeshreddy916.workers.dev";
    this.api.baseUrl = apiUrl;

    const panel = vscode.window.createWebviewPanel(
      "code-companion-login",
      "Sign In to Code Companion",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = this.getLoginHTML(apiUrl);

    return new Promise((resolve) => {
      panel.webview.onDidReceiveMessage(async (message) => {
        if (message.type === "auth_callback") {
          const { access_token, refresh_token, expires_in, user } = message.payload;
          this.saveSession({
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: Date.now() + expires_in * 1000,
            user,
          });
          panel.dispose();
          vscode.window.showInformationMessage("Signed in to Code Companion AI");
          resolve(true);
        } else if (message.type === "auth_error") {
          vscode.window.showErrorMessage(`Sign in failed: ${message.error}`);
          resolve(false);
        }
      });
    });
  }

  async logout(): Promise<void> {
    this.session = null;
    this.api.setToken("");
    await this.context.globalState.update(SESSION_KEY, undefined);
    vscode.window.showInformationMessage("Signed out from Code Companion AI");
  }

  getSession(): Session | null {
    return this.session;
  }

  getApi(): APIClient {
    return this.api;
  }

  private getLoginHTML(apiUrl: string): string {
    const redirectUri = `${apiUrl}/auth/vscode/callback`;
    const authUrl = `${apiUrl}/auth/vscode?redirect_uri=${encodeURIComponent(redirectUri)}`;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign In - Code Companion AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090a; color: #e8e8e8; margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .container { max-width: 400px; width: 100%; text-align: center; }
          .logo { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px; }
          .logo span { color: #c4f042; }
          .tagline { color: #888; margin-bottom: 32px; font-size: 14px; }
          .btn { display: inline-flex; align-items: center; gap: 12px; padding: 14px 28px; background: #c4f042; color: #08090a; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.2s; width: 100%; justify-content: center; }
          .btn:hover { background: #a8d438; }
          .btn svg { width: 20px; height: 20px; }
          .note { margin-top: 24px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Code Companion<span>AI</span></div>
          <p class="tagline">AI code review, security scanning, and autonomous fixes</p>
          <a href="${authUrl}" class="btn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Continue with GitHub
          </a>
          <p class="note">Free during public beta · No credit card · No automatic charges</p>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          window.addEventListener('message', (event) => {
            if (event.data.type === 'auth_complete') {
              vscode.postMessage({ type: 'auth_callback', payload: event.data.payload });
            } else if (event.data.type === 'auth_error') {
              vscode.postMessage({ type: 'auth_error', error: event.data.error });
            }
          });
          window.addEventListener('load', () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('access_token')) {
              const payload = {
                access_token: urlParams.get('access_token'),
                refresh_token: urlParams.get('refresh_token'),
                expires_in: parseInt(urlParams.get('expires_in') || '3600', 10),
                user: JSON.parse(decodeURIComponent(urlParams.get('user') || '{}')),
              };
              window.parent.postMessage({ type: 'auth_complete', payload }, '*');
            } else if (urlParams.has('error')) {
              window.parent.postMessage({ type: 'auth_error', error: urlParams.get('error') }, '*');
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}