Daily test date: `2026-06-13`

Capability tested:

- bounded public doc synthesis from real project docs

Source project and why it matters:

- `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES`
- This project is part of the user's real video, WebGL, QA, and documentation workflow.
- A delegated maintainer note is useful when Codex must quickly orient itself in a real project before edits or validation.

Models tested:

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`
- retry on `mistral-medium-3.5`
- retry on `mistral-large-latest`
- reference draft on `mistral-medium-3.5`
- reference draft on `mistral-large-latest`

Validation summary:

- Strict JSON contract: failed on every tested model.
- Factual doc-draft usefulness:
  - useful: `mistral-small-latest`, `mistral-medium-3.5`, `devstral-latest`
  - not retained: `mistral-large-latest` initial draft, `mistral-medium-3.5` retry, `mistral-large-latest` retry
- Retained applied output:
  - `mistral-medium-3.5` Markdown reference draft, normalized by Codex into `mistral-subagent/references/project-doc-synthesis-fr.md`

Useful token totals exposed by saved outputs:

- `mistral-small-latest` initial draft: `1077`
- `mistral-medium-3.5` initial draft: `1010`
- `devstral-latest` initial draft: `1041`
- `mistral-medium-3.5` reference draft: `1285`

Useful retained total:

- `4413`

Rejected or not counted as validated:

- `mistral-large-latest` initial draft: facts not retained as best applied output
- `mistral-medium-3.5` retry: missed `docs/QUICK_DECISION_GUIDE.md`
- `mistral-large-latest` retry: missed `docs/QUICK_DECISION_GUIDE.md`
- strict JSON retries in general: schema drift remained
- `recommend` helper heuristic returned `suitable: false`, so it was informative but not counted as a validated Mistral output

Validation commands to mention:

- `node mistral-subagent/scripts/mistral-subagent.mjs check`
- `node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Generate a bounded French maintainer note for AI_VIDEO_WEBGL_COMPETENCES from public project docs while preserving exact file names, commands, and validation checks."`
- `node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Generate a bounded French maintainer note for AI_VIDEO_WEBGL_COMPETENCES from public project docs while preserving exact file names, commands, and validation checks."`
- `Get-Content docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-validation-summary.json -Raw | ConvertFrom-Json`
- `npm run validate`
- `npm run check:helper`

Final verdict guidance:

- Capability verdict should be `Partiellement valide`.
- Why: bounded doc synthesis worked as a direct Markdown drafting task, but the schema-first JSON contract was not reliable enough to count as a fully stable structured workflow.
- Contribution toward 70 percent objective: yes, but partial only. Keep cumulative estimate above target. Use `76 pourcent` after this run.

Next action:

- Test a different recurring capability with a clear oracle, ideally classification or planning that does not require a long Markdown structure.
