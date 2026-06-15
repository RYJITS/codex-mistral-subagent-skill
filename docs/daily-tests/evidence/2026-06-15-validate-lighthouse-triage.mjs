import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeList(list) {
  return asArray(list).map((item) => String(item || ""));
}

function validateOutput(output, expected) {
  const result = {
    ok: true,
    errors: [],
    matched_action_keys: [],
    useful_token_total: 0
  };

  if (output.task_category !== expected.task_category) {
    result.ok = false;
    result.errors.push(`task_category mismatch: ${output.task_category}`);
  }

  if (output.project_name !== expected.project_name) {
    result.ok = false;
    result.errors.push(`project_name mismatch: ${output.project_name}`);
  }

  const actions = asArray(output.primary_actions);
  if (actions.length !== expected.allowed_action_keys.length) {
    result.ok = false;
    result.errors.push(`primary_actions length must be ${expected.allowed_action_keys.length}`);
  }

  const keys = actions.map((action) => action.action_key);
  const uniqueKeys = new Set(keys);
  if (uniqueKeys.size !== expected.allowed_action_keys.length) {
    result.ok = false;
    result.errors.push("primary_actions must contain 5 unique action_key values");
  }

  for (const actionKey of expected.allowed_action_keys) {
    const action = actions.find((entry) => entry.action_key === actionKey);
    if (!action) {
      result.ok = false;
      result.errors.push(`missing action_key ${actionKey}`);
      continue;
    }

    const rule = expected.actions[actionKey];
    const auditIds = normalizeList(action.audit_ids);
    const files = normalizeList(action.files);
    const scope = String(action.scope || "");

    const hasRequiredAudit = rule.required_audit_ids.some((auditId) => auditIds.includes(auditId));
    if (!hasRequiredAudit) {
      result.ok = false;
      result.errors.push(`${actionKey}: missing required audit id`);
    }

    const hasRequiredFile = rule.required_file_fragments.some((fragment) =>
      files.some((file) => file.includes(fragment))
    );
    if (!hasRequiredFile) {
      result.ok = false;
      result.errors.push(`${actionKey}: missing required file fragment`);
    }

    if (!rule.accepted_scopes.includes(scope)) {
      result.ok = false;
      result.errors.push(`${actionKey}: invalid scope ${scope}`);
    }

    if (!String(action.why_it_matters_fr || "").trim()) {
      result.ok = false;
      result.errors.push(`${actionKey}: why_it_matters_fr missing`);
    }

    if (!String(action.local_check_fr || "").trim()) {
      result.ok = false;
      result.errors.push(`${actionKey}: local_check_fr missing`);
    }

    result.matched_action_keys.push(actionKey);
  }

  const secondary = asArray(output.secondary_findings);
  if (secondary.length > 1) {
    result.ok = false;
    result.errors.push("secondary_findings must contain at most one item");
  }
  if (secondary.length === 1) {
    const item = secondary[0];
    if (item.audit_id !== expected.secondary_finding.audit_id) {
      result.ok = false;
      result.errors.push("secondary finding audit_id mismatch");
    }
    if (item.disposition !== expected.secondary_finding.accepted_disposition) {
      result.ok = false;
      result.errors.push("secondary finding disposition mismatch");
    }
    if (item.selector !== expected.secondary_finding.selector) {
      result.ok = false;
      result.errors.push("secondary finding selector mismatch");
    }
  }

  const inventedItems = asArray(output.invented_items);
  if (inventedItems.length > 0) {
    result.ok = false;
    result.errors.push("invented_items must be empty");
  }

  const usage = output._usage || {};
  if (Number.isFinite(usage.total_tokens) && result.ok) {
    result.useful_token_total = usage.total_tokens;
  }

  return result;
}

const [, , expectedArg, ...outputArgs] = process.argv;
if (!expectedArg || outputArgs.length === 0) {
  console.error("Usage: node 2026-06-15-validate-lighthouse-triage.mjs <expected.json> <model-output.json>...");
  process.exit(1);
}

const expected = readJson(path.resolve(expectedArg));
const summary = {
  ok: true,
  files: [],
  useful_token_total: 0
};

for (const outputArg of outputArgs) {
  const fullPath = path.resolve(outputArg);
  const raw = readJson(fullPath);
  const usage = raw.usage || {};
  const content = raw.text || raw.content || raw.result || raw;
  const output = typeof content === "string" ? JSON.parse(content) : content;
  output._usage = usage;
  const validation = validateOutput(output, expected);
  summary.files.push({
    file: path.basename(fullPath),
    ok: validation.ok,
    matched_action_keys: validation.matched_action_keys,
    errors: validation.errors,
    total_tokens: usage.total_tokens ?? null
  });
  if (!validation.ok) {
    summary.ok = false;
  } else {
    summary.useful_token_total += validation.useful_token_total;
  }
}

console.log(JSON.stringify(summary, null, 2));
