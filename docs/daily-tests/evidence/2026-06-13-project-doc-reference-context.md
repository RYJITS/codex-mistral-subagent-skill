Validated observations from this run:

- Capability under test: bounded public doc synthesis from real project docs.
- Source project: `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES`
- Source files used:
  - `README.md`
  - `docs/PROJECT_MAP.md`
  - `docs/QUICK_DECISION_GUIDE.md`
  - `docs/LOCAL_VALIDATION.md`
- Facts retained by useful model outputs:
  - main strategy: storyboard -> clean keyframes -> microclips start/end -> local generation with `Wan` or `LTX` -> visual QA -> `WebGL` integration
  - reading order for the bounded note:
    - `README.md`
    - `docs/PROJECT_MAP.md`
    - `docs/QUICK_DECISION_GUIDE.md`
    - `docs/LOCAL_VALIDATION.md`
  - routing:
    - `Wan` for longer or more style-heavy generation
    - `LTX` for short clips and fast iteration
    - `WebGL` for preview or interactive web integration
  - QA command to preserve exactly:
    - `python scripts/generate_contact_sheet.py --input frames/ --output contact_sheet.png --rows 4 --cols 3`
  - local validation points to preserve:
    - `git status --short`
    - required files
    - JSON validation
    - Markdown links
    - no secrets

Observed model behavior:

- `mistral-small-latest`: cheap and factually useful, but did not respect the strict JSON contract.
- `mistral-medium-3.5`: best balance for factual synthesis and concise French public phrasing, but still drifted on the strict JSON contract.
- `devstral-latest`: useful for repo-aware phrasing, but also drifted on the strict JSON contract.
- `mistral-large-latest`: higher-cost prose attempt, but not retained as the best applied output here.

Target reference file:

- `mistral-subagent/references/project-doc-synthesis-fr.md`

Reference purpose:

- Teach future Codex runs how to delegate a bounded maintainer note from real project docs.
- Keep the note French-first and ASCII only.
- Mention that Markdown drafting worked better than schema-first JSON on this task.
