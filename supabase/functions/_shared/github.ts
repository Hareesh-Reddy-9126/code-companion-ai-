import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "./env.ts";

/**
 * Exchange a GitHub OAuth code for an access token.
 */
export async function exchangeGitHubCode(code: string): Promise<{
  access_token?: string;
  error?: string;
  error_description?: string;
}> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  return (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
}

/**
 * Fetch the authenticated GitHub user profile.
 */
export async function getGitHubUser(accessToken: string): Promise<any> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "code-companion-ai",
    },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch all repositories for a GitHub user (paginated).
 */
export async function listGitHubRepos(
  accessToken: string,
): Promise<any[]> {
  const repos: any[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "code-companion-ai",
        },
      },
    );
    if (!res.ok) break;
    const batch = (await res.json()) as any[];
    if (!batch || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < perPage) break;
    page++;
    if (page > 10) break; // safety cap
  }

  return repos;
}

/**
 * Recursively fetch code files from a GitHub repository (capped).
 */
export async function fetchRepoFiles(
  owner: string,
  repo: string,
  token: string,
  opts: {
    maxFiles?: number;
    maxKbPerFile?: number;
    totalKbCap?: number;
  } = {},
): Promise<{ path: string; content: string }[]> {
  const {
    maxFiles = 25,
    maxKbPerFile = 50,
    totalKbCap = 300,
  } = opts;

  const IGNORED_DIRS = [
    "node_modules", "build", "dist", ".git", ".next", "__pycache__",
    "vendor", ".venv", "target", ".gradle", ".expo",
  ];
  const CODE_EXTENSIONS = [
    ".js", ".ts", ".tsx", ".jsx", ".py", ".java", ".html", ".css",
    ".go", ".rs", ".rb", ".c", ".cpp", ".h", ".hpp", ".php", ".swift",
    ".kt", ".scala", ".r", ".m", ".mm", ".vue", ".svelte",
  ];

  const codeFiles: { path: string; content: string }[] = [];
  let totalKb = 0;

  async function walk(path = ""): Promise<void> {
    if (codeFiles.length >= maxFiles) return;
    if (totalKb >= totalKbCap) return;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "code-companion-ai",
        },
      },
    );
    if (!res.ok) return;
    const items = (await res.json()) as any[];
    if (!Array.isArray(items)) return;

    for (const item of items) {
      if (codeFiles.length >= maxFiles) break;
      if (totalKb >= totalKbCap) break;

      if (item.type === "dir") {
        if (IGNORED_DIRS.includes(item.name)) continue;
        await walk(item.path);
      } else if (item.type === "file") {
        const ext = "." + item.name.split(".").pop()?.toLowerCase();
        if (!CODE_EXTENSIONS.includes(ext)) continue;
        if ((item.size || 0) > maxKbPerFile * 1024) continue;

        const contentRes = await fetch(item.download_url, {
          headers: { "User-Agent": "code-companion-ai" },
        });
        if (!contentRes.ok) continue;
        const content = (await contentRes.text()).substring(
          0,
          maxKbPerFile * 1024,
        );
        const fileKb = Math.ceil(content.length / 1024);
        if (totalKb + fileKb > totalKbCap) continue;

        codeFiles.push({ path: item.path, content });
        totalKb += fileKb;
      }
    }
  }

  await walk();
  return codeFiles;
}

/**
 * Fetch PR diff context for review.
 */
export async function fetchPrDiff(
  owner: string,
  repo: string,
  prNumber: string | number,
  token: string,
): Promise<{
  pr: any;
  files: any[];
  diffContext: string;
}> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "code-companion-ai",
  };

  const prRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    { headers },
  );
  if (!prRes.ok) {
    throw new Error(`Failed to fetch PR: ${prRes.status}`);
  }
  const pr = await prRes.json();

  const filesRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=30`,
    { headers },
  );
  const files = (await filesRes.json()) as any[];

  const diffContext = files
    .map(
      (f) =>
        `--- ${f.filename} (${f.status}, +${f.additions ?? 0} -${
          f.deletions ?? 0
        }) ---\n${(f.patch ?? "").substring(0, 3000)}`,
    )
    .join("\n\n");

  return { pr, files, diffContext };
}
