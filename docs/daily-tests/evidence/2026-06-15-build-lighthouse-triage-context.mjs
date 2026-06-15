import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const projectRoot = "D:\\00_Cerveau_IA\\Projet\\01_SITE_MA_METHODE";
const evidenceDir = path.join(repoRoot, "docs", "daily-tests", "evidence");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readAuditSummary(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return raw.replace(/\r/g, "");
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${bytes} B`;
}

function topItems(items, count = 3) {
  return (items || []).slice(0, count);
}

const desktop = readJson(path.join(projectRoot, "output", "lighthouse-desktop.json"));
const mobile = readJson(path.join(projectRoot, "output", "lighthouse-mobile.json"));
const auditDoc = readAuditSummary(path.join(projectRoot, "AUDIT_OPTIMISATIONS_20260614.md"));

const desktopTotal = desktop.audits["total-byte-weight"];
const mobileTotal = mobile.audits["total-byte-weight"];
const desktopRender = desktop.audits["render-blocking-insight"];
const mobileRender = mobile.audits["render-blocking-insight"];
const desktopCss = desktop.audits["unminified-css"];
const mobileCss = mobile.audits["unminified-css"];
const desktopJs = desktop.audits["unminified-javascript"];
const mobileJs = mobile.audits["unminified-javascript"];
const desktopUnusedCss = desktop.audits["unused-css-rules"];
const mobileUnusedCss = mobile.audits["unused-css-rules"];
const desktopUnusedJs = desktop.audits["unused-javascript"];
const mobileUnusedJs = mobile.audits["unused-javascript"];
const mobileMainthread = mobile.audits["mainthread-work-breakdown"];
const desktopVideoCaption = desktop.audits["video-caption"];
const mobileVideoCaption = mobile.audits["video-caption"];

const contextLines = [
  "# Contexte borne - triage Lighthouse multi-support",
  "",
  "Projet reel: `01_SITE_MA_METHODE`",
  "Type: site WebGL/video scroll-driven public, optimise pour garder le rendu cinematic sans casser la narration.",
  "",
  "## Pourquoi cette tache compte",
  "- Sur ce projet, les arbitrages de perf et d'accessibilite reviennent souvent apres des changements visuels.",
  "- Codex a besoin d'une premiere passe Mistral qui transforme des audits Lighthouse bruts en plan d'action priorise et verifiable.",
  "- Le plan ne doit pas inventer de fichiers, de scripts, ni de priorites hors contexte.",
  "",
  "## Metriques globales avant passe d'optimisation locale",
  `- Mobile: performance 70, accessibilite 100, SEO 90, LCP 16.2 s, payload ${formatBytes(mobileTotal.numericValue)}.`,
  `- Desktop: performance 85, accessibilite 100, SEO 90, LCP 2.8 s, payload ${formatBytes(desktopTotal.numericValue)}.`,
  "",
  "## Contraintes produit",
  "- Ne pas casser le fond video cinematic, les masques, ni la narration scroll/video.",
  "- Ne pas supprimer les effets WebGL/contact, seulement optimiser chargement, texture et pause intelligente.",
  "- Prioriser les actions qui reduisent le poids ou le chemin critique sans casser l'apparence.",
  "",
  "## Findings Lighthouse utiles",
  "",
  "### total-byte-weight",
  `- Desktop total: ${formatBytes(desktopTotal.numericValue)}.`,
  ...topItems(desktopTotal.details.items).map((item) => `- Desktop asset: \`${item.url}\` -> ${formatBytes(item.totalBytes)}.`),
  `- Mobile total: ${formatBytes(mobileTotal.numericValue)}.`,
  ...topItems(mobileTotal.details.items).map((item) => `- Mobile asset: \`${item.url}\` -> ${formatBytes(item.totalBytes)}.`),
  "",
  "### render-blocking-insight",
  ...desktopRender.details.items.map((item) => `- Desktop render blocking: \`${item.url}\` -> ${Math.round(item.wastedMs)} ms.`),
  ...mobileRender.details.items.map((item) => `- Mobile render blocking: \`${item.url}\` -> ${Math.round(item.wastedMs)} ms.`),
  "",
  "### unminified-css",
  `- Desktop CSS savings: ${formatBytes(desktopCss.details.overallSavingsBytes)} on \`${desktopCss.details.items[0].url}\`.`,
  `- Mobile CSS savings: ${formatBytes(mobileCss.details.overallSavingsBytes)} on \`${mobileCss.details.items[0].url}\`.`,
  "",
  "### unminified-javascript",
  `- Desktop JS savings: ${formatBytes(desktopJs.details.overallSavingsBytes)} on \`${desktopJs.details.items[0].url}\` and \`${desktopJs.details.items[1].url}\`.`,
  `- Mobile JS savings: ${formatBytes(mobileJs.details.overallSavingsBytes)} on \`${mobileJs.details.items[0].url}\` and \`${mobileJs.details.items[1].url}\`.`,
  "",
  "### unused-css-rules",
  `- Desktop unused CSS savings: ${formatBytes(desktopUnusedCss.details.overallSavingsBytes)}.`,
  `- Mobile unused CSS savings: ${formatBytes(mobileUnusedCss.details.overallSavingsBytes)}.`,
  "",
  "### unused-javascript",
  `- Desktop unused JS savings: ${formatBytes(desktopUnusedJs.details.overallSavingsBytes)}.`,
  `- Mobile unused JS savings: ${formatBytes(mobileUnusedJs.details.overallSavingsBytes)}.`,
  "",
  "### mainthread-work-breakdown",
  `- Mobile main thread total: ${Math.round(mobileMainthread.numericValue)} ms.`,
  `- Mobile top buckets: Other ${Math.round(mobileMainthread.details.items[0].duration)} ms, Script Evaluation ${Math.round(mobileMainthread.details.items[1].duration)} ms, Style/Layout ${Math.round(mobileMainthread.details.items[2].duration)} ms.`,
  "",
  "### video-caption",
  `- Desktop informative accessibility finding on selector \`${desktopVideoCaption.details.items[0].node.selector}\`, impact critical.`,
  `- Mobile informative accessibility finding on selector \`${mobileVideoCaption.details.items[0].node.selector}\`, impact critical.`,
  "",
  "## Oracle local a ne pas envoyer tel quel au modele",
  "- Un audit humain local du 2026-06-14 a deja retenu comme priorites: videos trop lourdes, medias de fin de page charges trop tot, texture contact + map projet trop lourdes, chemin critique CSS/fonts, puis nettoyage CSS/JS.",
  "- Ce rappel sert seulement a valider localement la sortie Mistral apres coup.",
  "",
  "## Sortie attendue",
  "- JSON strict uniquement.",
  "- `5` actions primaires uniques, chacune choisie parmi les `action_key` imposes.",
  "- `1` finding secondaire maximum pour `video-caption` si le modele juge qu'il faut le suivre a part.",
  "- Aucun fichier ou audit hors contexte.",
];

const expected = {
  task_category: "triage_lighthouse_multisupport",
  project_name: "01_SITE_MA_METHODE",
  allowed_action_keys: [
    "video_payload",
    "defer_below_fold_media",
    "heavy_images_and_textures",
    "critical_render_path",
    "css_js_cleanup"
  ],
  actions: {
    video_payload: {
      required_audit_ids: ["total-byte-weight"],
      required_file_fragments: [
        "storyboard-kling-12-clips-1080p-scroll-web.mp4",
        "storyboard-kling-12-clips-720p-mobile-crop.mp4"
      ],
      accepted_scopes: ["both"]
    },
    defer_below_fold_media: {
      required_audit_ids: ["total-byte-weight"],
      required_file_fragments: [
        "contact-transition-20260614-1080p.mp4",
        "contact-transition-20260614-720p.mp4",
        "project-grid-map-20260614.png"
      ],
      accepted_scopes: ["both"]
    },
    heavy_images_and_textures: {
      required_audit_ids: ["total-byte-weight"],
      required_file_fragments: [
        "contact-cube-face.png",
        "project-grid-map-20260614.png"
      ],
      accepted_scopes: ["both"]
    },
    critical_render_path: {
      required_audit_ids: ["render-blocking-insight"],
      required_file_fragments: ["fonts.googleapis.com", "src/styles.css"],
      accepted_scopes: ["both"]
    },
    css_js_cleanup: {
      required_audit_ids: [
        "unminified-css",
        "unminified-javascript",
        "unused-css-rules",
        "unused-javascript",
        "mainthread-work-breakdown"
      ],
      required_file_fragments: ["src/styles.css", "src/main.js", "src/contact-scene.js"],
      accepted_scopes: ["both", "mobile"]
    }
  },
  secondary_finding: {
    audit_id: "video-caption",
    selector: "body > video#story-video",
    accepted_disposition: "track_accessibility"
  }
};

fs.writeFileSync(
  path.join(evidenceDir, "2026-06-15-lighthouse-triage-context.md"),
  `${contextLines.join("\n")}\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(evidenceDir, "2026-06-15-lighthouse-triage-expected.json"),
  `${JSON.stringify(expected, null, 2)}\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(evidenceDir, "2026-06-15-lighthouse-triage-oracle-note.txt"),
  `${auditDoc}\n`,
  "utf8"
);

console.log(JSON.stringify({
  ok: true,
  context_file: "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-context.md",
  expected_file: "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-expected.json",
  oracle_note: "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-oracle-note.txt"
}, null, 2));
