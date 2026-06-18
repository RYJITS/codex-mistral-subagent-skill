import fs from "node:fs";

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function parseModelOutput(filePath) {
  const outer = readJson(filePath);
  const inner = JSON.parse(outer.text);
  return {
    file_path: filePath,
    model: outer.model,
    usage: outer.usage,
    finish_reason: outer.finish_reason,
    fact_pack: inner
  };
}

function arraysEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateOne(result, expected) {
  const errors = [];
  const pack = result.fact_pack;
  if (pack.task_type !== expected.task_type) errors.push("task_type mismatch");
  if (pack.commit_hash !== expected.commit_hash) errors.push("commit_hash mismatch");
  if (pack.status_label !== expected.status_label) errors.push("status_label mismatch");
  if (pack.user_project !== expected.user_project) errors.push("user_project mismatch");
  if (!Array.isArray(pack.fact_codes) || !arraysEqual(pack.fact_codes, expected.fact_codes)) {
    errors.push("fact_codes mismatch");
  }
  if (!Array.isArray(pack.key_files) || !arraysEqual(pack.key_files, expected.key_files)) {
    errors.push("key_files mismatch");
  }
  if (!Array.isArray(pack.validation_commands) || !arraysEqual(pack.validation_commands, expected.validation_commands)) {
    errors.push("validation_commands mismatch");
  }
  if (pack.retained_model !== expected.retained_model) errors.push("retained_model mismatch");
  if (!Array.isArray(pack.invented_items) || pack.invented_items.length !== 0) {
    errors.push("invented_items must be an empty array");
  }
  const allowedKeys = [
    "task_type",
    "commit_hash",
    "status_label",
    "user_project",
    "scope_label_fr",
    "summary_fr",
    "fact_codes",
    "key_files",
    "validation_commands",
    "retained_model",
    "invented_items"
  ];
  const extraKeys = Object.keys(pack).filter((key) => !allowedKeys.includes(key));
  if (extraKeys.length > 0) errors.push(`extra keys: ${extraKeys.join(",")}`);
  if (typeof pack.scope_label_fr !== "string" || pack.scope_label_fr.trim().split(/\s+/).length < 4) {
    errors.push("scope_label_fr too short");
  }
  if (typeof pack.summary_fr !== "string" || !pack.summary_fr.includes("C2R") || !/prompt/i.test(pack.summary_fr)) {
    errors.push("summary_fr missing required terms");
  }
  return {
    model: result.model,
    file_path: result.file_path,
    usage: result.usage,
    finish_reason: result.finish_reason,
    valid: errors.length === 0,
    errors,
    fact_pack: pack
  };
}

const expectedPath = process.argv[2];
const outputPaths = process.argv.slice(3);

if (!expectedPath || outputPaths.length === 0) {
  throw new Error("Usage: node 2026-06-18-validate-pr-fact-pack.mjs <expected.json> <model-output.json>...");
}

const expected = readJson(expectedPath);
const results = outputPaths.map((filePath) => validateOne(parseModelOutput(filePath), expected));
const validCount = results.filter((result) => result.valid).length;
const summary = {
  expected,
  valid_count: validCount,
  invalid_count: results.length - validCount,
  results
};

const outputPath = "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-validation-summary.json";
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
