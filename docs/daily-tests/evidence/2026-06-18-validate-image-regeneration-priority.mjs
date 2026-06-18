import fs from "node:fs";
import path from "node:path";

const root = path.resolve("docs/daily-tests/evidence");

const expectedOrder = [
  "cliff_anatomy_crop",
  "lagoon_flat_depth",
  "storm_textile_prop",
  "sun_control_candidate"
];

const expected = {
  cliff_anatomy_crop: {
    rank: 1,
    priority_bucket: "p0_immediate_regen",
    next_action: "regenerate_now",
    keep_for_reference: false,
    promptTerms: [
      "AU2+AU5+AU25",
      "frontal or three-quarter",
      "visible open eyes",
      "separated fingers",
      "readable feet and toes",
      "sea spray foreground",
      "sculpted cliffs mid-ground",
      "open sky far background",
      "thick wet impasto oil paint garment"
    ]
  },
  lagoon_flat_depth: {
    rank: 2,
    priority_bucket: "p0_immediate_regen",
    next_action: "regenerate_now",
    keep_for_reference: false,
    promptTerms: [
      "AU6+AU12",
      "frontal",
      "open space",
      "lagoon reflections foreground",
      "mineral arches mid-ground",
      "mist horizon far background",
      "thick wet impasto oil paint garment"
    ]
  },
  storm_textile_prop: {
    rank: 3,
    priority_bucket: "p1_prompt_fix_then_regen",
    next_action: "edit_prompt_then_regenerate",
    keep_for_reference: false,
    promptTerms: [
      "AU1+AU2+AU5",
      "three-quarter",
      "wet leaves foreground",
      "sculpted path mid-ground",
      "open glasshouse far background",
      "thick wet impasto oil paint garment",
      "no fabric logic",
      "no umbrella"
    ]
  },
  sun_control_candidate: {
    rank: 4,
    priority_bucket: "p2_hold_control",
    next_action: "keep_as_control",
    keep_for_reference: true,
    promptExact: "keep current prompt as control reference"
  }
};

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node docs/daily-tests/evidence/2026-06-18-validate-image-regeneration-priority.mjs <file...>");
  process.exit(1);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseResponse(file) {
  const rawText = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const raw = JSON.parse(rawText);
  const payload = JSON.parse(raw.text);
  return { raw, payload };
}

const summary = [];

for (const file of files) {
  const absolute = path.resolve(file);
  const { raw, payload } = parseResponse(absolute);
  const cases = Array.isArray(payload.cases) ? payload.cases : [];
  const issues = [];

  if (payload.task !== "c2r_regeneration_priority_triage") issues.push("task_incorrect");
  if (payload.batch_id !== "c2r-batch-regen-2026-06-18") issues.push("batch_id_incorrect");
  if (cases.length !== 4) issues.push("case_count_incorrect");

  const ids = cases.map((item) => item.id);
  if (JSON.stringify(ids) !== JSON.stringify(expectedOrder)) {
    issues.push(`unexpected_order:${ids.join(",")}`);
  }

  for (const item of cases) {
    const rule = expected[item.id];
    if (!rule) {
      issues.push(`unexpected_case:${item.id}`);
      continue;
    }

    if (item.rank !== rule.rank) issues.push(`rank_mismatch:${item.id}`);
    if (item.priority_bucket !== rule.priority_bucket) issues.push(`bucket_mismatch:${item.id}`);
    if (item.next_action !== rule.next_action) issues.push(`next_action_mismatch:${item.id}`);
    if (item.keep_for_reference !== rule.keep_for_reference) issues.push(`keep_for_reference_mismatch:${item.id}`);

    const reason = normalizeText(item.reason_fr);
    if (reason.length < 12) {
      issues.push(`reason_too_short:${item.id}`);
    }

    const promptAction = String(item.prompt_action_en || "");
    if (rule.promptExact) {
      if (promptAction !== rule.promptExact) {
        issues.push(`prompt_exact_mismatch:${item.id}`);
      }
    } else {
      for (const term of rule.promptTerms) {
        if (!promptAction.includes(term)) {
          issues.push(`missing_prompt_term:${item.id}:${term}`);
        }
      }
    }
  }

  summary.push({
    file: path.relative(root, absolute).replace(/\\/g, "/"),
    model: raw.model,
    finish_reason: raw.finish_reason,
    prompt_tokens: raw.usage?.prompt_tokens ?? null,
    completion_tokens: raw.usage?.completion_tokens ?? null,
    total_tokens: raw.usage?.total_tokens ?? null,
    status: issues.length === 0 ? "valide" : "non_valide",
    issues
  });
}

console.log(JSON.stringify(summary, null, 2));
