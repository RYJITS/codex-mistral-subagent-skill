---
name: mistral-subagent
description: "Use when Codex should consider delegating a suitable task to Mistral AI as a subordinate model/API helper: text generation, summarization, classification, extraction, translation, brainstorming, code review, code explanation, small code generation, structured JSON output, prompt drafting, project folder audit, GitHub/repository improvement proposals, generated documentation files, simple patches, or second-opinion reasoning. Trigger when the user mentions Mistral, asks to use a cheaper/free API model, wants an external sub-agent, gives a project folder for Mistral to inspect indirectly, or when Codex can propose Mistral for bounded non-destructive tasks."
---

# Mistral Subagent

## Role

Use Mistral as a subordinate model, never as the primary orchestrator. Codex decides whether Mistral is appropriate, proposes delegation to the user when useful, sends only the needed context, then verifies and integrates the result.

Mistral must not receive secrets, full env files, private tokens, or unnecessary personal/project data. It has no direct filesystem, browser, shell, deployment, GitHub, or memory authority. For project work, Codex scans only the user-authorized folder, filters risky files, sends a bounded text snapshot, then verifies and applies any generated files or patches.

## Delegation Rules

Propose Mistral when the task is bounded, text-centric, and safe to outsource:

- Summarization, rewriting, translation, classification, extraction, comparison, ideation.
- Structured JSON drafting or validation from provided text.
- Code explanation, small code snippets, code review second opinion, test idea generation.
- Prompt improvement, agent instruction drafting, API payload drafting.
- Project audits, README/doc generation, GitHub issue/PR templates, simple CI drafts, small safe patches.
- Cheap/free experimentation where current rate limits can tolerate retries.

Do not propose Mistral as the main worker for:

- Direct local file edits, shell commands, deployments, browser actions, GitHub pushes, or credential handling.
- High-stakes legal/medical/financial decisions without Codex verification and authoritative sources.
- Large repository changes requiring broad local context.
- Tasks requiring exact current facts unless Codex first gathers sources.
- Anything where sending the relevant context would expose secrets or too much private data.

If the user explicitly asks to use Mistral, proceed after checking the task is safe. If Mistral only seems helpful, make a concise proposal first, for example:

```text
Mistral peut aider ici comme sous-agent pour resumer/classer/proposer une premiere passe. Je peux lui envoyer uniquement le contexte necessaire, puis verifier et integrer sa reponse.
```

## Quick Commands

The helper script is dependency-free Node.js and reads `MISTRAL_API_KEY` from the process environment or from `D:\00_Cerveau_IA\API\env.Local` by default.

Assess whether Mistral fits a task without calling the API:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs recommend --task "Resume ce texte et extrais les actions"
```

Run a dry request to inspect the payload without using quota:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "Propose 5 titres courts" --dry-run
```

Check local configuration without exposing the key:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs check
```

Call Mistral:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "Explique ce bug" --context-file D:\path\context.txt --model mistral-small-latest
```

List available models for the current API key:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs models
```

Scan a project folder into a safe JSON snapshot:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs project-scan --path D:\path\project --output D:\path\mistral-project-context.json
```

Ask Mistral to generate project actions, files, or patches:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs project-action --path D:\path\project --goal "Improve the GitHub README, templates, and lightweight validation" --output D:\path\mistral-project-plan.json
```

For low-token project work, restrict both content and manifest:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs project-action --path D:\path\project --goal "Generate one small docs improvement" --max-files 2 --max-manifest 20 --max-context-bytes 6000 --max-tokens 1200
```

## Workflow

1. Decide suitability with the delegation rules or `recommend`.
2. If delegation is optional, propose it to the user before calling the API.
3. Gather a minimal context file or concise prompt. Redact secrets and irrelevant private data.
4. Choose a model:
   - `mistral-small-latest`: cheap/default for routine text and first passes.
   - `mistral-medium-latest` or `mistral-medium-3.5`: stronger reasoning, richer synthesis, and multimodal project analysis.
   - `mistral-large-latest`: complex synthesis, public-facing quality passes, or high-value second opinions.
   - `devstral-latest`: agentic software-engineering analysis, repository audits, patch planning, and codebase task decomposition.
   - `codestral-latest`: code generation, code review, and fill-in-middle/code-completion work.
   - `magistral-medium-latest`: careful reasoning or step-by-step evaluations when available.
   - `mistral-ocr-latest`, `mistral-embed`, `codestral-embed`, `mistral-moderation-latest`, and `voxtral-mini-latest`: OCR, retrieval, code retrieval, safety scoring, and audio/transcription tasks.
   - for bounded retrieval prep, prefer `mistral-embed` first, verify top-k locally, and treat `codestral-embed` as code-specific only after local validation on the target corpus.
   - for custom preflight `allow`/`redact`/`block` screening, prefer `mistral-small-latest` or `mistral-medium-3.5`, then treat `mistral-moderation-2603` on `POST /v1/moderations` as an extra PII/moderation signal rather than the final policy decision.
5. Run the script. Prefer low temperature for extraction, classification, code review, and JSON.
6. Treat Mistral output as advisory. Codex verifies facts, code, citations, and local fit before editing files or answering.
7. Mention rate-limit issues clearly if the API returns `429`.

## Project Folder Workflow

Use this when the user gives a project path and wants Mistral to help improve it.

1. Confirm the project path is the allowed scope.
2. Run `project-scan` or `project-action`; the script skips secret-like names/content, binary files, oversized files, `.git`, `node_modules`, build outputs, and caches.
3. Ask for concrete output: `files_to_create`, `files_to_update`, patches, reasons, and validation commands.
4. Let Mistral generate complete text/code for small files or unified diffs for simple edits.
5. Codex inspects every generated change before applying it with local tools.
6. Codex runs relevant tests/checks, then commits/pushes only if the user requested repository improvement and the worktree is safe.

Do not let Mistral decide broad architecture or legal licensing alone. For licenses, security policy, production deployment, destructive changes, or sensitive data handling, Mistral may draft options but Codex/user decide.

Prefer one small request at a time. Use `--max-manifest`, `--max-files`, `--max-context-bytes`, and `--max-tokens` to keep Mistral cost lower than Codex doing the same drafting directly.

## Token-Saving Delegation Protocol

Use this when the user explicitly wants Codex to spend fewer tokens by delegating work to Mistral.

1. Establish the Codex measurement baseline before the delegation loop when the environment exposes one.
2. Send narrow, useful tasks to Mistral and suppress huge stdout by writing responses to files.
3. Prefer one complete file per Mistral batch for high reliability; use multi-file batches only when output length is safely bounded.
4. Count only Mistral outputs that Codex actually applies or uses after validation. Exclude malformed, truncated, irrelevant, or rejected outputs from the useful-token total.
5. Keep Codex updates short while batching. Do not paste generated content into the conversation unless the user asks.
6. Codex still owns secret filtering, file writes, tests, Git commits, pushes, and final reporting.
7. Report the final ratio transparently: `Codex delta / (Codex delta + useful Mistral tokens)`.

## Output Discipline

For structured outputs, tell Mistral exactly which JSON shape to produce and pass `--json`. Still parse/validate the returned JSON before using it.

For code, ask Mistral for patches or snippets, not direct writes. Codex applies edits locally only after inspection.

For research, Codex must gather authoritative sources first, then Mistral may summarize or compare those sources. Mistral is not a substitute for browsing when up-to-date or sourced accuracy is required.

## References

Read these only when needed:

- `references/model-selection.md`: current model families and model-to-task mapping.
- `references/delegation-playbook.md`: token-saving loops, safe batching, validation, and failure recovery.
- `references/quota-reporting-fr.md`: French workflow for interpreting `quota-report` output and deciding whether a delegation counts toward the 70 percent objective.
- `references/rag-embeddings-prep-fr.md`: French workflow for bounded retrieval prep with `mistral-embed` and local top-k verification before any chat step.
- `references/repo-audit-public-fr.md`: workflow en francais pour audit borne d'un repo public avec petite amelioration doc/validation.
- `references/public-repo-checklist.md`: publishing this skill or a derivative as a public GitHub repo.
- `references/mistral-api.md`: official endpoints, rate limits, model capabilities, limitations, and source links.
- `references/mistral-task-matrix.md`: compact task matrix for deciding what to delegate.
- `references/json-extraction-maintenance-fr.md`: French workflow for turning a maintenance brief into strict JSON Codex can validate directly.
- `references/review-comment-triage-fr.md`: French workflow for classifying bounded review comments into `apply_now`, `needs_human`, and `reject`.
- `references/task-delegation-triage-fr.md`: French note for classifying real project tasks into `oui`, `partiel`, and `non` before choosing a Mistral model.
- `references/rag-embeddings-planning-fr.md`: French workflow for bounded RAG/embeddings planning on a multi-project knowledge base before local implementation.
- `references/video-storyboard-scroll-driven-fr.md`: French workflow for storyboard/video prompt planning on scroll-driven WebGL projects.
- `references/diff-review-findings-fr.md`: French workflow for bounded diff review with actionable findings on a compact helper patch.
- `references/unit-test-ideas-helper-fr.md`: French workflow for bounded unit-test idea generation on a local helper.
- `references/ui-ux-copy-scroll-driven-fr.md`: French workflow for UI/UX copy critique and rewrites on scroll-driven pages.
- `references/preflight-secret-screening-fr.md`: French workflow for preflight secret screening before sending bounded context to Mistral.
