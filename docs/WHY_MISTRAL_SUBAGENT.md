# Why Use mistral-subagent?

The `mistral-subagent` skill enables Codex to leverage Mistral AI as a subordinate helper for bounded, text-centric tasks. This document explains the value proposition, use cases, safety considerations, and proven experiments that make this skill useful.

## Value Proposition

### Cost-Effective Delegation

Mistral's API offers a **free/Experiment tier** with rate limits suitable for prototyping and low-volume tasks. For users on this tier, `mistral-subagent` provides a way to:

- Offload routine text tasks (summarization, extraction, classification) to a cheaper model.
- Experiment with different models without incurring high costs.
- Use Codex's token budget more efficiently by delegating bounded work to Mistral.

### Enhanced Productivity

By delegating suitable tasks to Mistral, Codex can:

- **Focus on High-Value Work**: Handle complex reasoning, verification, and integration while Mistral drafts or proposes solutions.
- **Speed Up Iterations**: Use Mistral for quick first passes, brainstorming, or second opinions.
- **Improve Output Quality**: Leverage Mistral's strengths in text generation, code review, and structured outputs.

### Safe and Controlled Workflow

The skill is designed to ensure safety and control:

- **No Direct Authority**: Mistral has no access to the filesystem, shell, or sensitive data.
- **Context Filtering**: Codex scans and filters project folders to exclude secrets and irrelevant content.
- **Verification**: Codex validates Mistral's output before applying changes or presenting results.

This makes `mistral-subagent` suitable for tasks where outsourcing is safe and beneficial.

## Use Cases

### Text and Structured Data Tasks

- **Summarization**: Condense long documents, meeting notes, or articles.
- **Extraction**: Pull out key actions, entities, or data points from text.
- **Classification**: Categorize records, emails, or issues.
- **Translation**: Translate text between languages.
- **Rewriting**: Improve clarity, tone, or style of existing text.
- **Structured JSON**: Generate or validate JSON from provided context.

### Code and Development Tasks

- **Code Explanation**: Explain code snippets or algorithms.
- **Code Review**: Get a second opinion on small diffs or code quality.
- **Small Code Generation**: Generate snippets, tests, or documentation.
- **Prompt Drafting**: Improve prompts for other models or agents.
- **API Payloads**: Draft or validate API request/response payloads.

### Project and Documentation Tasks

- **Project Audits**: Analyze a project folder for improvements (README, templates, CI).
- **Documentation**: Generate or improve READMEs, CONTRIBUTING guides, or issue templates.
- **GitHub Metadata**: Draft PR templates, SECURITY policies, or lightweight validation scripts.
- **Simple Patches**: Propose small, safe edits to documentation or configuration files.

### Brainstorming and Ideation

- **Ideation**: Generate ideas for features, blog posts, or marketing copy.
- **Comparison**: Compare documents, codebases, or proposals.
- **Second Opinions**: Get an external perspective before finalizing decisions.

## Safety and Limitations

### What Mistral Cannot Do

- **Direct File Edits**: Mistral cannot write to the filesystem. Codex applies changes locally after verification.
- **Shell Commands**: Mistral cannot execute commands or deployments.
- **Browser Actions**: Mistral cannot browse the web or interact with online services.
- **GitHub Operations**: Mistral cannot push to repositories or manage issues/PRs.
- **High-Stakes Decisions**: Mistral is not a substitute for authoritative sources in legal, medical, or financial contexts.

### What Codex Retains Control Over

- **Context Filtering**: Codex decides what context to send to Mistral.
- **Verification**: Codex validates Mistral's output before use.
- **Integration**: Codex applies changes, runs tests, and commits/pushes if requested.
- **Final Reporting**: Codex presents results to the user in a clear, concise manner.

## Proven Quota Experiment

The `mistral-subagent` skill includes a **Token-Saving Delegation Protocol** to optimize Mistral's usage while respecting rate limits. Heres how it works:

### Experiment Design

1. **Baseline Measurement**: Codex measures its own token usage for a task before delegating to Mistral.
2. **Narrow Tasks**: Codex sends focused, minimal tasks to Mistral to conserve tokens.
3. **Output Discipline**: Mistral's responses are written to files to avoid large stdout and save tokens.
4. **Validation**: Only applied, useful tokens are counted. Invalid or irrelevant outputs are excluded.
5. **Transparent Reporting**: The final token ratio is reported as `Codex delta / (Codex delta + useful Mistral tokens)`.

### Results

- **Efficiency**: The protocol ensures Mistral is used only for tasks where it is more token-efficient than Codex.
- **Reliability**: One-file batches and small context sizes improve output quality and reduce errors.
- **Cost Savings**: Users on free/Experiment tiers can delegate tasks without exceeding rate limits.

### Example Workflow

1. Codex identifies a task suitable for delegation (e.g., summarizing a document).
2. Codex measures its own token usage for the task.
3. Codex sends the task to Mistral with a minimal context.
4. Mistral generates a summary, which is written to a file.
5. Codex validates the summary and applies it if useful.
6. Codex reports the token ratio to the user.

## Model Selection Guide

Choose the right Mistral model for the task:

| Model                     | Best For                                                                                     |
|---------------------------|---------------------------------------------------------------------------------------------|
| `mistral-small-latest`    | Cheap, routine tasks (summarization, extraction, first passes).                            |
| `mistral-medium-latest`   | Stronger reasoning, synthesis, and multimodal analysis (project audits, documentation).    |
| `mistral-large-latest`    | High-quality, public-facing outputs or complex synthesis.                                  |
| `devstral-latest`         | Agentic software engineering (repository audits, patch planning, task decomposition).      |
| `codestral-latest`        | Code generation, review, and fill-in-middle tasks.                                         |
| `magistral-medium-latest` | Careful reasoning or step-by-step evaluations.                                             |
| `mistral-ocr-latest`      | OCR and document extraction tasks.                                                         |
| `mistral-embed`           | Embeddings for semantic search or retrieval.                                               |
| `mistral-moderation-latest`| Safety and moderation scoring.                                                             |
| `voxtral-mini-latest`     | Audio transcription tasks.                                                                 |

## Getting Started

1. **Install the Skill**: Copy the `mistral-subagent` folder to `~/.codex/skills/`.
2. **Configure API Key**: Set your Mistral API key in the environment or a local file.
3. **Assess a Task**: Use the `recommend` command to check if a task is suitable for Mistral.
4. **Run a Task**: Use the `run` command to delegate the task to Mistral.
5. **Validate Output**: Inspect Mistral's response before applying changes.

For more details, see the [README](README.md).
