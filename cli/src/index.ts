#!/usr/bin/env node
import { Command } from "commander";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";

interface Config {
  supabaseUrl: string;
  anonKey: string;
  refreshToken: string;
  email?: string;
}

const CONFIG_DIR = path.join(os.homedir(), ".code-companion");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

function loadConfig(): Config | null {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")) as Config;
  } catch {
    return null;
  }
}

function saveConfig(config: Config) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (char: string) => {
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode?.(wasRaw ?? false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (char === "\u0003") {
        process.stdout.write("\n");
        process.exit(1);
      } else if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function authenticate(config: Config): Promise<string> {
  const res = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: config.anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: config.refreshToken }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(
      `Session expired. Run "ccai login" again. (${data.error_description || data.msg || res.status})`,
    );
  }
  if (data.refresh_token && data.refresh_token !== config.refreshToken) {
    config.refreshToken = data.refresh_token;
    saveConfig(config);
  }
  return data.access_token;
}

async function invoke(config: Config, fn: string, body: unknown) {
  const token = await authenticate(config);
  const res = await fetch(`${config.supabaseUrl}/functions/v1/${fn}`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

function requireConfig(): Config {
  const config = loadConfig();
  if (!config) {
    console.error("Not logged in. Run: ccai login");
    process.exit(1);
  }
  return config;
}

const program = new Command();
program.name("ccai").description("Code Companion AI CLI").version("1.0.0");

program
  .command("login")
  .description("Sign in with your Code Companion account")
  .action(async () => {
    const supabaseUrl = await prompt(
      "Supabase URL [https://gcszjbtdofquemrbumvg.supabase.co]: ",
    );
    const anonKey = await prompt("Supabase publishable key: ");
    const email = await prompt("Email: ");
    const password = await promptHidden("Password: ");
    if (!anonKey || !email || !password) {
      console.error("All fields are required.");
      process.exit(1);
    }
    const url = (supabaseUrl || "https://gcszjbtdofquemrbumvg.supabase.co").replace(
      /\/$/,
      "",
    );
    const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.refresh_token) {
      console.error(`Login failed: ${data.error_description || data.msg || res.status}`);
      process.exit(1);
    }
    saveConfig({ supabaseUrl: url, anonKey, refreshToken: data.refresh_token, email });
    console.log(`Signed in as ${email}`);
  });

program
  .command("logout")
  .description("Remove stored credentials")
  .action(() => {
    fs.rmSync(CONFIG_FILE, { force: true });
    console.log("Signed out.");
  });

program
  .command("whoami")
  .description("Show the signed-in account")
  .action(() => {
    const config = requireConfig();
    console.log(config.email || "unknown");
  });

program
  .command("analyze <repoId>")
  .description("Run a full AI analysis for a connected repository")
  .option("--type <type>", "full_review | security | performance | architecture", "full_review")
  .action(async (repoId, options) => {
    const config = requireConfig();
    console.log("Analyzing repository...");
    const data = await invoke(config, "analyze-repo", {
      repoId,
      analysisType: options.type,
    });
    const a = data.analysis;
    console.log(`\nQuality:       ${a.quality_score}/100`);
    console.log(`Security:      ${a.security_score}/100`);
    console.log(`Performance:   ${a.performance_score}/100`);
    console.log(`Architecture:  ${a.architecture_score}/100`);
    console.log(`Model:         ${data.model}`);
    console.log(`\n${a.summary}\n`);
  });

program
  .command("pr <prUrl>")
  .description("Review a GitHub pull request")
  .action(async (prUrl) => {
    const config = requireConfig();
    console.log("Reviewing pull request...");
    const data = await invoke(config, "analyze-pr", { prUrl });
    const report = data.analysis || data;
    console.log(`\nAssessment: ${report.overall_assessment || "comment"}`);
    console.log(`Summary: ${report.summary || ""}\n`);
  });

program
  .command("fix <repoId> <prNumber>")
  .description("Dispatch the autonomous agent on a pull request")
  .action(async (repoId, prNumber) => {
    const config = requireConfig();
    console.log("Dispatching autonomous agent...");
    const data = await invoke(config, "autonomous-fix", {
      repo_id: repoId,
      pr_number: Number(prNumber),
    });
    console.log(`\nIssues found:  ${data.fixes_found}`);
    console.log(`Fixes posted:  ${data.fixes_applied}`);
    console.log(`Summary:       ${data.summary || ""}\n`);
  });

program.parseAsync().catch((err) => {
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
