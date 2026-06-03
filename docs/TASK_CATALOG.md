# Task Catalog for Mistral Delegation

This catalog outlines tasks suitable for delegation to Mistral models, categorized by model type and task complexity.

## Model-Specific Task Guidelines

### mistral-small-latest
- **Best For**: Routine text tasks, summarization, extraction, classification, and first-pass drafting.
- **Examples**:
  - Summarize meeting notes or articles.
  - Extract key entities or actions from text.
  - Classify documents or records.
  - Generate simple JSON structures from text.

### mistral-medium-latest
- **Best For**: Stronger reasoning, synthesis, and multimodal analysis.
- **Examples**:
  - Project audits and documentation generation.
  - Richer synthesis of complex information.
  - Multimodal analysis (text + structured data).

### mistral-large-latest
- **Best For**: High-quality, public-facing outputs or complex synthesis.
- **Examples**:
  - Complex synthesis tasks requiring nuanced understanding.
  - High-value second opinions or reviews.
  - Public-facing content generation.

### devstral-latest
- **Best For**: Agentic software engineering tasks.
- **Examples**:
  - Repository audits and patch planning.
  - Task decomposition for software projects.
  - Codebase analysis and improvement proposals.

### codestral-latest
- **Best For**: Code generation, review, and fill-in-middle tasks.
- **Examples**:
  - Code snippet generation.
  - Code review and quality assessment.
  - Fill-in-middle code completion.

### mistral-ocr-latest
- **Best For**: OCR and document extraction tasks.
- **Examples**:
  - Extract text from images or scanned documents.
  - Document layout analysis.

### mistral-embed
- **Best For**: Embeddings for semantic search or retrieval.
- **Examples**:
  - Generate embeddings for text or code.
  - Semantic search and retrieval tasks.

### mistral-moderation-latest
- **Best For**: Safety and moderation scoring.
- **Examples**:
  - Content moderation and safety scoring.
  - Compliance and policy adherence checks.

### voxtral-mini-latest
- **Best For**: Audio transcription tasks.
- **Examples**:
  - Transcribe audio files to text.
  - Audio content analysis.

## General Task Categories

### Text and Structured Data Tasks
- Summarization
- Extraction
- Classification
- Translation
- Rewriting
- Structured JSON drafting

### Code and Development Tasks
- Code explanation
- Code review
- Small code generation
- Prompt drafting
- API payload drafting

### Project and Documentation Tasks
- Project audits
- Documentation generation
- GitHub metadata drafting
- Simple patches

### Brainstorming and Ideation
- Ideation
- Comparison
- Second opinions

## Task Suitability Checklist

- **Suitable for Mistral**:
  - Bounded, text-centric tasks.
  - Tasks with minimal context requirements.
  - Non-sensitive, non-destructive tasks.
  - Tasks where Mistral's strengths (text generation, code review) are applicable.

- **Not Suitable for Mistral**:
  - Direct file edits, shell commands, deployments.
  - High-stakes decisions without verification.
  - Tasks requiring broad local context.
  - Tasks exposing secrets or sensitive data.
