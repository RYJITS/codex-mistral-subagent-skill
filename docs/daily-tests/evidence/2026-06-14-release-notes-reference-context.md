# Reference context - bounded French release notes from Git evidence

## Capability

Draft a short French public release note from a bounded set of Git commits and daily reports, then let Codex verify the note against exact hashes, paths, and status counts.

## Validated findings from 2026-06-14

- `mistral-small-latest`: valid JSON, total tokens `2398`
- `mistral-medium-3.5`: valid JSON, total tokens `2400`
- `devstral-latest`: valid JSON, total tokens `2436`
- `mistral-large-latest`: invalid for this bounded contract because the summary was too long (`266` chars instead of `140` to `220`)

## Recommended default

- Default: `mistral-medium-3.5`
- Cheap fallback: `mistral-small-latest`
- Repo-aware alternative: `devstral-latest`
- Public polish only after validation: `mistral-large-latest`

## Required lessons

- Keep the context bounded to exact commits, exact report files, and exact status counts.
- Prefer strict JSON first, then convert to Markdown locally.
- Validate the output locally against ordered hashes, ordered file paths, and explicit status counts.
- Keep the failure and partial result visible in the final note; do not summarize only the successful items.
