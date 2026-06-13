import fs from "node:fs";

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/'/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toWords(value) {
  const normalized = normalizeText(value);
  return normalized ? normalized.split(" ") : [];
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function parseModelCaptions(path) {
  const outer = readJson(path);
  const inner = typeof outer.text === "string" ? JSON.parse(outer.text) : outer.text;
  const captions = Array.isArray(inner?.captions) ? inner.captions : [];
  return {
    model: outer.model || "unknown",
    usage: outer.usage || null,
    task_category: inner?.task_category || null,
    captions,
    quality_notes_fr: Array.isArray(inner?.quality_notes_fr) ? inner.quality_notes_fr : []
  };
}

const [, , modelOutputPath, summaryOutputPath] = process.argv;

if (!modelOutputPath || !summaryOutputPath) {
  console.error("Usage: node 2026-06-13-validate-caption-segmentation.mjs <model-output.json> <summary-output.json>");
  process.exit(1);
}

const oraclePath = "D:/00_Cerveau_IA/Conpetances/Mantage video/Remotion/jobs/job-site-presentation-30s-v4-tiktok-captions.json";
const oracle = readJson(oraclePath);
const expectedCaptions = Array.isArray(oracle.captions) ? oracle.captions.map((item, index) => ({
  index: index + 1,
  text: item.text,
  normalized: normalizeText(item.text),
  words: toWords(item.text)
})) : [];

const result = parseModelCaptions(modelOutputPath);
const actualCaptions = result.captions.map((item, index) => ({
  index: Number(item?.index ?? index + 1),
  text: String(item?.text || ""),
  normalized: normalizeText(item?.text || ""),
  words: toWords(item?.text || "")
}));

const perCaption = expectedCaptions.map((expected, index) => {
  const actual = actualCaptions[index] || { index: index + 1, text: "", normalized: "" };
  return {
    index: expected.index,
    expected: expected.text,
    actual: actual.text,
    exact_match: expected.normalized === actual.normalized
  };
});

const expectedConcat = normalizeText(expectedCaptions.map((item) => item.text).join(" "));
const actualConcat = normalizeText(actualCaptions.map((item) => item.text).join(" "));
const exactMatches = perCaption.filter((item) => item.exact_match).length;
const countMatch = actualCaptions.length === expectedCaptions.length;
const sequenceMatch = expectedConcat === actualConcat;
const lengthChecks = actualCaptions.map((item) => ({
  index: item.index,
  length: item.text.length,
  within_readable_range: item.text.length >= 20 && item.text.length <= 90
}));
const lengthPassCount = lengthChecks.filter((item) => item.within_readable_range).length;

function boundaryPositions(captions) {
  const boundaries = [];
  let total = 0;
  for (let i = 0; i < captions.length - 1; i += 1) {
    total += captions[i].words.length;
    boundaries.push(total);
  }
  return boundaries;
}

const expectedBoundaries = boundaryPositions(expectedCaptions);
const actualBoundaries = boundaryPositions(actualCaptions);
const matchingBoundaries = actualBoundaries.filter((item, index) => item === expectedBoundaries[index]).length;

let verdict = "Non valide";
if (countMatch && sequenceMatch && exactMatches === expectedCaptions.length && lengthPassCount === actualCaptions.length) {
  verdict = "Valide";
} else if (countMatch && sequenceMatch && matchingBoundaries >= 2) {
  verdict = "Partiellement valide";
}

const summary = {
  verdict,
  model: result.model,
  task_category: result.task_category,
  expected_caption_count: expectedCaptions.length,
  actual_caption_count: actualCaptions.length,
  count_match: countMatch,
  transcript_sequence_match: sequenceMatch,
  exact_caption_matches: exactMatches,
  matching_boundaries: matchingBoundaries,
  expected_boundaries: expectedBoundaries,
  actual_boundaries: actualBoundaries,
  readable_caption_lengths: lengthChecks,
  readable_length_pass_count: lengthPassCount,
  per_caption: perCaption,
  usage: result.usage,
  quality_notes_fr: result.quality_notes_fr
};

fs.writeFileSync(summaryOutputPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
