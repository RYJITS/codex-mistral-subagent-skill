import fs from "node:fs";
import path from "node:path";

function fail(message) {
  throw new Error(message);
}

function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

function parseMaybeWrappedJson(filePath) {
  const raw = stripBom(fs.readFileSync(filePath, "utf8"));
  const parsed = JSON.parse(raw);
  if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
    return { wrapper: parsed, payload: JSON.parse(parsed.text) };
  }
  return { wrapper: null, payload: parsed };
}

function ensureShortFrenchNote(value, jobId) {
  if (typeof value !== "string" || !value.trim()) fail(`missing_fit_note_fr:${jobId}`);
  if (value.length > 180) fail(`fit_note_too_long:${jobId}`);
}

function validatePayload(payload, expected) {
  if (payload.task !== expected.task) fail(`unexpected_task:${payload.task}`);
  if (payload.version_id !== expected.version_id) fail(`unexpected_version:${payload.version_id}`);
  if (!Array.isArray(payload.queue)) fail("queue_not_array");
  if (payload.queue.length !== expected.queue.length) fail(`unexpected_queue_length:${payload.queue.length}`);

  const seenRanks = new Set();

  expected.queue.forEach((expectedItem, index) => {
    const item = payload.queue[index];
    if (!item || typeof item !== "object") fail(`missing_item_at_index:${index}`);
    if (item.job_id !== expectedItem.job_id) fail(`unexpected_job_id:${index}:${item.job_id}`);
    if (item.priority_rank !== expectedItem.priority_rank) fail(`unexpected_rank:${item.job_id}:${item.priority_rank}`);
    if (seenRanks.has(item.priority_rank)) fail(`duplicate_rank:${item.priority_rank}`);
    seenRanks.add(item.priority_rank);
    if (item.priority_bucket !== expectedItem.priority_bucket) fail(`unexpected_bucket:${item.job_id}:${item.priority_bucket}`);
    if (item.reason_key !== expectedItem.reason_key) fail(`unexpected_reason:${item.job_id}:${item.reason_key}`);
    if (item.preserve_candidate !== expectedItem.preserve_candidate) fail(`unexpected_preserve:${item.job_id}:${item.preserve_candidate}`);
    if (typeof item.prompt_focus_en !== "string" || !item.prompt_focus_en.trim()) fail(`missing_prompt_focus:${item.job_id}`);

    const focus = item.prompt_focus_en.toLowerCase();
    expectedItem.required_prompt_signals.forEach((signal) => {
      if (!focus.includes(signal.toLowerCase())) fail(`missing_prompt_signal:${item.job_id}:${signal}`);
    });

    ensureShortFrenchNote(item.fit_note_fr, item.job_id);
  });
}

function buildSummary(filePath, wrapper, status, issues) {
  return {
    file: path.basename(filePath),
    model: wrapper?.model || "plain-json",
    finish_reason: wrapper?.finish_reason || "n/a",
    prompt_tokens: wrapper?.usage?.prompt_tokens ?? 0,
    completion_tokens: wrapper?.usage?.completion_tokens ?? 0,
    total_tokens: wrapper?.usage?.total_tokens ?? 0,
    status,
    issues
  };
}

const expectedPath = new URL("./2026-06-18-c2r-feedback-queue-prioritization-expected.json", import.meta.url);
const expected = JSON.parse(fs.readFileSync(expectedPath, "utf8"));
const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node 2026-06-18-validate-c2r-feedback-queue-prioritization.mjs <result.json> [...]");
  process.exit(1);
}

const summaries = files.map((filePath) => {
  try {
    const { wrapper, payload } = parseMaybeWrappedJson(filePath);
    validatePayload(payload, expected);
    return buildSummary(filePath, wrapper, "valide", []);
  } catch (error) {
    const wrapper = (() => {
      try {
        const raw = JSON.parse(stripBom(fs.readFileSync(filePath, "utf8")));
        return raw && typeof raw === "object" ? raw : null;
      } catch {
        return null;
      }
    })();
    return buildSummary(filePath, wrapper, "non_valide", [error.message]);
  }
});

console.log(JSON.stringify(summaries, null, 2));
