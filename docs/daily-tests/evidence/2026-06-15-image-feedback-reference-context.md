# Reference draft context - image feedback triage

Capability validated on `2026-06-15`:

- task: classify bounded French image-generation rejection feedback into strict diagnoses plus compact English prompt corrections
- real project source: `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- active preset family: `versions/v6-exact-100`
- protected constraints: do not rewrite the global negative list, do not rewrite the promptLock, keep corrections compact and directly reusable

Observed model behavior:

- first-pass prompt was too loose: `mistral-small-latest`, `mistral-medium-3.5`, `mistral-large-latest`, and `devstral-latest` returned useful JSON but missed some exact required signals
- retry prompt with literal fragments fixed the issue
- validated retry models:
  - `mistral-small-latest` total tokens `2378`
  - `mistral-medium-3.5` total tokens `2392`
  - `mistral-large-latest` total tokens `2473`
- `mistral-medium-3.5` is the best default because it matched the strict oracle with low verbosity and predictable structure

Local validation rules that mattered:

- exact task `c2r_feedback_triage`
- exact diagnosis labels for each case
- `severity=high`
- `keep_prompt_lock=true`
- exact FACS code preserved in `prompt_fix_en`
- depth cues and angle preserved
- compact `negative_additions` only for case-specific drift

Write a short French Markdown reference for future Codex runs.

Required sections:

- `#` title
- `## Quand l'utiliser`
- `## Modele conseille`
- `## Prompt recommande`
- `## Checks locaux minimum`
- `## Limites`

Keep it practical and concise. No code fences. No invented files or models.
