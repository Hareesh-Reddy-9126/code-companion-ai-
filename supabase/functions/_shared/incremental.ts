import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./env.ts";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface FileChange {
  path: string;
  patch: string;
  additions: number;
  deletions: number;
  status: "added" | "modified" | "removed" | "renamed";
}

export interface CallGraphNode {
  file: string;
  symbols: string[];
  imports: string[];
  calls: string[];
  calledBy: string[];
}

export interface AnalysisScope {
  files: FileChange[];
  affectedFiles: string[];
  callGraph: Map<string, CallGraphNode>;
  totalFiles: number;
  analyzedFiles: number;
}

const LANGUAGE_EXTENSIONS: Record<string, string[]> = {
  typescript: [".ts", ".tsx"],
  javascript: [".js", ".jsx"],
  python: [".py"],
  go: [".go"],
  rust: [".rs"],
  java: [".java"],
  csharp: [".cs"],
  php: [".php"],
  ruby: [".rb"],
};

function detectLanguage(filename: string): string | null {
  for (const [lang, exts] of Object.entries(LANGUAGE_EXTENSIONS)) {
    if (exts.some((ext) => filename.endsWith(ext))) return lang;
  }
  return null;
}

function extractSymbols(content: string, language: string): string[] {
  const symbols: string[] = [];
  const lines = content.split("\n");

  switch (language) {
    case "typescript":
    case "javascript": {
      const patterns = [
        /export\s+(?:async\s+)?function\s+(\w+)/g,
        /export\s+const\s+(\w+)\s*=\s*(?:async\s+)?\(/g,
        /export\s+class\s+(\w+)/g,
        /export\s+interface\s+(\w+)/g,
        /export\s+type\s+(\w+)/g,
        /export\s+{\s*([^}]+)\s*}/g,
        /export\s+default\s+(?:function\s+)?(\w+)/g,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) symbols.push(match[1].trim());
        }
      }
      break;
    }
    case "python": {
      const patterns = [
        /^def\s+(\w+)/gm,
        /^class\s+(\w+)/gm,
        /^async\s+def\s+(\w+)/gm,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) symbols.push(match[1].trim());
        }
      }
      break;
    }
    case "go": {
      const patterns = [
        /^func\s+(?:\([^)]*\)\s*)?(\w+)/gm,
        /^type\s+(\w+)\s+struct/gm,
        /^type\s+(\w+)\s+interface/gm,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) symbols.push(match[1].trim());
        }
      }
      break;
    }
    case "rust": {
      const patterns = [
        /^pub\s+fn\s+(\w+)/gm,
        /^pub\s+struct\s+(\w+)/gm,
        /^pub\s+enum\s+(\w+)/gm,
        /^pub\s+trait\s+(\w+)/gm,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) symbols.push(match[1].trim());
        }
      }
      break;
    }
  }

  return [...new Set(symbols)];
}

function extractImports(content: string, language: string): string[] {
  const imports: string[] = [];
  const lines = content.split("\n");

  switch (language) {
    case "typescript":
    case "javascript": {
      const patterns = [
        /import\s+(?:(?:\w+|\{[\w\s,]+\})\s+from\s+)?["']([^"']+)["']/g,
        /require\(["']([^"']+)["']\)/g,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) imports.push(match[1].trim());
        }
      }
      break;
    }
    case "python": {
      const patterns = [
        /^from\s+([\w.]+)\s+import/gm,
        /^import\s+([\w.]+)/gm,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) imports.push(match[1].trim());
        }
      }
      break;
    }
    case "go": {
      const patterns = [
        /^import\s+"([^"]+)"/gm,
        /^import\s+\(([^)]+)\)/gm,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) {
            const multi = match[1].split("\n").map((l) => l.trim().replace(/"/g, "")).filter(Boolean);
            imports.push(...multi);
          }
        }
      }
      break;
    }
    case "rust": {
      const patterns = [
        /^use\s+([\w:]+);/gm,
        /^extern\s+crate\s+(\w+);/gm,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) imports.push(match[1].trim());
        }
      }
      break;
    }
  }

  return imports;
}

function extractCalls(content: string, language: string): string[] {
  const calls: string[] = [];

  switch (language) {
    case "typescript":
    case "javascript": {
      const patterns = [
        /\b(\w+)\s*\(/g,
        /\.(\w+)\s*\(/g,
        /await\s+(\w+)\s*\(/g,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1] && match[1].length > 2) calls.push(match[1].trim());
        }
      }
      break;
    }
    case "python": {
      const patterns = [
        /\b(\w+)\s*\(/g,
        /\b(\w+)\.\w+\s*\(/g,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1] && match[1].length > 2) calls.push(match[1].trim());
        }
      }
      break;
    }
  }

  return [...new Set(calls)];
}

export async function buildCallGraph(
  repoId: string,
  owner: string,
  repoName: string,
  token: string,
  changedFiles: FileChange[],
): Promise<AnalysisScope> {
  const language = detectLanguage(changedFiles[0]?.path || "") || "typescript";

  const changedPaths = new Set(changedFiles.map((f) => f.path));
  const affectedFiles = new Set<string>(changedPaths);
  const callGraph = new Map<string, CallGraphNode>();

  const changedFileContents = changedFiles.map((f) => ({
    path: f.path,
    content: f.patch,
    language,
  }));

  for (const file of changedFileContents) {
    const symbols = extractSymbols(file.content, language);
    const imports = extractImports(file.content, language);
    const calls = extractCalls(file.content, language);

    callGraph.set(file.path, {
      file: file.path,
      symbols,
      imports,
      calls,
      calledBy: [],
    });

    for (const imp of imports) {
      const resolved = resolveImport(imp, file.path, language);
      if (resolved && !changedPaths.has(resolved)) {
        affectedFiles.add(resolved);
      }
    }
  }

  const additionalFiles: FileChange[] = [];
  for (const affected of affectedFiles) {
    if (!changedPaths.has(affected)) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repoName}/contents/${affected}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3.raw",
              "User-Agent": "code-companion-ai",
            },
          },
        );
        if (res.ok) {
          const content = await res.text();
          const symbols = extractSymbols(content, language);
          const imports = extractImports(content, language);
          const calls = extractCalls(content, language);

          callGraph.set(affected, {
            file: affected,
            symbols,
            imports,
            calls,
            calledBy: [],
          });

          additionalFiles.push({
            path: affected,
            content,
            additions: 0,
            deletions: 0,
            status: "modified",
          });

          for (const imp of imports) {
            const resolved = resolveImport(imp, affected, language);
            if (resolved && !affectedFiles.has(resolved)) {
              affectedFiles.add(resolved);
            }
          }
        }
      } catch {}
    }
  }

  for (const [file, node] of callGraph) {
    for (const call of node.calls) {
      for (const [otherFile, otherNode] of callGraph) {
        if (otherFile !== file && otherNode.symbols.includes(call)) {
          otherNode.calledBy.push(file);
        }
      }
    }
  }

  const allFiles = [...changedFiles, ...additionalFiles];

  return {
    files: changedFiles,
    affectedFiles: [...affectedFiles],
    callGraph,
    totalFiles: allFiles.length,
    analyzedFiles: allFiles.length,
  };
}

function resolveImport(imp: string, fromFile: string, language: string): string | null {
  if (imp.startsWith(".")) {
    const dir = fromFile.substring(0, fromFile.lastIndexOf("/"));
    let resolved = dir + "/" + imp;
    if (language === "typescript" || language === "javascript") {
      if (!resolved.endsWith(".ts") && !resolved.endsWith(".tsx") && !resolved.endsWith(".js") && !resolved.endsWith(".jsx")) {
        resolved += ".ts";
      }
    } else if (language === "python") {
      if (!resolved.endsWith(".py")) resolved += ".py";
    } else if (language === "go") {
      if (!resolved.endsWith(".go")) resolved += ".go";
    } else if (language === "rust") {
      if (!resolved.endsWith(".rs")) resolved += ".rs";
    }
    return resolved;
  }
  return null;
}

export async function getLastAnalysisSnapshot(repoId: string): Promise<Map<string, string> | null> {
  const { data } = await admin
    .from("analysis_snapshots")
    .select("file_path, content_hash")
    .eq("repo_id", repoId);

  if (!data) return null;
  const map = new Map<string, string>();
  for (const row of data) {
    map.set(row.file_path, row.content_hash);
  }
  return map;
}

export async function saveAnalysisSnapshot(repoId: string, files: Array<{ path: string; content: string }>): Promise<void> {
  const rows = files.map((f) => ({
    repo_id: repoId,
    file_path: f.path,
    content_hash: await hashContent(f.content),
    updated_at: new Date().toISOString(),
  }));

  await admin.from("analysis_snapshots").upsert(rows, { onConflict: "repo_id,file_path" });
}

async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getIncrementalPrompt(scope: AnalysisScope, basePrompt: string): string {
  const changedFiles = scope.files.map((f) => f.path).join(", ");
  const affectedFiles = scope.affectedFiles.filter((f) => !scope.files.some((cf) => cf.path === f)).join(", ");

  return `${basePrompt}

INCREMENTAL ANALYSIS MODE:
- Changed files: ${changedFiles}
- Affected files (callers/imports): ${affectedFiles || "none"}
- Total files in scope: ${scope.totalFiles}

Focus your analysis on the changed files and their direct callers. Do not re-analyze unaffected files. Report findings only for the scope above.`;
}