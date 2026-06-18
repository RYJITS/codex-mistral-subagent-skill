import fs from "node:fs";

const expectedPath = process.argv[2];
const candidatePath = process.argv[3];

if (!expectedPath || !candidatePath) {
  console.error("Usage: node 2026-06-18-validate-final-daily-report.mjs <expected-json> <candidate-json>");
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

const missingHeadings = expected.required_headings.filter((heading) => !markdown.includes(heading));
const missingModels = expected.required_models.filter((model) => !markdown.includes(model));
const missingCommands = expected.required_commands.filter((command) => !markdown.includes(command));
const missingTokenLines = expected.required_token_lines.filter((snippet) => !markdown.includes(snippet));
const missingFiles = expected.required_files.filter((file) => !markdown.includes(file));
const missingSnippets = expected.required_snippets.filter((snippet) => !markdown.includes(snippet));
const forbiddenHits = expected.forbidden_snippets.filter((snippet) => markdown.includes(snippet));

const wordCount = markdown.split(/\s+/).filter(Boolean).length;
const asciiOnly = /^[\x09\x0A\x0D\x20-\x7E]*$/.test(markdown);

const checks = {
  title_ok: markdown.startsWith(expected.title),
  status_ok: markdown.includes(expected.status),
  coverage_ok: markdown.includes(expected.coverage_percent),
  retry_line_ok: markdown.includes(expected.retry_line),
  headings_ok: missingHeadings.length === 0,
  models_ok: missingModels.length === 0,
  commands_ok: missingCommands.length === 0,
  token_lines_ok: missingTokenLines.length === 0,
  files_ok: missingFiles.length === 0,
  snippets_ok: missingSnippets.length === 0,
  forbidden_ok: forbiddenHits.length === 0,
  ascii_only: asciiOnly,
  word_count_ok: wordCount >= 450 && wordCount <= 1200,
  finish_reason_ok: candidate.finish_reason === "stop",
  usage_present: Boolean(candidate.usage && Number.isFinite(candidate.usage.total_tokens))
};

const valid = Object.values(checks).every(Boolean);

console.log(JSON.stringify({
  valid,
  checks,
  word_count: wordCount,
  missing_headings: missingHeadings,
  missing_models: missingModels,
  missing_commands: missingCommands,
  missing_token_lines: missingTokenLines,
  missing_files: missingFiles,
  missing_snippets: missingSnippets,
  forbidden_hits: forbiddenHits
}, null, 2));

process.exit(valid ? 0 : 1);
