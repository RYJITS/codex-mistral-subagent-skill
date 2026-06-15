import fs from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseCandidate(filePath) {
  const outer = readJson(filePath);
  if (!outer || typeof outer !== "object") {
    fail(`Outer JSON invalid for ${filePath}`);
  }
  const usage = outer.usage ?? {};
  let inner = outer.text;
  if (typeof inner !== "string") {
    fail(`Missing text payload in ${filePath}`);
  }
  inner = JSON.parse(inner);
  return { outer, inner, usage };
}

const [, , repoRoot, candidatePath] = process.argv;

if (!repoRoot || !candidatePath) {
  fail("Usage: node 2026-06-15-validate-pr-comment.mjs <repoRoot> <candidateJson>");
}

const expectedPath = path.join(
  repoRoot,
  "docs",
  "daily-tests",
  "evidence",
  "2026-06-15-pr-comment-expected.json",
);

const expected = readJson(expectedPath);
const { outer, inner, usage } = parseCandidate(candidatePath);

const checks = [];
const warnings = [];
const errors = [];

if (inner.task_category !== expected.task_category) {
  errors.push(`task_category mismatch: ${inner.task_category}`);
} else {
  checks.push("task_category exact");
}

if (typeof inner.comment_title_fr !== "string" || inner.comment_title_fr.length < 20) {
  errors.push("comment_title_fr too short or missing");
} else {
  checks.push("comment_title_fr present");
}

if (typeof inner.comment_body_fr !== "string") {
  errors.push("comment_body_fr missing");
} else {
  const bodyLength = inner.comment_body_fr.length;
  if (bodyLength < 260 || bodyLength > 520) {
    errors.push(`comment_body_fr length out of range: ${bodyLength}`);
  } else {
    checks.push(`comment_body_fr length ok: ${bodyLength}`);
  }
  for (const keyword of expected.required_comment_keywords) {
    if (!inner.comment_body_fr.includes(keyword)) {
      errors.push(`comment_body_fr missing keyword: ${keyword}`);
    }
  }
  if (inner.comment_body_fr.includes("```")) {
    errors.push("comment_body_fr must not contain code fences");
  }
}

if (!Array.isArray(inner.highlights_fr) || inner.highlights_fr.length !== 3) {
  errors.push("highlights_fr must contain exactly 3 items");
} else {
  checks.push("highlights_fr count exact");
}

if (!Array.isArray(inner.key_files) || inner.key_files.length !== 3) {
  errors.push("key_files must contain exactly 3 items");
} else {
  const invalidFiles = inner.key_files.filter(
    (file) => !expected.allowed_key_files.includes(file),
  );
  if (invalidFiles.length > 0) {
    errors.push(`key_files contain invalid entries: ${invalidFiles.join(", ")}`);
  } else {
    checks.push("key_files subset valid");
  }
}

if (JSON.stringify(inner.models_tested) !== JSON.stringify(expected.required_models_tested)) {
  errors.push("models_tested mismatch");
} else {
  checks.push("models_tested exact and ordered");
}

if (inner.retained_model !== expected.retained_model) {
  errors.push(`retained_model mismatch: ${inner.retained_model}`);
} else {
  checks.push("retained_model exact");
}

if (
  JSON.stringify(inner.validation_commands) !==
  JSON.stringify(expected.validation_commands)
) {
  errors.push("validation_commands mismatch");
} else {
  checks.push("validation_commands exact");
}

if (!Array.isArray(inner.invented_items)) {
  errors.push("invented_items must be an array");
} else if (inner.invented_items.length !== 0) {
  errors.push("invented_items must stay empty");
} else {
  checks.push("invented_items empty");
}

const textPool = JSON.stringify(inner);
for (const forbidden of expected.forbidden_terms) {
  if (textPool.includes(forbidden)) {
    errors.push(`forbidden term found: ${forbidden}`);
  }
}

if (typeof usage.total_tokens !== "number") {
  warnings.push("usage.total_tokens missing");
}

const summary = {
  file: path.basename(candidatePath),
  model: outer.model ?? null,
  finish_reason: outer.finish_reason ?? null,
  total_tokens: usage.total_tokens ?? null,
  valid: errors.length === 0,
  checks,
  warnings,
  errors,
};

console.log(JSON.stringify(summary, null, 2));

if (errors.length > 0) {
  process.exit(1);
}
