# Safe Delegation Protocol

This document outlines the safe delegation protocol for using Mistral as a subordinate helper, including context filtering, verification, invalid output handling, and token-saving quota rules.

## Context Filtering

### Principles
- **Minimal Context**: Send only the necessary context for the task.
- **Redaction**: Remove secrets, personal data, and irrelevant information.
- **Filtering**: Use `project-scan` to create filtered snapshots for project work.

### Implementation
- **Secret Handling**: Exclude files with secret-like names or content.
- **File Types**: Skip binary files, build outputs, caches, and large files.
- **Scope**: Limit context to the user-authorized folder and relevant files.

## Verification

### Output Validation
- **Structured Outputs**: Request and validate specific JSON shapes.
- **Code Review**: Inspect code snippets or patches before application.
- **Fact Checking**: Verify facts, citations, and local fit.

### Integration
- **File Changes**: Generate complete file content or precise patches.
- **Local Application**: Apply changes locally after verification.
- **Testing**: Run relevant tests or checks before finalizing.

## Invalid Output Handling

### Detection
- **Malformed Outputs**: Check for incomplete or truncated responses.
- **Irrelevant Outputs**: Exclude outputs that do not address the task.
- **Validation Errors**: Reject outputs that fail validation checks.

### Recovery
- **Retry**: For transient issues, retry with adjusted parameters.
- **Fallback**: Use Codex for the task if Mistral fails repeatedly.
- **User Notification**: Inform the user of failures and actions taken.

## Token-Saving Quota Rules

### Principles
- **Efficiency**: Optimize token usage to respect rate limits.
- **Transparency**: Report token usage and savings clearly.
- **Accountability**: Count only applied, useful tokens.

### Implementation
- **Baseline Measurement**: Measure Codex token usage before delegation.
- **Narrow Tasks**: Send focused, minimal tasks to Mistral.
- **Output Discipline**: Write responses to files to avoid large stdout.
- **Token Counting**: Count only valid, applied outputs.
- **Batch Processing**: Use small, manageable batches.
- **Rate Limit Handling**: Monitor and handle rate limits gracefully.

### Reporting
- **Token Ratio**: Report the ratio as `Codex delta / (Codex delta + useful Mistral tokens)`.
- **Transparency**: Provide clear, concise reports to the user.

## Workflow

### 1. Suitability Assessment
- Use delegation rules or the `recommend` command.
- Propose delegation to the user if optional.

### 2. Context Preparation
- Gather minimal, relevant context.
- Redact secrets and irrelevant data.

### 3. Model and Parameters
- Choose the smallest suitable model.
- Set appropriate temperature and max tokens.

### 4. Execution
- Perform a dry run if needed.
- Run the task with chosen parameters.

### 5. Output Handling
- Parse and validate the response.
- Count only applied, useful tokens.

### 6. Integration
- Review and apply changes locally.
- Run validation commands and tests.

## Best Practices

- **One-File Batches**: Process one file or task at a time.
- **Small Context**: Limit context size to stay within token budgets.
- **Structured JSON**: Request and validate structured outputs.
- **Complete Files**: Ask for complete file content.
- **Validation Commands**: Include safe, local validation commands.

## Common Pitfalls

- **Overloading Context**: Exceeding token limits and increasing costs.
- **Ambiguous Instructions**: Leading to unusable outputs.
- **Ignoring Rate Limits**: Disrupting workflows.
- **Skipping Validation**: Risking errors and inconsistencies.

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

- **Local Tools**: Use standard shell/Git commands or built-in PowerShell.
- **No Direct Writes**: Mistral generates files/patches; Codex applies them.
- **Risk Assessment**: Include risks and assumptions for Codex review.
