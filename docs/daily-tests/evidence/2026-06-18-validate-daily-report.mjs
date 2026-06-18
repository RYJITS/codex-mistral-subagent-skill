import fs from "node:fs";

const expectedPath = process.argv[2];
const candidatePath = process.argv[3];

if (!expectedPath || !candidatePath) {
  console.error("Usage: node 2026-06-18-validate-daily-report.mjs <expected-json> <candidate-json>");
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function extractMarkdown(text) {
  if (typeof text !== "string") return "";
  const trimmed = text.replace(/^\uFEFF/, "").trim();
  const fenced = trimmed.match(/^```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)\r?\n```$/);
  return (fenced ? fenced[1] : trimmed).replace(/\r\n/g, "\n");
}

const expected = readJson(expectedPath);
const candidate = readJson(candidatePath);
const markdown = extractMarkdown(candidate.text);

const requiredHeadings = expected.required_headings.filter((heading) => markdown.includes(heading));
const missingHeadings = expected.required_headings.filter((heading) => !markdown.includes(heading));

const presentModels = expected.required_models.filter((model) => markdown.includes(model));
const missingModels = expected.required_models.filter((model) => !markdown.includes(model));

const presentCommands = expected.required_commands.filter((command) => markdown.includes(command));
const missingCommands = expected.required_commands.filter((command) => !markdown.includes(command));

const presentFiles = expected.required_files.filter((file) => markdown.includes(file));
const missingFiles = expected.required_files.filter((file) => !markdown.includes(file));

const presentSnippets = expected.required_snippets.filter((snippet) => markdown.includes(snippet));
const missingSnippets = expected.required_snippets.filter((snippet) => !markdown.includes(snippet));

const forbiddenHits = expected.forbidden_snippets.filter((snippet) => markdown.includes(snippet));

const wordCount = markdown.split(/\s+/).filter(Boolean).length;
const asciiOnly = /^[\x09\x0A\x0D\x20-\x7E]*$/.test(markdown);

const checks = {
  title_ok: markdown.startsWith(expected.title),
  status_ok: markdown.includes(expected.status),
  usage_placeholder_ok: markdown.includes(expected.usage_placeholder),
  coverage_ok: markdown.includes(expected.coverage_percent),
  headings_ok: missingHeadings.length === 0,
  models_ok: missingModels.length === 0,
  commands_ok: missingCommands.length === 0,
  files_ok: missingFiles.length === 0,
  snippets_ok: missingSnippets.length === 0,
  forbidden_ok: forbiddenHits.length === 0,
  ascii_only: asciiOnly,
  word_count_ok: wordCount >= 350 && wordCount <= 1100,
  finish_reason_ok: candidate.finish_reason === "stop",
  usage_present: Boolean(candidate.usage && Number.isFinite(candidate.usage.total_tokens))
};

const valid = Object.values(checks).every(Boolean);

console.log(JSON.stringify({
  valid,
  checks,
  word_count: wordCount,
  present_headings: requiredHeadings,
  missing_headings: missingHeadings,
  present_models: presentModels,
  missing_models: missingModels,
  present_commands: presentCommands,
  missing_commands: missingCommands,
  present_files: presentFiles,
  missing_files: missingFiles,
  present_snippets: presentSnippets,
  missing_snippets: missingSnippets,
  forbidden_hits: forbiddenHits
}, null, 2));

process.exit(valid ? 0 : 1);
