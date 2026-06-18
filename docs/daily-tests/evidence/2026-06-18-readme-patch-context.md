Capability under test: bounded small patch drafting for a public repo README.

Goal:
- Draft one small README patch for this repo.
- Scope is limited to `README.md`.
- Codex will verify and apply the result locally if it is useful.

Why this matters:
- The user runs many bounded repo maintenance tasks across `D:\00_Cerveau_IA`.
- A reusable Mistral workflow for small public doc patches would offload recurring Codex work.
- The patch must stay cheap, exact, and easy to validate.

Allowed facts from the repo:
- The helper usage includes `select-model --task <text>`.
- The helper parser accepts the boolean flag `--no-content`.
- The README currently documents `project-scan --path path/to/project --output path/to/output.json`.
- The README currently does not show a `select-model` example command.
- The README currently does not show a metadata-only `project-scan --no-content` example.
- Real validation commands visible in this repo are:
  - `npm run validate`
  - `npm run check:helper`

Hard constraints:
- Return ASCII only.
- Do not mention secrets, API keys, or private paths beyond the public repo paths already shown here.
- Do not invent commands, flags, files, headings, models, or validation steps.
- The patch must be English because the public README is English.
- The patch must fit under the existing `## Commands` section.
- The patch must be inserted after the `### Project Scan` heading block.
- The patch must not modify any file other than `README.md`.

Required literal commands:
1. `node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Audit this TypeScript project and propose patches"`
2. `node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs project-scan --path path/to/project --no-content --max-files 20 --output snapshot.json`

README excerpt:

```md
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
```

Helper excerpt:

```txt
Commands:
  recommend --task <text>
  select-model --task <text>
  quota-report --codex-baseline <n> --codex-current <n> --mistral-useful <n>
  run --task <text> [--context-file <path>] [--model <id>] [--system <text>] [--max-tokens <n>] [--temperature <n>] [--json] [--dry-run] [--env <path>]
  project-scan --path <project-path> [--max-files <n>] [--max-manifest <n>] [--max-file-bytes <n>] [--max-context-bytes <n>] [--output <path>]
  project-action --path <project-path> --goal <text> [--model <id>] [--max-files <n>] [--max-manifest <n>] [--max-file-bytes <n>] [--max-context-bytes <n>] [--max-tokens <n>] [--dry-run] [--output <path>]

if (["json", "dry-run", "help", "no-content"].includes(key)) {
  args[key] = true;
  continue;
}
```
