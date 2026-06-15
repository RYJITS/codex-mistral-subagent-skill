import fs from "node:fs";
import path from "node:path";

const root = path.resolve("docs/daily-tests/evidence");

const expected = {
  lagoon_flat_depth: {
    diagnosis: "depth_pose_drift",
    facs: "AU6+AU12",
    angle: ["frontal"],
    promptTerms: [
      ["foreground"],
      ["mid-ground"],
      ["far background"],
      ["open space", "open-air", "open environment"],
      ["lagoon"],
      ["reflections", "reflection"],
      ["mineral arches", "arches"],
      ["mist horizon", "horizon"],
      ["thick wet impasto oil paint", "impasto oil paint"]
    ],
    negativeAdditionsAny: []
  },
  storm_textile_prop: {
    diagnosis: "textile_prop_drift",
    facs: "AU1+AU2+AU5",
    angle: ["three-quarter"],
    promptTerms: [
      ["foreground"],
      ["mid-ground"],
      ["far background"],
      ["wet leaves", "rain-wet leaves"],
      ["sculpted path", "path"],
      ["open glasshouse", "glasshouse"],
      ["thick wet impasto oil paint", "impasto oil paint"],
      ["no fabric logic", "seamless paint garment", "paint-built garment"]
    ],
    negativeAdditionsAny: [["umbrella"], ["stitched seams", "seams", "textile coat", "coat"]]
  },
  sun_blank_enclosure: {
    diagnosis: "expression_enclosure_drift",
    facs: "AU4+AU7+AU23",
    angle: ["frontal", "three-quarter"],
    promptTerms: [
      ["foreground"],
      ["mid-ground"],
      ["far background"],
      ["open eyes"],
      ["luminous dust", "dust"],
      ["walkways", "bridges"],
      ["pierced sky", "open sky", "sky opening"],
      ["open solar architecture", "open architecture", "solar architecture"],
      ["thick wet impasto oil paint", "impasto oil paint"]
    ],
    negativeAdditionsAny: [["enclosed ceiling", "closed interior", "sealed ceiling", "enclosed interior"]]
  }
};

const bannedPromptTerms = ["text", "watermark", "child", "male", "weapon", "paintbrush", "cgi", "cartoon"];

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node docs/daily-tests/evidence/2026-06-15-validate-image-feedback-triage.mjs <file...>");
  process.exit(1);
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function includesWholeWord(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i");
  return pattern.test(text);
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
  const byId = new Map(cases.map((item) => [item.id, item]));
  const issues = [];

  if (payload.task !== "c2r_feedback_triage") issues.push("task_incorrect");
  if (cases.length !== 3) issues.push("case_count_incorrect");

  for (const [id, rule] of Object.entries(expected)) {
    const item = byId.get(id);
    if (!item) {
      issues.push(`missing_case:${id}`);
      continue;
    }

    const prompt = normalize(item.prompt_fix_en);
    const fitNote = String(item.fit_note_fr || "");
    const diagnosis = String(item.diagnosis || "");
    const severity = String(item.severity || "");
    const keepPromptLock = item.keep_prompt_lock;
    const negativeAdditions = Array.isArray(item.negative_additions) ? item.negative_additions.map((entry) => normalize(entry)) : [];

    if (diagnosis !== rule.diagnosis) issues.push(`diagnosis_mismatch:${id}`);
    if (severity !== "high") issues.push(`severity_mismatch:${id}`);
    if (keepPromptLock !== true) issues.push(`keep_prompt_lock_false:${id}`);
    if (!fitNote.trim()) issues.push(`missing_fit_note:${id}`);
    if (negativeAdditions.length > 2) issues.push(`too_many_negative_additions:${id}`);
    if (!prompt.includes(normalize(rule.facs))) issues.push(`missing_facs:${id}`);

    for (const term of bannedPromptTerms) {
      if (includesWholeWord(prompt, term)) issues.push(`banned_prompt_term:${id}:${term}`);
    }

    for (const aliases of rule.promptTerms) {
      if (!aliases.some((term) => prompt.includes(normalize(term)))) {
        issues.push(`missing_prompt_signal:${id}:${aliases[0]}`);
      }
    }

    if (!rule.angle.some((term) => prompt.includes(normalize(term)))) {
      issues.push(`missing_angle:${id}`);
    }

    for (const aliases of rule.negativeAdditionsAny) {
      if (!negativeAdditions.some((entry) => aliases.some((term) => entry.includes(normalize(term))))) {
        issues.push(`missing_negative_addition:${id}:${aliases[0]}`);
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
