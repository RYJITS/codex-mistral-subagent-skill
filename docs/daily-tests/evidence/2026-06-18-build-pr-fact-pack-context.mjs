import fs from "node:fs";
import { execFileSync } from "node:child_process";

const commitHash = "0afb9c84a947ff81145bdfa25189711321ab6ea1";
const files = [
  "docs/daily-tests/2026-06-15-image-feedback-triage.md",
  "mistral-subagent/references/image-feedback-triage-fr.md",
  "mistral-subagent/SKILL.md"
];
const outputPath = "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-context.md";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

const meta = git(["show", "--no-patch", "--format=%H%n%s", commitHash]).trim();
const stat = git(["show", "--shortstat", "--format=", commitHash]).trim();
const patch = git([
  "show",
  "--unified=2",
  "--format=fuller",
  commitHash,
  "--",
  ...files
]);

const content = [
  "# Public diff context for bounded PR fact pack",
  "",
  `Commit target: ${commitHash}`,
  "",
  "## Commit metadata",
  "",
  "```text",
  meta,
  "```",
  "",
  "## Shortstat",
  "",
  "```text",
  stat,
  "```",
  "",
  "## Files intentionally included",
  "",
  ...files.map((file) => `- ${file}`),
  "",
  "## Bounded diff",
  "",
  "```diff",
  patch.trimEnd(),
  "```",
  ""
].join("\n");

fs.writeFileSync(outputPath, content, "utf8");
console.log(JSON.stringify({ output_path: outputPath, commit_hash: commitHash, files }, null, 2));
