Source project: `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES`

Public source files used for this bounded task:

1. `README.md`
2. `docs/PROJECT_MAP.md`
3. `docs/QUICK_DECISION_GUIDE.md`
4. `docs/LOCAL_VALIDATION.md`

Goal:

- Draft a short French ASCII maintainer note that helps Codex or a contributor orient themselves quickly in the project.
- This is a bounded docs synthesis task, not a broad repo audit.
- Do not invent commands, scripts, files, workflows, package managers, tests, CI jobs, URLs, or tools that are not present in the source excerpts below.

Verified source facts:

- `README.md` says the main strategy is: storyboard -> clean keyframes -> microclips start/end -> Wan2.2 or LTX local -> visual QA -> WebGL integration.
- `README.md` says the useful entry docs are `docs/PROJECT_MAP.md` and `docs/LOCAL_VALIDATION.md`.
- `docs/PROJECT_MAP.md` recommends this reading order:
  1. `README.md`
  2. `INSTALLATION.md`
  3. `CONCLUSIONS.md`
  4. `codex-skills/video-start-end/SKILL.md`
  5. `codex-skills/webgl-right-video/SKILL.md`
  6. `examples/README.md`
  7. `docs/LOCAL_VALIDATION.md`
- `docs/QUICK_DECISION_GUIDE.md` says:
  - use Wan for longer or more style-heavy video generation;
  - use LTX for short clips and fast iteration;
  - use WebGL for preview or interactive web integration;
  - use a contact sheet for QA when you need to inspect frames;
  - an example command is `python scripts/generate_contact_sheet.py --input frames/ --output contact_sheet.png --rows 4 --cols 3`
- `docs/LOCAL_VALIDATION.md` says the pre-PR checks include:
  - `git status --short`
  - verify required files exist
  - validate JSON files
  - verify Markdown links
  - do not commit secrets, local env files, generated caches, or unsupported commands

Target output constraints:

- French first, but ASCII only.
- Keep exact literals unchanged when they appear:
  - `README.md`
  - `docs/PROJECT_MAP.md`
  - `docs/QUICK_DECISION_GUIDE.md`
  - `docs/LOCAL_VALIDATION.md`
  - `git status --short`
  - `python scripts/generate_contact_sheet.py --input frames/ --output contact_sheet.png --rows 4 --cols 3`
  - `Wan`
  - `LTX`
  - `WebGL`
- The draft must stay concise and operational.
- If any detail is uncertain, keep the draft conservative and report the uncertainty in `invented_items` instead of guessing.
