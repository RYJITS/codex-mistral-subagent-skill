# Model Selection Guide

Use this guide to choose the appropriate Mistral model for different tasks based on capability, cost, and context requirements.

## Current Model Families

- **mistral-small-latest**: Cheap and efficient for routine text tasks, summarization, classification, and first-pass drafting.
- **mistral-medium-latest**: Balanced performance for general reasoning, coding tasks, and structured JSON outputs.
- **mistral-medium-3.5**: Enhanced medium model for improved reasoning and coding tasks.
- **mistral-large-latest**: High-quality synthesis, complex reasoning, and high-stakes second opinions.
- **codestral-latest**: Specialized for code-focused tasks such as code review, completion, and generation.
- **devstral-latest**: Agentic software engineering tasks, suitable for more complex coding and development workflows.
- **magistral-medium-latest**: Optimized for moderate complexity tasks requiring a balance of speed and quality.
- **mistral-ocr-latest**: Optical Character Recognition (OCR) for extracting text from images and documents.
- **mistral-embed**: Generates embeddings for semantic search, clustering, and classification tasks.
- **codestral-embed**: Embeddings specifically tuned for code semantic search and analysis.
- **mistral-moderation-latest**: Content moderation and safety classification tasks.
- **voxtral-mini-latest**: Audio transcription and processing for speech-to-text tasks.

## Selection Heuristics

### By Task Type

- **Text Generation/Summarization/Classification**: `mistral-small-latest` (cheap), `mistral-medium-latest` (balanced), `mistral-large-latest` (high quality).
- **Code Review/Generation**: `codestral-latest`, `devstral-latest`, or `mistral-medium-latest`.
- **Structured JSON Outputs**: `mistral-medium-latest` or `mistral-large-latest` with explicit JSON instructions.
- **OCR/Document Processing**: `mistral-ocr-latest`.
- **Embeddings**: `mistral-embed` (general), `codestral-embed` (code-specific).
- **Moderation/Safety**: `mistral-moderation-latest`.
- **Audio Transcription**: `voxtral-mini-latest`.

### By Cost and Quota

- Use `mistral-small-latest` for high-volume, low-complexity tasks to conserve tokens.
- Reserve `mistral-large-latest` for tasks requiring high-quality synthesis or complex reasoning.
- Prefer batch processing for high-volume tasks to manage rate limits effectively.

### By Context Window

- Ensure the combined input and expected output fit within the model's context window. Larger models generally support larger contexts.
- For tasks requiring extensive context, consider chunking or summarizing input data.

## Best Practices

- **Start Small**: Begin with `mistral-small-latest` for initial passes and switch to larger models if quality is insufficient.
- **Explicit Instructions**: Clearly specify the desired output format (e.g., JSON) and task requirements.
- **Temperature**: Use lower temperatures for factual, code, and structured outputs; higher temperatures for creative tasks.
- **Token Management**: Monitor token usage to stay within rate limits and budget constraints.

## Rate Limit Considerations

- Mistral enforces rate limits based on requests per second, tokens per minute, and tokens per month.
- The free/Experiment tier has limited rate limits suitable for evaluation and prototyping.
- Scale tiers increase limits automatically based on cumulative billing.
- Always handle `429 Too Many Requests` responses gracefully and inform the user.

## Model Availability

Use the `models` command to list available models for the current API key:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs models
```

Choose models that are available and suitable for the task at hand.
