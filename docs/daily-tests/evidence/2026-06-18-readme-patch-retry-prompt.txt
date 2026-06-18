Return only ASCII Markdown for a README patch block.

Rules:
- No JSON.
- No headings.
- Exactly two short English paragraphs.
- Exactly two `powershell` code blocks.
- The first paragraph must explain that `--no-content` is for a metadata-only scan before delegation.
- The second paragraph must explain that `select-model` previews the recommended Mistral model before `run`.
- Include these two commands exactly and in this order:

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs project-scan --path path/to/project --no-content --max-files 20 --output snapshot.json
```

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Audit this TypeScript project and propose patches"
```

- Do not mention any other command, flag, heading, or file.
