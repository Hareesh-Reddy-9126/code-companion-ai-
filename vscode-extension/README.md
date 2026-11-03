# Code Companion AI - VS Code Extension

AI-powered code review, security scanning, and autonomous fixes directly in your editor.

## Features

- **Analyze Current File** - Get instant AI review of the file you're editing
- **Analyze Workspace** - Full repository analysis with quality, security, performance, architecture scores
- **Review Pull Requests** - Paste a GitHub PR URL and get structured review comments
- **Dispatch AI Agent** - Autonomous fix suggestions posted as PR review comments
- **Inline Annotations** - Findings appear as diagnostics in your editor
- **Findings Panel** - History of all analyses with detailed breakdowns
- **Reviews Panel** - PR review history with GitHub links

## Installation

### From Source (Development)

```bash
cd vscode-extension
npm install
npm run compile
code --install-extension .
```

### From VSIX (Release)

```bash
cd vscode-extension
npm install
vsce package
code --install-extension code-companion-ai-0.1.0.vsix
```

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `code-companion.apiUrl` | `https://code-companion-ai.hareeshreddy916.workers.dev` | API base URL |
| `code-companion.autoAnalyzeOnSave` | `false` | Auto-analyze file on save |
| `code-companion.showInlineAnnotations` | `true` | Show findings as inline diagnostics |

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| `code-companion.analyzeFile` | `Ctrl+Shift+A` / `Cmd+Shift+A` | Analyze current file |
| `code-companion.analyzeWorkspace` | - | Analyze entire workspace |
| `code-companion.reviewPR` | `Ctrl+Shift+R` / `Cmd+Shift+R` | Review a pull request |
| `code-companion.dispatchAgent` | - | Dispatch AI agent on PR |
| `code-companion.login` | - | Sign in to Code Companion |
| `code-companion.logout` | - | Sign out |
| `code-companion.openDashboard` | - | Open web dashboard |

## Usage

1. **Sign In** - Run `Code Companion: Sign In` to authenticate with GitHub
2. **Analyze File** - Open a file, press `Ctrl+Shift+A` or right-click → "Analyze with Code Companion"
3. **Review PR** - Run `Code Companion: Review Pull Request`, paste GitHub PR URL
4. **Dispatch Agent** - Run `Code Companion: Dispatch AI Agent`, select repo and PR number
4. **View Results** - Findings appear in the Code Companion sidebar and as inline annotations

## Architecture

```
src/
├── extension.ts       # Main entry point
├── auth.ts            # Authentication (GitHub OAuth via webview)
├── api.ts             # API client for Code Companion backend
├── analysis.ts        # Analysis engine & diagnostics
├── findingsPanel.ts   # Findings history webview
└── reviewsPanel.ts    # PR reviews history webview
```

## Development

```bash
cd vscode-extension
npm install
npm run watch  # Compile on change
```

Press `F5` in VS Code to launch Extension Development Host.

## Zero-Cost Stack

- **Backend**: Supabase Free (Postgres + Edge Functions)
- **AI**: NVIDIA NIM Free Tier (Nemotron 3 Ultra)
- **Hosting**: Cloudflare Workers Free
- **CI/CD**: GitHub Actions Free

## License

MIT