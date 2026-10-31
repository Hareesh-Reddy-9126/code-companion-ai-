import { Command } from "commander";
import { execSync } from "child_process";
import axios from "axios";
import ora from "ora";
import Conf from "conf";

const config = new Conf();
const program = new Command();

program
  .name("ccai")
  .description("Code Companion AI CLI")
  .version("1.0.0");

program
  .command("login")
  .description("Authenticate with Code Companion AI")
  .action(async () => {
    const apiKey = await prompt("Enter your API key: ");
    config.set("apiKey", apiKey);
    console.log("✅ Authenticated successfully");
  });

program
  .command("analyze <repo-path>")
  .description("Analyze a local repository")
  .option("--type <type>", "Analysis type: full_review, security, performance, architecture", "full_review")
  .action(async (repoPath, options) => {
    const apiKey = config.get("apiKey");
    if (!apiKey) {
      console.error("❌ Not authenticated. Run 'ccai login' first");
      process.exit(1);
    }

    const spinner = ora("Analyzing repository...").start();

    try {
      // Get git remote
      const remote = execSync(`git -C ${repoPath} remote get-url origin`, { encoding: "utf-8" }).trim();
      const ownerRepo = remote.replace("git@github.com:", "").replace("https://github.com/", "").replace(".git", "");

      const response = await axios.post(
        `${process.env.CCAI_API_URL || "https://api.codecompanion.ai"}/v1/analyze/repo`,
        { repo_name: ownerRepo, analysis_type: options.type },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      spinner.stop();
      console.log("\n📊 Analysis Complete\n");
      console.log(`Quality Score: ${response.data.quality_score}/100`);
      console.log(`Security Score: ${response.data.security_score}/100`);
      console.log(`Performance Score: ${response.data.performance_score}/100`);
      console.log(`Architecture Score: ${response.data.architecture_score}/100`);
      console.log(`\nSummary: ${response.data.summary}\n`);
    } catch (error: any) {
      spinner.stop();
      console.error("❌ Analysis failed:", error.response?.data?.error || error.message);
      process.exit(1);
    }
  });

program
  .command("pr <pr-url>")
  .description("Analyze a GitHub pull request")
  .action(async (prUrl) => {
    const apiKey = config.get("apiKey");
    if (!apiKey) {
      console.error("❌ Not authenticated. Run 'ccai login' first");
      process.exit(1);
    }

    const spinner = ora("Analyzing PR...").start();

    try {
      const response = await axios.post(
        `${process.env.CCAI_API_URL || "https://api.codecompanion.ai"}/v1/analyze/pr`,
        { pr_url: prUrl },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      spinner.stop();
      console.log("\n🔍 PR Review Complete\n");
      console.log(`Assessment: ${response.data.overall_assessment}`);
      console.log(`Summary: ${response.data.summary}\n`);
      console.log(`Comments: ${response.data.comments?.length || 0}\n`);
    } catch (error: any) {
      spinner.stop();
      console.error("❌ PR analysis failed:", error.response?.data?.error || error.message);
      process.exit(1);
    }
  });

program
  .command("fix <pr-url>")
  .description("Auto-fix issues in a pull request")
  .action(async (prUrl) => {
    const apiKey = config.get("apiKey");
    if (!apiKey) {
      console.error("❌ Not authenticated. Run 'ccai login' first");
      process.exit(1);
    }

    const spinner = ora("Dispatching autonomous agent...").start();

    try {
      const response = await axios.post(
        `${process.env.CCAI_API_URL || "https://api.codecompanion.ai"}/v1/autonomous-fix`,
        { pr_url: prUrl },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      spinner.stop();
      console.log("\n🤖 Autonomous Agent Dispatched\n");
      console.log(`Fixes found: ${response.data.fixes_found}`);
      console.log(`Fixes applied: ${response.data.fixes_applied}`);
      console.log(`Summary: ${response.data.summary}\n`);
    } catch (error: any) {
      spinner.stop();
      console.error("❌ Agent dispatch failed:", error.response?.data?.error || error.message);
      process.exit(1);
    }
  });

function prompt(message: string): Promise<string> {
  return new Promise((resolve) => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question(message, (answer: string) => {
      readline.close();
      resolve(answer);
    });
  });
}

program.parse();
