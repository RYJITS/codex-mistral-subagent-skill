# Delegation Playbook

This playbook outlines best practices for delegating tasks to Mistral as a subordinate model, incorporating lessons from quota experiments and real-world usage.

## Core Principles

1. **Codex Decides**: Always evaluate whether Mistral is suitable for the task before delegating.
2. **Minimal Context**: Send only the necessary context, redacted of secrets and irrelevant data.
3. **Structured Outputs**: Request specific JSON shapes or formats to ensure usable responses.
4. **Token Efficiency**: Optimize for token usage to respect rate limits and reduce costs.
5. **Validation**: Always verify Mistral's output before applying changes or presenting to the user.

## Workflow

### 1. Suitability Assessment

- Use the delegation rules in `SKILL.md` or the `recommend` command to assess task suitability.
- Propose delegation to the user if the task is optional but Mistral could add value.

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs recommend --task "Your task description"
```

### 2. Context Preparation

- Gather minimal, relevant context. Redact secrets, personal data, and unnecessary information.
- For project work, use `project-scan` to create a filtered snapshot.

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs project-scan --path D:\path\project --output D:\path\context.json
```

### 3. Model and Parameters

- Choose the smallest suitable model to conserve tokens (see `model-selection.md`).
- Set `temperature` low for factual, code, or JSON tasks; higher for creative tasks.
- Cap `max_tokens` to fit within the model's context window and avoid excessive output.

### 4. Dry Run (Optional)

- Perform a dry run to inspect the payload without consuming quota.

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "Task description" --dry-run
```

### 5. Execution

- Run the task with the chosen model and parameters.

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "Task description" --context-file D:\path\context.txt --model mistral-small-latest
```

### 6. Output Handling

- Parse and validate the response. For JSON outputs, ensure the structure matches expectations.
- Count only applied, useful tokens. Exclude invalid or truncated outputs from token counts.
- Suppress large stdout to save tokens during processing.

### 7. Integration

- For file changes, generate complete file content or precise patches. Apply changes locally after verification.
- For project actions, review proposed changes, files, and validation commands before applying.

## Lessons from Quota Experiments

### Reliable Batches

- **One-File Batches**: Process one file or task at a time for reliability and easier validation.
- **Small Context**: Limit context size with `--max-context-bytes` to stay within token budgets.

### Token Management

- **Count Applied Tokens**: Only count tokens from valid, applied outputs. Exclude invalid or truncated responses.
- **Low Token Tasks**: Prefer tasks that Mistral can complete with fewer tokens than Codex would use directly.

### Output Discipline

- **Structured JSON**: Always request and validate structured JSON outputs for programmatic use.
- **Complete Files**: Ask for complete file content rather than partial snippets to simplify integration.
- **Validation Commands**: Include safe, local validation commands in project action outputs.

### Rate Limit Handling

- Monitor rate limit headers and handle `429` responses gracefully.
- Inform the user clearly when rate limits are encountered.
- Use batch processing for high-volume tasks to manage rate limits effectively.

## Common Pitfalls

- **Overloading Context**: Sending too much context can exceed token limits and increase costs. Use filtering and summarization.
- **Ambiguous Instructions**: Unclear prompts lead to unusable outputs. Be explicit about format and requirements.
- **Ignoring Rate Limits**: Failing to handle rate limits can disrupt workflows. Always check and inform.
- **Skipping Validation**: Applying Mistral's output without verification risks errors. Always validate locally.

## Examples

### Summarization Task

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "Summarize the following text in 3 bullet points" --context-file D:\path\text.txt --model mistral-small-latest --max-tokens 300
```

### Code Review

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "Review this code snippet for potential bugs" --context-file D:\path\code.txt --model codestral-latest --temperature 0.3
```

### Project Action

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs project-action --path D:\path\project --goal "Improve the README with clear setup instructions" --model mistral-medium-latest --max-files 3 --max-tokens 800
```

## Validation and Safety

- **Local Tools**: Use standard shell/Git commands or built-in PowerShell for validation.
- **No Direct Writes**: Mistral generates files/patches; Codex applies them after inspection.
- **Risk Assessment**: Include risks and assumptions in project action outputs for Codex review.

By following this playbook, you ensure efficient, reliable, and safe delegation to Mistral, maximizing utility while respecting token and rate limits.
