# Mistral Task Matrix

This matrix is based on official Mistral docs checked on 2026-06-03. Verify official docs again for pricing, exact model IDs, limits, and deprecations.

## Strong Delegation Targets

| Task | Mistral feature/model family | Give Mistral | Codex must verify |
|---|---|---|---|
| Summaries, rewrites, translations, email/docs | Chat Completions, Small/Medium/Large | Text excerpts and objective | Tone, omissions, factual claims |
| Structured extraction to JSON | JSON mode or custom structured outputs | Schema + source text | Parse JSON, validate schema |
| Simple code generation | Chat Completions, Codestral/Devstral | Small focused context | Compile/tests/security |
| Fill-in-middle code completion | FIM `/v1/fim/completions`, Codestral | Prefix/suffix only | Integration and style |
| Repository audit and docs generation | Chat Completions, Devstral/Medium/Large | Filtered project snapshot | Patch safety and local fit |
| Code review second opinion | Chat Completions, Devstral/Codestral | Diff or focused files | Actual bug validity |
| Prompt/video/storyboard drafting | Chat Completions | Requirements and constraints | Visual/technical feasibility |
| Image prompt planning under existing `promptLock` | Chat Completions, Small/Medium | Bounded creative brief, public prompt constraints, strict JSON schema | Prompt compatibility, banned-term checks, local fit |
| Classification/moderation | Classifiers/moderation APIs | Text or chat content | Thresholds and policy fit |
| Semantic search/RAG prep | Embeddings and code embeddings | Chunks of text/code | Retrieval quality and privacy |
| OCR/document extraction | Document AI OCR | Public URL, uploaded doc, or base64 doc | Extraction accuracy, tables |
| Image understanding | Vision via chat completions | Public/base64 image | Visual claims, no image generation |
| Audio transcription | Voxtral transcription | Audio URL/upload/base64 | Names, timestamps, diarization |
| Batch processing | Batch API | Many independent requests | Job setup, cost, outputs |

## Keep With Codex

- Direct filesystem edits, shell commands, Git commits, pushes, deployments.
- Secret discovery, env file handling, credential rotation.
- High-stakes final decisions and up-to-date factual claims without browsing.
- Large multi-file refactors unless Mistral receives a narrow snapshot and Codex applies in small patches.
- Legal decisions such as choosing a license; Mistral can draft options only.

## Model Selection

Use `models` to list what the current key can access. Current workspace access observed on 2026-06-03 includes:

- `mistral-small-latest`: cheap/default first pass, summaries, docs, extraction, simple JSON.
- `mistral-medium-latest` or `mistral-medium-3.5`: stronger reasoning, coding-adjacent project work, multimodal project analysis, richer drafts.
- `mistral-large-latest`: complex synthesis, public-facing quality pass, important second opinions.
- `magistral-medium-latest`: careful reasoning and evaluation when a step-by-step judgment matters.
- `codestral-latest`: code generation, code review, FIM/code completion, focused patches.
- `devstral-latest`: agentic software engineering tasks, repository audits, task decomposition, patch planning.
- `mistral-ocr-latest`: OCR/document extraction.
- `mistral-embed`: text embeddings, semantic search, RAG, clustering.
- `codestral-embed`: code embeddings and semantic code search.
- `mistral-moderation-latest`: safety classification and moderation.
- `voxtral-mini-latest`: audio/transcription tasks.

For token-saving tests, count only useful Mistral tokens from outputs that Codex applied or used after validation. Exclude malformed, truncated, irrelevant, or rejected outputs.

## Project Snapshot Policy

For `project-action`, Codex sends Mistral a filtered JSON snapshot:

- manifest of relative file paths and sizes;
- selected text file contents under byte limits;
- no `.git`, `node_modules`, caches, build outputs, binary media, secret-like names, or secret-like content;
- no direct ability to write files.

Mistral should return JSON with:

- `proposed_actions`;
- `files_to_create` with complete content;
- `files_to_update` with edit instructions or unified diff;
- validation commands;
- risks and questions.

Codex applies only after inspection.

Validation commands from Mistral are advisory. Reject commands that invent flags, scripts, test runners, CI emulators, package managers, or dependencies not visible in the snapshot. Prefer `git status`, PowerShell `ConvertFrom-Json`, YAML parsing by Codex, or commands already present in the scanned files.
