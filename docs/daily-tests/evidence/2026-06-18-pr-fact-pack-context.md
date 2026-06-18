# Public diff context for bounded PR fact pack

Commit target: 0afb9c84a947ff81145bdfa25189711321ab6ea1

## Commit metadata

```text
0afb9c84a947ff81145bdfa25189711321ab6ea1
lab mistral jour 15: valider le triage de feedback image C2R
```

## Shortstat

```text
22 files changed, 906 insertions(+), 3 deletions(-)
```

## Files intentionally included

- docs/daily-tests/2026-06-15-image-feedback-triage.md
- mistral-subagent/references/image-feedback-triage-fr.md
- mistral-subagent/SKILL.md

## Bounded diff

```diff
commit 0afb9c84a947ff81145bdfa25189711321ab6ea1
Author:     Codex <codex@local>
AuthorDate: Mon Jun 15 08:12:16 2026 +0200
Commit:     Codex <codex@local>
CommitDate: Mon Jun 15 08:12:16 2026 +0200

    lab mistral jour 15: valider le triage de feedback image C2R

diff --git a/docs/daily-tests/2026-06-15-image-feedback-triage.md b/docs/daily-tests/2026-06-15-image-feedback-triage.md
new file mode 100644
index 0000000..4546184
--- /dev/null
+++ b/docs/daily-tests/2026-06-15-image-feedback-triage.md
@@ -0,0 +1,163 @@
+# Test quotidien 2026-06-15 - triage de feedback image C2R vers corrections de prompt
+
+## Statut
+
+**Valide**
+
+## Categorie de tache
+
+Classification bornee de feedback post-generation et conversion en corrections de prompt actionnables, sous JSON strict et oracle local.
+
+## Pourquoi c'est important pour les projets reels
+
+Le projet reel `D:\00_Cerveau_IA\Projet\05_Generateur image C2R` enregistre des retours via `POST /api/feedback`. Dans ce flux, Codex doit souvent relire un rejet, diagnostiquer la derive visuelle, puis reorienter le prompt sans casser le `promptLock` ni la negative list. Si Mistral tient ce format de triage, une part recurrente du QA prompt-side devient delegable avant verification locale.
+
+## Projet et capacite testes
+
+- Projets source:
+  - `D:\00_Cerveau_IA`
+  - `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
+  - `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
+- Capacite testee:
+  - lire `3` feedbacks FR de rejet compatibles avec le flux reel `POST /api/feedback`
+  - classifier chaque cas dans un diagnostic borne
+  - produire une correction `prompt_fix_en` compacte, reutilisable, et compatible avec `v6-exact-100`
+  - n'ajouter des `negative_additions` que pour des derives specifiques au cas
+  - passer un oracle local strict sur FACS, angle, profondeur, et contraintes de sortie
+
+## Modeles testes
+
+- `mistral-small-latest`
+- `mistral-medium-3.5`
+- `mistral-large-latest`
+- `devstral-latest`
+
+Modele utilise pour la reference appliquee:
+
+- `mistral-medium-3.5`
+
+## Resume des prompts et du contexte
+
+- Contexte borne:
+  - extrait public du preset `versions/v6-exact-100`
+  - contraintes publiques du `promptLock`
+  - negative list globale deja geree par le generateur
+  - `3` cas de rejet FR: profondeur/pose plate, derive textile+prop, expression+decor ferme
+  - `3` diagnostics autorises seulement
+- Premier prompt:
+  - JSON strict avec `task`, `cases`, `diagnosis`, `severity`, `keep_prompt_lock`, `prompt_fix_en`, `negative_additions`, `fit_note_fr`
+  - contrat trop libre sur certaines formulations cibles
+- Retry valide:
+  - fragments litteraux obligatoires par cas dans `prompt_fix_en`
+  - termes exacts imposes pour les `negative_additions` critiques
+- Validation locale:
+  - script `docs/daily-tests/evidence/2026-06-15-validate-image-feedback-triage.mjs`
+  - comparaison mecanique sur les signaux obligatoires et les labels attendus
+
+## Usage et tokens
+
+Premier passage, non retenu comme utile:
+
+| Modele | Prompt | Completion | Total | Verdict |
+|---|---:|---:|---:|---|
+| `mistral-small-latest` | 1686 | 401 | 2087 | Non valide |
+| `mistral-medium-3.5` | 1686 | 437 | 2123 | Non valide |
+| `mistral-large-latest` | 1686 | 485 | 2171 | Non valide |
+| `devstral-latest` | 1686 | 420 | 2106 | Non valide |
+
+Retry retenu comme utile:
+
+| Modele | Prompt | Completion | Total | Verdict |
+|---|---:|---:|---:|---|
+| `mistral-small-latest` | 1957 | 421 | 2378 | Valide |
+| `mistral-medium-3.5` | 1957 | 435 | 2392 | Valide |
+| `mistral-large-latest` | 1957 | 516 | 2473 | Valide |
+
+Run de reference appliquee:
+
+| Modele | Prompt | Completion | Total | Usage |
+|---|---:|---:|---:|---|
+| `mistral-medium-3.5` reference | 586 | 328 | 914 | Brouillon utile, corrige puis applique |
+
+Tokens Mistral utiles retenus:
+
+- `mistral-small-latest` retry: `2378`
+- `mistral-medium-3.5` retry: `2392`
+- `mistral-large-latest` retry: `2473`
+- `mistral-medium-3.5` reference: `914`
+
+Total utile retenu: `8157` tokens.
+
+Sorties non retenues:
+
+- tout le premier passage, y compris `devstral-latest`, car les sorties restaient utiles mais pas assez strictes pour l'oracle local
+
+## Resultat
+
+Validation positive sous verification Codex.
+
+- Le premier prompt a montre que Mistral comprend bien le diagnostic general, mais qu'un contrat trop libre n'est pas assez mecanique pour etre compte.
+- Le retry plus literal a permis a `mistral-small-latest`, `mistral-medium-3.5`, et `mistral-large-latest` de passer l'oracle strict.
+- `mistral-medium-3.5` est le meilleur defaut: meme niveau de conformite que `mistral-large-latest`, cout plus bas, structure plus sobre.
+- `mistral-small-latest` devient une option economique viable si Codex garde le retry litteral et le validateur.
+- Le workflow retenu a ete capitalise dans `mistral-subagent/references/image-feedback-triage-fr.md`.
+
+## Commandes de validation
+
+Configuration et routage:
+
+```powershell
+node mistral-subagent/scripts/mistral-subagent.mjs check
+node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Classifier trois feedbacks de generation image C2R en diagnostics bornes et corrections de prompt actionnables, en JSON strict, sans reecrire le promptLock ni la negative list globale."
+node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Classifier trois feedbacks de generation image C2R en diagnostics bornes et corrections de prompt actionnables, en JSON strict, sans reecrire le promptLock ni la negative list globale."
+```
+
+Delegation:
+
+```powershell
+$prompt = Get-Content "docs/daily-tests/evidence/2026-06-15-image-feedback-triage-retry-prompt.txt" -Raw
+node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-15-image-feedback-triage-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.1 --json
+```
+
+Verification locale:
+
+```powershell
+node "docs/daily-tests/evidence/2026-06-15-validate-image-feedback-triage.mjs" "docs/daily-tests/evidence/2026-06-15-mistral-small-latest-image-feedback-triage-retry.json" "docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-triage-retry.json" "docs/daily-tests/evidence/2026-06-15-mistral-large-latest-image-feedback-triage-retry.json"
+npm run validate
+npm run check:helper
+```
+
+## Limitations
+
+- Ce workflow ne juge pas la qualite finale d'une image; il structure seulement la correction de prompt a partir d'un rejet borne.
+- Le premier prompt libre ne suffit pas toujours, meme quand la comprehension semantique est bonne.
+- `devstral-latest` est utile pour cadrer la tache, mais n'a pas tenu l'oracle strict dans ce run.
+
+## Prochaine action
+
+Tester une capacite recurrente voisine dans les projets reels, par exemple la classification bornee de feedback multi-images en priorites de regeneration ou le triage de corrections prompt-vers-negative-list.
+
+## Contribution vers l'objectif des 70 pourcent
+
+Oui.
+
+Cette capacite compte vers l'objectif, car le triage de retours image et la preparation de corrections de prompt sont recurrentes dans le projet C2R et ont ete valides ici avec un oracle local strict avant integration par Codex. Estimation cumulative apres ce run: **82 pourcent** de couverture des taches recurrentes delegables vers Mistral.
+
+## Fichiers de preuve
+
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-context.md`
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-prompt.txt`
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-retry-prompt.txt`
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-recommend.json`
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-select-model.json`
+- `docs/daily-tests/evidence/2026-06-15-mistral-small-latest-image-feedback-triage.json`
+- `docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-triage.json`
+- `docs/daily-tests/evidence/2026-06-15-mistral-large-latest-image-feedback-triage.json`
+- `docs/daily-tests/evidence/2026-06-15-devstral-latest-image-feedback-triage.json`
+- `docs/daily-tests/evidence/2026-06-15-mistral-small-latest-image-feedback-triage-retry.json`
+- `docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-triage-retry.json`
+- `docs/daily-tests/evidence/2026-06-15-mistral-large-latest-image-feedback-triage-retry.json`
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-validation-summary.json`
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-reference-context.md`
+- `docs/daily-tests/evidence/2026-06-15-image-feedback-reference-prompt.txt`
+- `docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-reference.json`
diff --git a/mistral-subagent/SKILL.md b/mistral-subagent/SKILL.md
index 2dc0ed4..b8964d7 100644
--- a/mistral-subagent/SKILL.md
+++ b/mistral-subagent/SKILL.md
@@ -107,5 +107,6 @@ node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs
    - for custom preflight `allow`/`redact`/`block` screening, prefer `mistral-small-latest` or `mistral-medium-3.5`, then treat `mistral-moderation-2603` on `POST /v1/moderations` as an extra PII/moderation signal rather than the final policy decision.
    - for bounded repo-note translation with locked literals and an oracle JSON, `mistral-small-latest` is enough for the first pass; use `mistral-medium-3.5` or `mistral-large-latest` for public-facing verification, and do not rely on `recommend` alone when `repo` wording makes the heuristic overly conservative.
-   - for bounded public documentation generation, prefer a direct Markdown output with exact headings instead of a large JSON wrapper; on the validated lab run, `devstral-latest` and `mistral-medium-3.5` were the most reliable pair.
+   - for bounded release notes from exact commits and daily reports, prefer strict JSON first; `mistral-medium-3.5` is the best default, `mistral-small-latest` is a cheap fallback, `devstral-latest` is a good repo-aware alternative, and `mistral-large-latest` should be used only after local checks because it may drift on length even when facts stay correct.
+   - for bounded C2R image rejection feedback triage, prefer `mistral-medium-3.5` first, keep a strict JSON schema plus a local oracle, and be ready to issue a second more literal prompt when the first pass is semantically right but not mechanical enough.
 5. Run the script. Prefer low temperature for extraction, classification, code review, and JSON.
 6. Treat Mistral output as advisory. Codex verifies facts, code, citations, and local fit before editing files or answering.
@@ -159,6 +160,7 @@ Read these only when needed:
 - `references/mistral-api.md`: official endpoints, rate limits, model capabilities, limitations, and source links.
 - `references/mistral-task-matrix.md`: compact task matrix for deciding what to delegate.
+- `references/image-feedback-triage-fr.md`: French workflow for classifying bounded C2R image rejection feedback into prompt corrections verified by a local oracle.
 - `references/json-extraction-maintenance-fr.md`: French workflow for turning a maintenance brief into strict JSON Codex can validate directly.
-- `references/project-doc-synthesis-fr.md`: French workflow for drafting a bounded maintainer note from real project docs when direct Markdown works better than strict JSON.
+- `references/release-notes-from-git-fr.md`: French workflow for drafting bounded public release notes from exact commits and exact daily-test evidence.
 - `references/review-comment-triage-fr.md`: French workflow for classifying bounded review comments into `apply_now`, `needs_human`, and `reject`.
 - `references/structured-doc-translation-fr.md`: French workflow for translating a bounded public repo note while preserving exact operational strings.
diff --git a/mistral-subagent/references/image-feedback-triage-fr.md b/mistral-subagent/references/image-feedback-triage-fr.md
new file mode 100644
index 0000000..d25b902
--- /dev/null
+++ b/mistral-subagent/references/image-feedback-triage-fr.md
@@ -0,0 +1,51 @@
+# Triage de feedback image C2R vers corrections de prompt
+
+## Quand l'utiliser
+
+Utiliser ce workflow quand Codex doit transformer un feedback de rejet d'image du projet `D:\00_Cerveau_IA\Projet\05_Generateur image C2R` en diagnostic borne plus correction de prompt reutilisable, sans reecrire le `promptLock` ni la negative list globale.
+
+Cas typiques:
+
+- image jugee trop plate ou collee au decor;
+- derive textile ou accessoire parasite dans une tenue en impasto;
+- expression trop neutre, yeux presque fermes, ou decor trop ferme.
+
+## Modele conseille
+
+- Defaut: `mistral-medium-3.5`
+- Option economique: `mistral-small-latest`
+- Option de polissage avec meme oracle: `mistral-large-latest`
+
+Sur le run valide du `2026-06-15`, ces `3` modeles ont passe l'oracle strict apres un retry plus literal. `devstral-latest` a produit un JSON utile en premiere passe, mais non assez strict pour etre compte comme valide sur ce cas.
+
+## Prompt recommande
+
+Envoyer a Mistral:
+
+- un contexte public minimal sur le preset actif, ici `versions/v6-exact-100`;
+- les labels de diagnostic autorises;
+- des feedbacks FR bornes de type `rejected`;
+- un schema JSON ferme avec `task`, `cases`, `diagnosis`, `severity`, `keep_prompt_lock`, `prompt_fix_en`, `negative_additions`, `fit_note_fr`.
+
+Si la premiere passe est trop libre, faire un retry litteral avec les fragments exacts a garder dans `prompt_fix_en`, par exemple:
+
+- code FACS exact;
+- angle exact;
+- profondeur `foreground`, `mid-ground`, `far background`;
+- formulation explicite comme `open space`, `no fabric logic`, `open eyes`, ou `open solar architecture`.
+
+## Checks locaux minimum
+
+- `task` vaut exactement `c2r_feedback_triage`
+- `cases` contient exactement les `3` ids attendus dans le bon ordre
+- `diagnosis` correspond au cas attendu
+- `severity` vaut `high`
+- `keep_prompt_lock` vaut `true`
+- `prompt_fix_en` conserve le code FACS, l'angle, et les depth cues obligatoires
+- `negative_additions` reste court et n'ajoute que des blocages specifiques au cas
+
+## Limites
+
+- Une premiere passe trop generale reste souvent insuffisante pour un oracle mecanique; le retry plus literal est donc normal sur ce type de tache.
+- Ce workflow prepare des corrections de prompt, pas une decision finale de publication d'image.
+- Codex garde toujours la verification locale, l'edition des presets, et l'integration dans le projet source.
```
