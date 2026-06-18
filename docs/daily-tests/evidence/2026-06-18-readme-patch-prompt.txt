Return only valid JSON with this exact shape:
{
  "target_file": "README.md",
  "insert_after_heading": "### Project Scan",
  "patch_markdown": "string",
  "why_it_matters_fr": "string",
  "validation_commands": ["npm run validate", "npm run check:helper"],
  "risk_notes_fr": ["string"]
}

Rules:
- `target_file` must be exactly `README.md`.
- `insert_after_heading` must be exactly `### Project Scan`.
- `patch_markdown` must be ASCII only and in English.
- `patch_markdown` must be a compact block that can be inserted directly after the existing `### Project Scan` code block.
- `patch_markdown` must contain both required literal commands exactly as provided in the context.
- `patch_markdown` must mention that `--no-content` is for a metadata-only scan.
- `patch_markdown` must not mention any unsupported flag beyond `--no-content` and `--max-files 20`.
- `validation_commands` must stay exactly `npm run validate` and `npm run check:helper`.
- `risk_notes_fr` must stay short and must not invent repo risks.
- Do not wrap the JSON in Markdown.
