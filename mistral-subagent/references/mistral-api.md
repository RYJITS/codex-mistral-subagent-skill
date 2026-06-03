# Mistral API Reference Notes

Use this condensed reference for the `mistral-subagent` skill. Prefer official docs for anything that may have changed.

## Official Sources

- Platform overview: https://docs.mistral.ai/getting-started/platform-overview
- First API request: https://docs.mistral.ai/getting-started/quickstarts/developer/first-api-request
- API keys: https://docs.mistral.ai/admin/security-access/api-keys
- Chat completions: https://docs.mistral.ai/studio-api/conversations/chat-completion
- API spec: https://docs.mistral.ai/api/
- Models overview: https://docs.mistral.ai/getting-started/models/
- Model endpoints: https://docs.mistral.ai/api/endpoint/models
- Vision: https://docs.mistral.ai/capabilities/vision
- Coding: https://docs.mistral.ai/capabilities/code_generation/
- Function calling: https://docs.mistral.ai/capabilities/function_calling
- Structured outputs: https://docs.mistral.ai/capabilities/structured-output/structured_output_overview/
- Embeddings: https://docs.mistral.ai/capabilities/embeddings
- Document AI / OCR: https://docs.mistral.ai/capabilities/document_ai
- Audio transcription: https://docs.mistral.ai/capabilities/audio/speech_to_text
- Moderation: https://docs.mistral.ai/studio-api/safety-moderation
- Batch processing: https://docs.mistral.ai/capabilities/batch
- Agents and conversations: https://docs.mistral.ai/capabilities/agents/
- Vibe Code: https://docs.mistral.ai/vibe/code/overview
- Rate limits and usage tiers: https://docs.mistral.ai/deployment/ai-studio/tier
- Usage limits: https://docs.mistral.ai/admin/user-management-finops/usage-limits
- Known limitations: https://docs.mistral.ai/resources/known-limitations
- Pricing: https://mistral.ai/pricing/

## Authentication

API calls use bearer auth:

```http
Authorization: Bearer <MISTRAL_API_KEY>
Content-Type: application/json
```

The local default for this workspace is `D:\00_Cerveau_IA\API\env.Local`. Store the key as `MISTRAL_API_KEY=...`. The helper also accepts `MISTRAL_AI_API_KEY`, `MISTRALAI_API_KEY`, and this workspace's dotted `MISTRAL.API_KEY`. Do not expose or send this file to any model.

## Chat Completions

Endpoint:

```http
POST https://api.mistral.ai/v1/chat/completions
```

Core payload fields:

- `model`: model id, for example `mistral-small-latest`.
- `messages`: list of `{ "role": "system"|"user"|"assistant"|"tool", "content": "..." }`.
- `temperature`: lower for factual, code, extraction, or JSON tasks.
- `max_tokens`: cap output length. Input plus output must fit model context.
- `response_format`: for JSON mode, use `{ "type": "json_object" }` and explicitly instruct JSON in the prompt.

Mistral content may be a plain string or a list of content chunks. Scripts should handle both.

## Project Actions

The local helper supports project-aware calls:

- `project-scan`: creates a filtered project snapshot for review or logging.
- `project-action`: sends the filtered snapshot and a goal to Mistral, requesting JSON with proposed actions, complete files to create, patch instructions, validation commands, risks, and questions.

Mistral does not get direct filesystem access. Codex scans and filters the path, then Codex verifies/applies.

The scan skips `.git`, `node_modules`, common build/cache folders, binary files, oversized files, secret-like filenames, and secret-like content.

## Good Sub-Agent Tasks

Use Mistral for bounded advisory work:

- summarize text, extract actions, classify records, translate, rewrite;
- generate structured JSON from supplied context;
- draft prompts, emails, docs, issue summaries, test ideas;
- explain code, review small diffs, suggest algorithms;
- generate small complete documentation/code files from a filtered project snapshot;
- draft GitHub metadata: issue templates, PR templates, CONTRIBUTING, SECURITY, CI checks;
- draft simple patches for README/docs/config/source files;
- provide a second opinion before Codex makes final changes.

Keep Codex responsible for:

- choosing whether to delegate;
- redacting context;
- browsing/current fact collection;
- local file changes and shell commands;
- final verification and user-facing answer.

## Capability Map

Official docs identify these practical API surfaces:

- Chat Completions for general text, reasoning, coding, vision-capable models, tools, guardrails, and JSON mode.
- Structured Outputs for JSON/custom schemas; JSON mode still requires an explicit JSON instruction.
- Function calling/tool calling for connecting models to external functions controlled by the caller.
- Coding models: Codestral for code/FIM, Devstral for agentic software engineering.
- Vision for image understanding through chat completions; it does not generate images.
- Document AI/OCR for PDF/image/doc extraction and structured document workflows.
- Embeddings for text/code semantic search, RAG, clustering, classification, duplicate detection.
- Moderation/classifiers for safety and policy scoring.
- Audio/Voxtral for offline and realtime transcription, timestamps, diarization where supported.
- Batch for high-volume async requests across chat, FIM, embeddings, OCR, classifications, conversations, moderations, and audio transcription.
- Agents and Conversations for persistent agent workflows, handoffs, tools, and conversation state.
- Vibe Code is Mistral's own supervised coding agent product with file/shell/GitHub abilities; this Codex skill only emulates the safe snapshot-and-patch part through the API.

## Rate Limits and Free Mode

Mistral enforces limits on requests per second, tokens per minute, and tokens per month. The free/Experiment tier is intended for evaluation and prototyping with limited rate limits. Current exact limits are shown in the workspace admin area under `Admin > Limits`.

When limits are exceeded the API returns `429 Too Many Requests`. Monitor rate headers such as `X-RateLimit-Remaining` when present. Do not hardcode public quota numbers in integrations.

Scale/pay-as-you-go tiers increase limits automatically based on cumulative billing. Pricing varies by model and can change; verify on the official pricing page before cost-sensitive usage.

## Known Limitations To Respect

- Context windows vary by model; requests over context return `400 Bad Request`.
- Rate limits vary by subscription tier and model.
- Batch processing may not count against real-time rate limits, but this helper script uses real-time chat completions.
- The API is served from EU data centers by default according to current docs.

## Model Selection Heuristic

- `mistral-small-latest`: default for cheap/free-compatible first pass.
- `mistral-medium-latest`: better for agentic/coding/general reasoning.
- `mistral-large-latest`: strongest general synthesis when quality matters.
- `codestral-latest`: code completion/review if available on the account.
- `devstral-small-latest` or `devstral-latest`: software engineering tasks if available.
- Use `models` command to list what the current key can access.
