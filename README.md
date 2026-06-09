# mistral-subagent

A Codex skill that delegates bounded, text-centric tasks to Mistral AI as a subordinate model for text generation, summarization, classification, extraction, translation, brainstorming, code review, code explanation, small code generation, structured JSON output, prompt drafting, project folder audits, and documentation improvements.

## Purpose

The `mistral-subagent` skill allows Codex to propose and use Mistral AI as a subordinate helper for tasks that are:

- **Bounded**: Well-defined and scoped to avoid overreach.
- **Text-centric**: Focused on text, code, or structured data generation/analysis.
- **Safe to outsource**: No secrets, private data, or direct filesystem/shell access.

Mistral acts as an advisory tool, while Codex retains full control over context filtering, verification, and integration of results.

## Safety Model

- **No Direct Authority**: Mistral has no filesystem, shell, browser, GitHub, or deployment access. All interactions are mediated by Codex.
- **Context Filtering**: Codex scans and filters project folders, excluding secrets, binary files, oversized files, `.git`, `node_modules`, and other sensitive content.
- **Verification**: Codex validates Mistral's output before applying changes or presenting results to the user.
- **Rate Limits**: Mistral's API rate limits are respected, and users are informed of `429` errors.

## Installation

1. Copy the `mistral-subagent` folder into your Codex skills directory:
   ```bash
   cp -r mistral-subagent ~/.codex/skills/
   ```
2. Ensure Node.js is installed on your system.

## API Key Configuration

Set your Mistral API key in one of the following ways:

- **Environment Variable**:
  ```bash
  export MISTRAL_API_KEY="your_api_key_here"
  ```
- **Local File**: By default the helper reads `D:\00_Cerveau_IA\API\env.Local`. To use another file, point `MISTRAL_ENV_FILE` to your own path:
  ```
  MISTRAL_API_KEY=your_api_key_here
  ```

The helper script also accepts `MISTRAL_AI_API_KEY`, `MISTRALAI_API_KEY`, and `MISTRAL.API_KEY`.

## Commands

### Assess Task Suitability

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Your task description"
```

### Quota Report

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs quota-report --codex-baseline 1540 --codex-current 154198 --mistral-useful 168189
```

Use this to report the final delegation ratio from the token-saving protocol:
`Codex delta / (Codex delta + useful Mistral tokens)`.

### Dry Run (Inspect Payload)

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs run --task "Your task" --dry-run
```

### Check Local Configuration

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs check
```

### Call Mistral API

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs run --task "Your task" --context-file path/to/context.txt --model mistral-small-latest
```

### List Available Models

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs models
```

### Project Scan

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs project-scan --path path/to/project --output path/to/output.json
```

### Project Action

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs project-action --path path/to/project --goal "Your goal" --output path/to/output.json
```

## Model Routing

Choose the appropriate Mistral model based on the task:

- **`mistral-small-latest`**: Default for cheap, routine tasks (summarization, extraction, first passes).
- **`mistral-medium-latest`**: Stronger reasoning and synthesis (project audits, documentation, multimodal analysis).
- **`mistral-large-latest`**: High-quality, public-facing outputs or complex synthesis.
- **`devstral-latest`**: Agentic software engineering (repository audits, patch planning, task decomposition).
- **`codestral-latest`**: Code generation, review, and fill-in-middle tasks.
- **`magistral-medium-latest`**: Careful reasoning or step-by-step evaluations.
- **Specialized Models**: Use `mistral-ocr-latest`, `mistral-embed`, `codestral-embed`, `mistral-moderation-latest`, or `voxtral-mini-latest` for OCR, embeddings, moderation, and audio tasks.
- **Bounded RAG Prep**: Prefer `mistral-embed` for bounded document or mixed retrieval, then verify top-k locally before any chat step. Treat `codestral-embed` as code-specific and validate it locally before making it a default dependency.
- **Preflight Secret Screening**: For custom `allow`/`redact`/`block` decisions, prefer `mistral-small-latest` or `mistral-medium-3.5`, then use `mistral-moderation-2603` on `/v1/moderations` only as an extra moderation/PII signal.

## Proven Quota Experiment

The `mistral-subagent` skill includes a **Token-Saving Delegation Protocol** to optimize Mistral's usage:

1. **Baseline Measurement**: Establish Codex's token usage baseline before delegation.
2. **Narrow Tasks**: Send focused, minimal tasks to Mistral to conserve tokens.
3. **Output Discipline**: Write responses to files to avoid large stdout and save tokens.
4. **Validation**: Count only applied, useful tokens. Exclude invalid or irrelevant outputs.
5. **Transparent Reporting**: Report the final token ratio: `Codex delta / (Codex delta + useful Mistral tokens)`.

This protocol ensures Mistral is used efficiently while maintaining Codex's control over verification and integration.

## Output Discipline

- **Structured JSON**: Request and validate JSON outputs for programmatic use.
- **Code/Patches**: Ask for complete files or unified diffs, not direct writes. Codex applies changes locally after inspection.
- **Research**: Gather authoritative sources first; Mistral summarizes or compares them.

## References

- [Delegation Playbook](mistral-subagent/references/delegation-playbook.md): Token-saving loops, safe batching, and validation.
- [Quota Reporting (FR)](mistral-subagent/references/quota-reporting-fr.md): Validated workflow for turning `quota-report` output into a French delegation summary.
- [JSON Extraction for Repo Maintenance (FR)](mistral-subagent/references/json-extraction-maintenance-fr.md): Strict schema pattern for turning maintenance briefs into verified JSON plans.
- [Review Comments Triage (FR)](mistral-subagent/references/review-comments-triage-fr.md): Validated workflow for classifying bounded review comments into `apply`, `reply`, `reject`, or `clarify`.
- [Preflight Secret Screening (FR)](mistral-subagent/references/preflight-secret-screening-fr.md): Validated workflow for screening bounded context into `allow`, `redact`, or `block` before delegation.
- [Task Delegation Triage (FR)](mistral-subagent/references/task-delegation-triage-fr.md): Partially validated workflow for classifying which real project tasks can be delegated and how much Codex must still retain.
- [RAG/Embeddings Planning (FR)](mistral-subagent/references/rag-embeddings-planning-fr.md): Validated workflow for bounded multi-project RAG planning before Codex implements local indexing.
- [Diff Review Findings (FR)](mistral-subagent/references/diff-review-findings-fr.md): Validated workflow for bounded diff review with actionable French findings.
- [Unit-Test Ideas for Helper (FR)](mistral-subagent/references/unit-test-ideas-helper-fr.md): Bounded workflow for generating unit-test ideas on a local helper.
- [UI/UX Copy Scroll-Driven (FR)](mistral-subagent/references/ui-ux-copy-scroll-driven-fr.md): Validated delegation workflow for French UI copy critique and rewrites.
- [Mistral API Notes](mistral-subagent/references/mistral-api.md): Endpoints, rate limits, and model capabilities.
- [Model Selection](mistral-subagent/references/model-selection.md): Task-to-model mapping.
- [Task Matrix](mistral-subagent/references/mistral-task-matrix.md): Compact task suitability guide.

For more details on why and how to use this skill, see [docs/WHY_MISTRAL_SUBAGENT.md](docs/WHY_MISTRAL_SUBAGENT.md).
