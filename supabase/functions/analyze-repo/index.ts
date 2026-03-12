import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const IGNORED_DIRS = ["node_modules", "build", "dist", ".git", ".next", "__pycache__", "vendor", ".venv"];
const CODE_EXTENSIONS = [".js", ".ts", ".tsx", ".jsx", ".py", ".java", ".html", ".css", ".go", ".rs", ".rb"];

// Recursively fetch code files from a GitHub repository
async function fetchRepoFiles(owner: string, repo: string, token: string, path = ""): Promise<{ path: string; content: string }[]> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
  });

  if (!response.ok) return [];
  const items = await response.json();
  if (!Array.isArray(items)) return [];

  const codeFiles: { path: string; content: string }[] = [];

  for (const item of items) {
    // Skip ignored directories
    if (item.type === "dir") {
      if (IGNORED_DIRS.some((dir) => item.name === dir)) continue;
      const subDirFiles = await fetchRepoFiles(owner, repo, token, item.path);
      codeFiles.push(...subDirFiles);
    } else if (item.type === "file") {
      const extension = "." + item.name.split(".").pop();
      if (!CODE_EXTENSIONS.includes(extension)) continue;
      if (item.size > 50000) continue; // skip very large files

      const contentResponse = await fetch(item.download_url);
      if (contentResponse.ok) {
        const fileContent = await contentResponse.text();
        codeFiles.push({ path: item.path, content: fileContent.substring(0, 3000) }); // limit per file
      }
    }
    // Limit total files analyzed for performance
    if (codeFiles.length >= 30) break;
  }

  return codeFiles;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = claimsData.claims.sub;

    const { repoId, analysisType = "full_review" } = await req.json();

    // Get repo and user's GitHub token
    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: repo } = await adminClient.from("repositories").select("*").eq("id", repoId).eq("user_id", userId).single();
    if (!repo) {
      return new Response(JSON.stringify({ error: "Repository not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: profile } = await adminClient.from("profiles").select("github_access_token").eq("user_id", userId).single();
    if (!profile?.github_access_token) {
      return new Response(JSON.stringify({ error: "GitHub not connected" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse owner/repo from repo_name
    const [owner, repoName] = repo.repo_name.split("/");

    // Fetch code files
    const files = await fetchRepoFiles(owner, repoName, profile.github_access_token);
    if (files.length === 0) {
      return new Response(JSON.stringify({ error: "No analyzable files found" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const codeContext = files.map((f) => `--- ${f.path} ---\n${f.content}`).join("\n\n");

    const systemPrompt = `You are a senior software engineer reviewing a GitHub repository. Analyze the following codebase and provide a detailed review.`;

    const analysisPrompts: Record<string, string> = {
      full_review: `Analyze this codebase comprehensively. Provide: code quality score (0-100), security score (0-100), performance score (0-100), architecture score (0-100), strengths, weaknesses, suggestions, refactoring ideas, and best practices.`,
      security: `Focus on security analysis. Look for: hardcoded API keys/secrets, SQL injection patterns, XSS vulnerabilities, unsafe dependencies, weak validation, authentication issues. Provide a security score (0-100) and detailed findings.`,
      performance: `Focus on performance analysis. Look for: inefficient loops, memory issues, heavy dependencies, unoptimized queries, blocking operations, bundle size issues. Provide a performance score (0-100) and optimization suggestions.`,
      architecture: `Analyze the project architecture. Detect: project structure patterns (MVC, layered, component-based), separation of concerns, code modularity, reusable modules. Provide an architecture score (0-100) and feedback.`,
    };

    const userPrompt = `${analysisPrompts[analysisType] || analysisPrompts.full_review}

Repository: ${repo.repo_name}
Language: ${repo.language || "Mixed"}
Files analyzed: ${files.length}

${codeContext}`;

    // AI integration removed. Replace with your own code review logic or connect to your preferred AI provider.
    return new Response(JSON.stringify({ message: "AI integration removed. Implement your own logic here." }), { headers: corsHeaders });
  } catch (error) {
    console.error("analyze-repo error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.stack || error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
