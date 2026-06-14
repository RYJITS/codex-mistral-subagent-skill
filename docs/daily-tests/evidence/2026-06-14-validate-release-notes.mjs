import fs from "node:fs";
import path from "node:path";

const repoRoot = process.argv[2];
const candidatePath = process.argv[3];

if (!repoRoot || !candidatePath) {
  console.error("Usage: node 2026-06-14-validate-release-notes.mjs <repo-root> <candidate-json>");
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

const expected = readJson(
  path.join(repoRoot, "docs", "daily-tests", "evidence", "2026-06-14-release-notes-expected.json")
);
const candidate = readJson(candidatePath);

const requiredKeys = [
  "title_fr",
  "period_start",
  "period_end",
  "capability_counts",
  "summary_fr",
  "highlights_fr",
  "watchouts_fr",
  "commits",
  "evidence_files"
];

const missingKeys = requiredKeys.filter((key) => !(key in candidate));
const extraKeys = Object.keys(candidate).filter((key) => !requiredKeys.includes(key));

const summaryLength = typeof candidate.summary_fr === "string" ? candidate.summary_fr.length : -1;
const highlights = Array.isArray(candidate.highlights_fr) ? candidate.highlights_fr : [];
const watchouts = Array.isArray(candidate.watchouts_fr) ? candidate.watchouts_fr : [];

const checks = {
  missing_keys: missingKeys,
  extra_keys: extraKeys,
  period_match:
    candidate.period_start === expected.period_start &&
    candidate.period_end === expected.period_end,
  counts_match:
    JSON.stringify(candidate.capability_counts) === JSON.stringify(expected.capability_counts),
  commits_match:
    JSON.stringify(candidate.commits) === JSON.stringify(expected.commits),
  evidence_files_match:
    JSON.stringify(candidate.evidence_files) === JSON.stringify(expected.evidence_files),
  summary_length_ok: summaryLength >= 140 && summaryLength <= 220,
  highlights_count_ok: highlights.length > 0 && highlights.length <= 4,
  watchouts_count_ok: watchouts.length > 0 && watchouts.length <= 2,
  caption_failure_mentioned: watchouts.some((line) => typeof line === "string" && line.includes("4d97b5e")),
  partial_synthesis_mentioned: watchouts.some((line) => typeof line === "string" && line.includes("e2c490b")),
  highlights_hashes_ok: highlights.every(
    (line) => typeof line === "string" && expected.commits.some((hash) => line.includes(`(${hash})`))
  )
};

const valid = missingKeys.length === 0 &&
  extraKeys.length === 0 &&
  Object.values(checks).every((value) => value === true || Array.isArray(value) && value.length === 0);

const output = {
  valid,
  checks,
  title_fr: candidate.title_fr,
  summary_length: summaryLength
};

console.log(JSON.stringify(output, null, 2));
process.exit(valid ? 0 : 1);
