import fs from "node:fs";
import path from "node:path";

const root = path.resolve("docs/daily-tests/evidence");

const expected = {
  lagoon_reflection: {
    facs: "AU6+AU12",
    palette: [["cuivre", "copper"], ["turquoise"], ["ivoire", "ivory"]],
    depth: [["reflets", "reflection", "reflections"], ["arches"], ["horizon"]],
    angle: ["frontal"],
    blockedSpecific: ["city", "cityscape", "urban skyline", "object in hand"]
  },
  storm_garden: {
    facs: "AU1+AU2+AU5",
    palette: [["jade"], ["petrole", "petroleum"], ["argent", "silver"]],
    depth: [["feuilles", "leaves"], ["allee", "alley", "path"], ["verriere", "glasshouse"]],
    angle: ["three-quarter"],
    blockedSpecific: ["umbrella", "coat", "textile coat"]
  },
  sun_architecture: {
    facs: "AU4+AU7+AU23",
    palette: [["ambre", "amber"], ["craie", "chalk"], ["bleu", "blue"]],
    depth: [["poussiere", "dust"], ["passerelles", "walkways"], ["ciel", "sky"]],
    angle: ["frontal", "three-quarter"],
    blockedSpecific: ["closed interior", "enclosed interior", "wall pose"]
  }
};

const bannedPromptTerms = ["text", "watermark", "child", "male", "wall", "weapon", "paintbrush", "cgi", "cartoon"];
const requiredPromptTerms = ["impasto", "paint", "foreground", "mid-ground", "background"];

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node docs/daily-tests/evidence/2026-06-14-validate-image-prompt-lock.mjs <file...>");
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
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const payload = JSON.parse(raw.text);
  return { raw, payload };
}

const summary = [];

for (const file of files) {
  const absolute = path.resolve(file);
  const { raw, payload } = parseResponse(absolute);
  const variants = Array.isArray(payload.variants) ? payload.variants : [];
  const byId = new Map(variants.map((variant) => [variant.id, variant]));

  let issues = [];

  if (payload.task !== "c2r_prompt_pack") issues.push("task_incorrect");
  if (variants.length !== 3) issues.push("variant_count_incorrect");

  for (const [id, rule] of Object.entries(expected)) {
    const variant = byId.get(id);
    if (!variant) {
      issues.push(`missing_variant:${id}`);
      continue;
    }

    const prompt = normalize(variant.prompt_variable);
    const fitNote = String(variant.fit_note_fr || "");
    const negativeAdditions = Array.isArray(variant.negative_additions) ? variant.negative_additions.map(String) : [];
    const riskFlags = Array.isArray(variant.risk_flags) ? variant.risk_flags.map(String) : [];
    const palette = Array.isArray(variant.palette) ? variant.palette.map((entry) => normalize(entry)) : [];
    const depth = Array.isArray(variant.depth_cues) ? variant.depth_cues.map((entry) => normalize(entry)) : [];

    if (String(variant.facs_code || "") !== rule.facs) issues.push(`facs_mismatch:${id}`);
    if (!fitNote.trim()) issues.push(`missing_fit_note:${id}`);
    if (palette.length !== 3) issues.push(`palette_count:${id}`);
    if (depth.length !== 3) issues.push(`depth_count:${id}`);

    for (const term of requiredPromptTerms) {
      if (!prompt.includes(term)) issues.push(`missing_prompt_term:${id}:${term}`);
    }

    for (const term of bannedPromptTerms) {
      if (includesWholeWord(prompt, term)) issues.push(`banned_prompt_term:${id}:${term}`);
    }

    if (!prompt.includes(normalize(rule.facs))) issues.push(`missing_facs_in_prompt:${id}`);
    if (!rule.palette.every((aliases) => aliases.some((term) => prompt.includes(normalize(term))))) issues.push(`palette_missing_in_prompt:${id}`);
    if (!rule.depth.every((aliases) => aliases.some((term) => prompt.includes(normalize(term))))) issues.push(`depth_missing_in_prompt:${id}`);
    if (!rule.angle.some((term) => prompt.includes(normalize(term)))) issues.push(`angle_missing_in_prompt:${id}`);

    if (negativeAdditions.length > 4) issues.push(`too_many_negative_additions:${id}`);
    if (!Array.isArray(variant.risk_flags)) issues.push(`risk_flags_not_array:${id}`);
    if (!Array.isArray(variant.negative_additions)) issues.push(`negative_additions_not_array:${id}`);

    for (const blocked of rule.blockedSpecific) {
      if (prompt.includes(normalize(blocked))) issues.push(`blocked_specific_in_prompt:${id}:${blocked}`);
    }

    if (riskFlags.some((item) => typeof item !== "string")) issues.push(`risk_flag_type:${id}`);
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
