#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const DEFAULT_ENV = process.env.MISTRAL_ENV_FILE || "D:\\00_Cerveau_IA\\API\\env.Local";
const DEFAULT_MODEL = "mistral-small-latest";
const API_BASE = "https://api.mistral.ai/v1";

function printUsage(exitCode = 0) {
  const usage = `
Mistral subagent helper

Commands:
  recommend --task <text>
  select-model --task <text>
  quota-report --codex-baseline <n> --codex-current <n> --mistral-useful <n>
  run --task <text> [--context-file <path>] [--model <id>] [--system <text>] [--max-tokens <n>] [--temperature <n>] [--json] [--dry-run] [--env <path>]
  project-scan --path <project-path> [--max-files <n>] [--max-manifest <n>] [--max-file-bytes <n>] [--max-context-bytes <n>] [--output <path>]
  project-action --path <project-path> --goal <text> [--model <id>] [--max-files <n>] [--max-manifest <n>] [--max-file-bytes <n>] [--max-context-bytes <n>] [--max-tokens <n>] [--dry-run] [--output <path>]
  check [--env <path>]
  models [--env <path>]

Examples:
  node mistral-subagent.mjs recommend --task "Summarize this document"
  node mistral-subagent.mjs select-model --task "Audit this TypeScript project and propose patches"
  node mistral-subagent.mjs quota-report --codex-baseline 1540 --codex-current 154198 --mistral-useful 168189
  node mistral-subagent.mjs run --task "Extract action items as JSON" --context-file notes.txt --json
  node mistral-subagent.mjs project-scan --path D:\\project --output context.json
  node mistral-subagent.mjs project-action --path D:\\project --goal "Improve GitHub docs and CI" --output mistral-plan.json
  node mistral-subagent.mjs check
  node mistral-subagent.mjs models
`;
  console.log(usage.trim());
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const key = token.slice(2);
    if (["json", "dry-run", "help", "no-content"].includes(key)) {
      args[key] = true;
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

const DEFAULT_EXCLUDED_DIRS = new Set([
  ".git", "node_modules", ".next", ".nuxt", "dist", "build", "out", "coverage",
  ".venv", "venv", "__pycache__", ".pytest_cache", ".mypy_cache", ".turbo",
  ".cache", ".parcel-cache", "target", "bin", "obj", "vendor"
]);

const TEXT_EXTENSIONS = new Set([
  ".md", ".txt", ".rst", ".adoc", ".json", ".jsonc", ".yml", ".yaml", ".toml",
  ".xml", ".html", ".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts",
  ".tsx", ".mjs", ".cjs", ".py", ".ps1", ".sh", ".bat", ".cmd", ".cs", ".java",
  ".go", ".rs", ".php", ".rb", ".sql", ".graphql", ".gql", ".vue", ".svelte",
  ".c", ".h", ".cpp", ".hpp", ".swift", ".kt", ".kts", ".dart", ".ini", ".cfg",
  ".editorconfig", ".gitignore", ".gitattributes"
]);

const SECRET_NAME_PATTERN = /(^|[\\/._-])(\.env|env\.local|secret|secrets|token|credential|credentials|password|passwd|private[_-]?key|id_rsa|id_dsa|id_ed25519|keychain)([\\/._-]|$)/i;
const SECRET_CONTENT_PATTERN = /(api[_\.-]?key|secret|token|password|passwd|bearer|authorization)\s*[:=]\s*["']?[A-Za-z0-9_\-./+=:]{16,}/i;

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_.-]*)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
  return env;
}

function getApiKey(args) {
  const envPath = path.resolve(args.env || DEFAULT_ENV);
  const fileEnv = loadEnvFile(envPath);
  const apiKey = process.env.MISTRAL_API_KEY || fileEnv.MISTRAL_API_KEY ||
    process.env.MISTRAL_AI_API_KEY || fileEnv.MISTRAL_AI_API_KEY ||
    process.env.MISTRALAI_API_KEY || fileEnv.MISTRALAI_API_KEY ||
    process.env["MISTRAL.API_KEY"] || fileEnv["MISTRAL.API_KEY"];
  if (!apiKey) {
    throw new Error(`MISTRAL_API_KEY not found in environment or ${envPath}`);
  }
  return apiKey;
}

function checkConfig(args) {
  const envPath = path.resolve(args.env || DEFAULT_ENV);
  const fileEnv = loadEnvFile(envPath);
  const aliases = ["MISTRAL_API_KEY", "MISTRAL_AI_API_KEY", "MISTRALAI_API_KEY", "MISTRAL.API_KEY"];
  const found = aliases.filter((name) => Boolean(process.env[name] || fileEnv[name]));
  return {
    env_path: envPath,
    env_file_exists: fs.existsSync(envPath),
    api_key_configured: found.length > 0,
    accepted_key_names: aliases,
    configured_key_names: found
  };
}

function scoreTask(task) {
  const text = task.toLowerCase();
  const positive = [
    "summar", "resume", "resum", "synth", "class", "extract", "json", "translate", "tradu",
    "rewrite", "reecri", "email", "prompt", "brainstorm", "idees", "review", "explain",
    "explique", "code", "test", "regex", "compare", "analyse", "structure", "action",
    "bug", "typescript", "javascript", "python", "propose"
  ];
  const negative = [
    "deploy", "deplo", "delete", "supprime", "remove files", "rm ", "secret", "token",
    "api key", "env.local", "password", "mot de passe", "run command", "shell", "browser",
    "localhost", "commit", "push", "production"
  ];
  let score = 0.25;
  const hits = [];
  for (const word of positive) {
    if (text.includes(word)) {
      score += 0.09;
      hits.push(word);
    }
  }
  const risks = [];
  for (const word of negative) {
    if (text.includes(word)) {
      score -= 0.13;
      risks.push(word);
    }
  }
  score = Math.max(0, Math.min(0.95, score));
  const selection = selectModelForTask(task);
  return {
    suitable: score >= 0.5 && risks.length === 0,
    confidence: Number(score.toFixed(2)),
    suggested_model: selection.model,
    suggested_model_reason: selection.reason,
    matched_signals: [...new Set(hits)].slice(0, 8),
    risk_signals: [...new Set(risks)],
    proposal_fr: score >= 0.5 && risks.length === 0
      ? "Mistral peut aider comme sous-agent pour une premiere passe. Codex devrait envoyer seulement le contexte necessaire, puis verifier et integrer la reponse."
      : "Mistral n'est pas ideal pour cette tache sans cadrage ou redaction supplementaire. Codex devrait garder la main."
  };
}

function selectModelForTask(task) {
  const text = task.toLowerCase();
  const rules = [
    {
      model: "mistral-ocr-latest",
      reason: "OCR/document extraction from PDFs, screenshots, scans, or document images.",
      pattern: /(ocr|pdf|scan|document ai|facture|invoice|receipt|table extraction|extract.*document)/
    },
    {
      model: "voxtral-mini-latest",
      reason: "Audio transcription or speech understanding.",
      pattern: /(audio|transcri|speech|voice|voix|podcast|meeting recording|realtime)/
    },
    {
      model: "mistral-moderation-latest",
      reason: "Safety classification, moderation, or policy scoring.",
      pattern: /(moderation|classif.*safety|policy|toxicity|contenu dangereux|unsafe)/
    },
    {
      model: "codestral-embed",
      reason: "Code embeddings or code semantic search.",
      pattern: /(code embedding|semantic code|search code|rag code|retrieval.*code)/
    },
    {
      model: "mistral-embed",
      reason: "Text embeddings, clustering, semantic search, or RAG indexing.",
      pattern: /(embedding|embed|semantic search|rag|cluster|similarity|retrieval)/
    },
    {
      model: "devstral-latest",
      reason: "Agentic repository work: codebase audit, task decomposition, file plans, and patch planning.",
      pattern: /(repo|repository|github|codebase|project folder|audit|agentic|multi.file|architecture|plan patches|issue templates|ci)/
    },
    {
      model: "codestral-latest",
      reason: "Focused code generation, code review, bug fixing, tests, or fill-in-middle.",
      pattern: /(fim|fill.in.middle|code completion|typescript|javascript|python|bug|unit test|refactor|patch|diff|review code|compile)/
    },
    {
      model: "magistral-medium-latest",
      reason: "Careful reasoning, tradeoff analysis, or step-by-step evaluation.",
      pattern: /(reasoning|raisonnement|proof|prove|evaluate deeply|tradeoff|decision matrix)/
    },
    {
      model: "mistral-large-latest",
      reason: "High-quality synthesis, public-facing prose, complex strategy, or important second opinion.",
      pattern: /(large|complex|strategy|strategie|public|release|important|second opinion|synthesis|synthese)/
    },
    {
      model: "mistral-medium-3.5",
      reason: "Richer general reasoning and multimodal project analysis.",
      pattern: /(medium|multimodal|vision|image understanding|screenshot|maquette|diagram)/
    }
  ];
  const match = rules.find((rule) => rule.pattern.test(text));
  if (match) return { model: match.model, reason: match.reason };
  return {
    model: DEFAULT_MODEL,
    reason: "Cheap/default first pass for summaries, docs, extraction, JSON, rewrites, and bounded drafting."
  };
}

function quotaReport(args) {
  const baseline = Number(args["codex-baseline"]);
  const current = Number(args["codex-current"]);
  const mistralUseful = Number(args["mistral-useful"]);
  if (![baseline, current, mistralUseful].every(Number.isFinite)) {
    throw new Error("quota-report requires numeric --codex-baseline, --codex-current, and --mistral-useful");
  }
  const codexDelta = Math.max(0, current - baseline);
  const total = codexDelta + Math.max(0, mistralUseful);
  const codexShare = total ? codexDelta / total : 0;
  return {
    codex_baseline: baseline,
    codex_current: current,
    codex_delta: codexDelta,
    mistral_useful_tokens: mistralUseful,
    combined_tokens: total,
    codex_share: Number(codexShare.toFixed(4)),
    codex_share_percent: Number((codexShare * 100).toFixed(2)),
    target_under_49_percent: codexShare <= 0.49
  };
}

function readContext(contextFile) {
  if (!contextFile) return "";
  const fullPath = path.resolve(contextFile);
  return fs.readFileSync(fullPath, "utf8");
}

function isProbablyTextFile(filePath) {
  const base = path.basename(filePath).toLowerCase();
  if (TEXT_EXTENSIONS.has(base)) return true;
  return TEXT_EXTENSIONS.has(path.extname(base));
}

function shouldSkipPath(fullPath, rootPath) {
  const rel = path.relative(rootPath, fullPath);
  const parts = rel.split(path.sep);
  if (parts.some((part) => DEFAULT_EXCLUDED_DIRS.has(part))) return "excluded_dir";
  if (SECRET_NAME_PATTERN.test(rel)) return "secret_like_name";
  return "";
}

function walkFiles(rootPath) {
  const files = [];
  const stack = [rootPath];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const skipReason = shouldSkipPath(fullPath, rootPath);
      if (skipReason) continue;
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }
  return files.sort((a, b) => path.relative(rootPath, a).localeCompare(path.relative(rootPath, b)));
}

function priorityForRelPath(relPath) {
  const name = relPath.replaceAll("\\", "/").toLowerCase();
  if (name === "readme.md") return 100;
  if (["package.json", "pyproject.toml", "cargo.toml", "go.mod", "requirements.txt"].includes(name)) return 95;
  if (name.startsWith(".github/")) return 90;
  if (name.includes("contributing") || name.includes("security") || name.includes("license")) return 88;
  if (name.startsWith("docs/") && name.endsWith(".md")) return 80;
  if (name.endsWith("skill.md") || name.endsWith("competence.md")) return 78;
  if (name.startsWith("scripts/")) return 70;
  if (name.endsWith(".md")) return 65;
  if (name.endsWith(".json") || name.endsWith(".yml") || name.endsWith(".yaml")) return 55;
  return 30;
}

function readSafeTextFile(fullPath, maxFileBytes) {
  const stat = fs.statSync(fullPath);
  if (stat.size > maxFileBytes) {
    return { skipped: true, reason: "too_large", size: stat.size };
  }
  if (!isProbablyTextFile(fullPath)) {
    return { skipped: true, reason: "non_text_extension", size: stat.size };
  }
  const buffer = fs.readFileSync(fullPath);
  if (buffer.includes(0)) {
    return { skipped: true, reason: "binary_content", size: stat.size };
  }
  const text = buffer.toString("utf8");
  if (SECRET_CONTENT_PATTERN.test(text)) {
    return { skipped: true, reason: "secret_like_content", size: stat.size };
  }
  return { skipped: false, text, size: stat.size };
}

function buildProjectContext(args) {
  const projectPathRaw = args.path;
  if (!projectPathRaw) throw new Error("Missing --path");
  const projectPath = path.resolve(projectPathRaw);
  if (!fs.existsSync(projectPath) || !fs.statSync(projectPath).isDirectory()) {
    throw new Error(`Project path is not a directory: ${projectPath}`);
  }
  const maxFiles = Number(args["max-files"] || 80);
  const maxManifest = Number(args["max-manifest"] || 200);
  const maxFileBytes = Number(args["max-file-bytes"] || 24000);
  const maxContextBytes = Number(args["max-context-bytes"] || 80000);
  const includeContent = !args["no-content"];
  const allFiles = walkFiles(projectPath);
  const manifest = [];
  const included = [];
  const skipped = [];
  let contextBytes = 0;

  const candidates = allFiles.map((fullPath) => {
    const relPath = path.relative(projectPath, fullPath).replaceAll("\\", "/");
    const stat = fs.statSync(fullPath);
    return {
      fullPath,
      path: relPath,
      size: stat.size,
      priority: priorityForRelPath(relPath)
    };
  }).sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path));

  for (const item of candidates) {
    if (manifest.length < maxManifest) manifest.push({ path: item.path, size: item.size });
    if (!includeContent || included.length >= maxFiles || contextBytes >= maxContextBytes) continue;
    const read = readSafeTextFile(item.fullPath, maxFileBytes);
    if (read.skipped) {
      skipped.push({ path: item.path, size: read.size, reason: read.reason });
      continue;
    }
    const contentBytes = Buffer.byteLength(read.text, "utf8");
    if (contextBytes + contentBytes > maxContextBytes) {
      skipped.push({ path: item.path, size: read.size, reason: "context_budget" });
      continue;
    }
    contextBytes += contentBytes;
    included.push({ path: item.path, size: read.size, content: read.text });
  }

  return {
    project_path: projectPath,
    generated_at: new Date().toISOString(),
    policy: {
      direct_write_allowed_for_mistral: false,
      codex_must_review_before_apply: true,
      skipped_secret_like_names: true,
      skipped_secret_like_content: true,
      max_files: maxFiles,
      max_manifest: maxManifest,
      max_file_bytes: maxFileBytes,
      max_context_bytes: maxContextBytes
    },
    totals: {
      files_seen: candidates.length,
      manifest_files: manifest.length,
      files_included: included.length,
      files_skipped: skipped.length,
      context_bytes: contextBytes
    },
    manifest,
    included_files: included,
    skipped_files: skipped
  };
}

function writeJsonIfRequested(args, data) {
  if (!args.output) return;
  const outputPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
}

function buildProjectActionPayload(args, projectContext) {
  const goal = args.goal || args.action || args.task;
  if (!goal) throw new Error("Missing --goal");
  const schema = {
    summary: "short project understanding",
    suitability: "why Mistral can or cannot help",
    proposed_actions: [{ title: "action", priority: "high|medium|low", why: "reason" }],
    files_to_create: [{ path: "relative/path", content: "complete file content", reason: "why" }],
    files_to_update: [{ path: "relative/path", instructions: "specific edit instructions", patch: "unified diff if possible", reason: "why" }],
    commands_to_run_after_codex_applies: ["safe validation commands only"],
    risks: ["risk or assumption"],
    questions_for_user: ["only if required"]
  };
  const system = [
    "You are Mistral acting as a project-aware subordinate helper for Codex.",
    "You receive a filtered project snapshot. You cannot read files yourself and you cannot write files.",
    "Generate complete text/code file content or precise patches only for bounded, low-risk work.",
    "Do not invent files, flags, commands, scripts, dependencies, or APIs that are not evidenced by the snapshot.",
    "Validation commands must use only standard shell/Git commands, built-in PowerShell parsing, or scripts explicitly visible in the snapshot.",
    "Do not suggest optional tools such as act, npm, pytest, or custom flags unless their config or script is visible in the snapshot.",
    "If no validation command is proven, say Codex should choose local validation.",
    "Do not ask for secrets. Do not choose legal licenses for the user.",
    "Codex will verify and apply changes."
  ].join(" ");
  const task = [
    `Goal: ${goal}`,
    "Return only valid JSON matching this shape:",
    JSON.stringify(schema, null, 2),
    "Project snapshot:",
    JSON.stringify(projectContext)
  ].join("\n\n");
  return {
    model: args.model || DEFAULT_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: task }
    ],
    temperature: args.temperature === undefined ? 0.2 : Number(args.temperature),
    max_tokens: args["max-tokens"] === undefined ? 4096 : Number(args["max-tokens"]),
    response_format: { type: "json_object" }
  };
}

function buildPayload(args) {
  const task = args.task;
  if (!task) throw new Error("Missing --task");
  const context = readContext(args["context-file"]);
  const system = args.system || [
    "You are Mistral acting as a subordinate helper for Codex.",
    "Return useful advisory work only. Do not claim to have used tools or changed files.",
    "If context is insufficient, state the missing information plainly.",
    "Avoid exposing or requesting secrets."
  ].join(" ");
  const userParts = [`Task:\n${task}`];
  if (context) userParts.push(`Context provided by Codex:\n${context}`);
  if (args.json) userParts.push("Return only valid JSON. Do not wrap it in Markdown.");
  const payload = {
    model: args.model || DEFAULT_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userParts.join("\n\n") }
    ],
    temperature: args.temperature === undefined ? 0.2 : Number(args.temperature),
    max_tokens: args["max-tokens"] === undefined ? 2048 : Number(args["max-tokens"])
  };
  if (args.json) payload.response_format = { type: "json_object" };
  return payload;
}

function contentToText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((chunk) => {
      if (typeof chunk === "string") return chunk;
      if (chunk && typeof chunk.text === "string") return chunk.text;
      if (chunk && typeof chunk.content === "string") return chunk.content;
      return "";
    }).join("");
  }
  return JSON.stringify(content);
}

function usefulHeaders(headers) {
  const result = {};
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase().startsWith("x-ratelimit") || key.toLowerCase() === "retry-after") {
      result[key] = value;
    }
  }
  return result;
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!response.ok) {
    const error = new Error(`Mistral API error ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.body = body;
    error.headers = usefulHeaders(response.headers);
    throw error;
  }
  return { body, headers: usefulHeaders(response.headers) };
}

async function run(args) {
  const payload = buildPayload(args);
  if (args["dry-run"]) {
    console.log(JSON.stringify({ dry_run: true, endpoint: `${API_BASE}/chat/completions`, payload }, null, 2));
    return;
  }
  const apiKey = getApiKey(args);
  const { body, headers } = await requestJson(`${API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const choice = body.choices?.[0];
  const text = contentToText(choice?.message?.content ?? "");
  console.log(JSON.stringify({
    model: body.model || payload.model,
    finish_reason: choice?.finish_reason,
    usage: body.usage,
    rate_limit: headers,
    text
  }, null, 2));
}

async function models(args) {
  const apiKey = getApiKey(args);
  const { body, headers } = await requestJson(`${API_BASE}/models`, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  console.log(JSON.stringify({ rate_limit: headers, models: body.data || body }, null, 2));
}

async function projectScan(args) {
  const projectContext = buildProjectContext(args);
  writeJsonIfRequested(args, projectContext);
  console.log(JSON.stringify(projectContext, null, 2));
}

async function projectAction(args) {
  const projectContext = buildProjectContext(args);
  const payload = buildProjectActionPayload(args, projectContext);
  if (args["dry-run"]) {
    const data = {
      dry_run: true,
      endpoint: `${API_BASE}/chat/completions`,
      context_summary: projectContext.totals,
      payload
    };
    writeJsonIfRequested(args, data);
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  const apiKey = getApiKey(args);
  const { body, headers } = await requestJson(`${API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const choice = body.choices?.[0];
  const text = contentToText(choice?.message?.content ?? "");
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }
  const data = {
    model: body.model || payload.model,
    finish_reason: choice?.finish_reason,
    usage: body.usage,
    rate_limit: headers,
    context_summary: projectContext.totals,
    result: parsed,
    text: parsed ? undefined : text
  };
  writeJsonIfRequested(args, data);
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  if (!command || args.help) printUsage(0);
  if (command === "recommend") {
    if (!args.task) throw new Error("Missing --task");
    console.log(JSON.stringify(scoreTask(args.task), null, 2));
    return;
  }
  if (command === "select-model") {
    if (!args.task) throw new Error("Missing --task");
    console.log(JSON.stringify(selectModelForTask(args.task), null, 2));
    return;
  }
  if (command === "quota-report") {
    console.log(JSON.stringify(quotaReport(args), null, 2));
    return;
  }
  if (command === "run") {
    await run(args);
    return;
  }
  if (command === "project-scan") {
    await projectScan(args);
    return;
  }
  if (command === "project-action") {
    await projectAction(args);
    return;
  }
  if (command === "check") {
    console.log(JSON.stringify(checkConfig(args), null, 2));
    return;
  }
  if (command === "models") {
    await models(args);
    return;
  }
  printUsage(1);
}

main().catch((error) => {
  console.error(JSON.stringify({
    error: error.message,
    status: error.status,
    rate_limit: error.headers,
    body: error.body
  }, null, 2));
  process.exitCode = 1;
});
