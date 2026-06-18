import fs from "node:fs";

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function parseOuter(filePath) {
  const outer = readJson(filePath);
  const inner = JSON.parse(outer.text);
  return {
    model: outer.model,
    file_path: filePath,
    usage: outer.usage,
    finish_reason: outer.finish_reason,
    microcopy: inner
  };
}

function validateOne(result) {
  const errors = [];
  const { microcopy } = result;
  const keys = Object.keys(microcopy);
  if (JSON.stringify(keys.sort()) !== JSON.stringify(["scope_label_fr", "summary_fr"])) {
    errors.push("unexpected keys");
  }
  if (typeof microcopy.scope_label_fr !== "string" || microcopy.scope_label_fr.trim().split(/\s+/).length < 4) {
    errors.push("scope_label_fr too short");
  }
  if (typeof microcopy.summary_fr !== "string" || microcopy.summary_fr.length > 160) {
    errors.push("summary_fr invalid length");
  }
  if (typeof microcopy.summary_fr !== "string" || !microcopy.summary_fr.includes("C2R") || !/prompt/i.test(microcopy.summary_fr)) {
    errors.push("summary_fr missing required terms");
  }
  return {
    ...result,
    valid: errors.length === 0,
    errors
  };
}

const outputPaths = process.argv.slice(2);
if (outputPaths.length === 0) {
  throw new Error("Usage: node 2026-06-18-validate-pr-microcopy.mjs <model-output.json>...");
}

const results = outputPaths.map((filePath) => validateOne(parseOuter(filePath)));
const summary = {
  valid_count: results.filter((result) => result.valid).length,
  invalid_count: results.filter((result) => !result.valid).length,
  results
};

const outputPath = "docs/daily-tests/evidence/2026-06-18-pr-microcopy-validation-summary.json";
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
