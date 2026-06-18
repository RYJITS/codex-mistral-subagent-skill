import fs from "node:fs";

const [candidatePath, expectedPath] = process.argv.slice(2);

if (!candidatePath || !expectedPath) {
  console.error(JSON.stringify({ error: "usage: node validate.mjs <candidate.json> <expected.json>" }, null, 2));
  process.exit(1);
}

const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const expected = JSON.parse(fs.readFileSync(expectedPath, "utf8"));

const failures = [];

function normalizeList(values) {
  return Array.isArray(values) ? values.map((value) => String(value).trim()) : [];
}

if (candidate.task_category !== expected.task_category) {
  failures.push(`task_category attendu ${expected.task_category}`);
}

if (candidate.project !== expected.project) {
  failures.push(`project attendu ${expected.project}`);
}

if (candidate.entrypoints?.html !== expected.entrypoints.html) {
  failures.push("entrypoints.html incorrect");
}

if (candidate.entrypoints?.stylesheet !== expected.entrypoints.stylesheet) {
  failures.push("entrypoints.stylesheet incorrect");
}

if (candidate.entrypoints?.module_script !== expected.entrypoints.module_script) {
  failures.push("entrypoints.module_script incorrect");
}

const bootSequence = normalizeList(candidate.boot_sequence);
if (bootSequence.length !== 5) {
  failures.push("boot_sequence doit contenir exactement 5 items");
}

for (const item of bootSequence) {
  if (!expected.allowed_boot_sequence.includes(item)) {
    failures.push(`boot_sequence contient un item non autorise: ${item}`);
  }
}

const lazyModules = Array.isArray(candidate.lazy_modules) ? candidate.lazy_modules : [];
if (lazyModules.length !== 2) {
  failures.push("lazy_modules doit contenir exactement 2 objets");
}

for (const moduleName of expected.required_lazy_modules) {
  const entry = lazyModules.find((item) => item?.module === moduleName);
  if (!entry) {
    failures.push(`module manquant: ${moduleName}`);
    continue;
  }

  const loadedBy = String(entry.loaded_by || "").toLowerCase();
  const trigger = String(entry.trigger || "").toLowerCase();
  const role = String(entry.role || "").toLowerCase();

  if (moduleName === "contact-scene.js") {
    if (!loadedBy.includes("ensurecontactscene")) failures.push("contact-scene.js: loaded_by doit mentionner ensureContactScene");
    if (!["idle", "scroll", "contact"].some((token) => trigger.includes(token))) failures.push("contact-scene.js: trigger doit mentionner idle, scroll ou contact");
    if (!role.includes("webgl")) failures.push("contact-scene.js: role doit mentionner WebGL");
  }

  if (moduleName === "project-registry.js") {
    if (!loadedBy.includes("bindprojectgrid") && !loadedBy.includes("grille")) failures.push("project-registry.js: loaded_by doit mentionner bindProjectGrid ou grille");
    if (!trigger.includes("grille")) failures.push("project-registry.js: trigger doit mentionner la grille projets");
    if (!role.includes("carte") && !role.includes("meta")) failures.push("project-registry.js: role doit mentionner cartes projets ou metadonnees");
  }
}

const api = normalizeList(candidate.contact_scene_api).sort();
const requiredApi = [...expected.required_contact_scene_api].sort();
if (JSON.stringify(api) !== JSON.stringify(requiredApi)) {
  failures.push("contact_scene_api incorrect");
}

const registryRole = String(candidate.registry_role || "");
if (!registryRole.toLowerCase().includes("orchestrateur")) {
  failures.push("registry_role doit mentionner l'orchestrateur");
}
if (!registryRole.includes("orchestratorProjectCards")) {
  failures.push("registry_role doit mentionner orchestratorProjectCards");
}

const summary = String(candidate.summary_fr || "");
const summaryWords = summary.trim() ? summary.trim().split(/\s+/).length : 0;
if (summaryWords < 55 || summaryWords > 110) {
  failures.push(`summary_fr hors bornes: ${summaryWords} mots`);
}
for (const keyword of expected.required_summary_keywords) {
  if (!summary.toLowerCase().includes(keyword)) {
    failures.push(`summary_fr doit mentionner une forme de: ${keyword}`);
  }
}
if (/react|next\.js|vue|angular/i.test(summary)) {
  failures.push("summary_fr invente un framework non present");
}

const result = {
  valid: failures.length === 0,
  failures,
  summary_word_count: summaryWords,
  boot_sequence: bootSequence,
  lazy_modules: lazyModules.map((item) => item?.module).filter(Boolean)
};

console.log(JSON.stringify(result, null, 2));

if (!result.valid) process.exit(1);
