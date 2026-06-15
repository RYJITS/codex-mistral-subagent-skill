# Test quotidien 2026-06-15 - triage de feedback image C2R vers corrections de prompt

## Statut

**Valide**

## Categorie de tache

Classification bornee de feedback post-generation et conversion en corrections de prompt actionnables, sous JSON strict et oracle local.

## Pourquoi c'est important pour les projets reels

Le projet reel `D:\00_Cerveau_IA\Projet\05_Generateur image C2R` enregistre des retours via `POST /api/feedback`. Dans ce flux, Codex doit souvent relire un rejet, diagnostiquer la derive visuelle, puis reorienter le prompt sans casser le `promptLock` ni la negative list. Si Mistral tient ce format de triage, une part recurrente du QA prompt-side devient delegable avant verification locale.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
  - `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- Capacite testee:
  - lire `3` feedbacks FR de rejet compatibles avec le flux reel `POST /api/feedback`
  - classifier chaque cas dans un diagnostic borne
  - produire une correction `prompt_fix_en` compacte, reutilisable, et compatible avec `v6-exact-100`
  - n'ajouter des `negative_additions` que pour des derives specifiques au cas
  - passer un oracle local strict sur FACS, angle, profondeur, et contraintes de sortie

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

Modele utilise pour la reference appliquee:

- `mistral-medium-3.5`

## Resume des prompts et du contexte

- Contexte borne:
  - extrait public du preset `versions/v6-exact-100`
  - contraintes publiques du `promptLock`
  - negative list globale deja geree par le generateur
  - `3` cas de rejet FR: profondeur/pose plate, derive textile+prop, expression+decor ferme
  - `3` diagnostics autorises seulement
- Premier prompt:
  - JSON strict avec `task`, `cases`, `diagnosis`, `severity`, `keep_prompt_lock`, `prompt_fix_en`, `negative_additions`, `fit_note_fr`
  - contrat trop libre sur certaines formulations cibles
- Retry valide:
  - fragments litteraux obligatoires par cas dans `prompt_fix_en`
  - termes exacts imposes pour les `negative_additions` critiques
- Validation locale:
  - script `docs/daily-tests/evidence/2026-06-15-validate-image-feedback-triage.mjs`
  - comparaison mecanique sur les signaux obligatoires et les labels attendus

## Usage et tokens

Premier passage, non retenu comme utile:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1686 | 401 | 2087 | Non valide |
| `mistral-medium-3.5` | 1686 | 437 | 2123 | Non valide |
| `mistral-large-latest` | 1686 | 485 | 2171 | Non valide |
| `devstral-latest` | 1686 | 420 | 2106 | Non valide |

Retry retenu comme utile:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1957 | 421 | 2378 | Valide |
| `mistral-medium-3.5` | 1957 | 435 | 2392 | Valide |
| `mistral-large-latest` | 1957 | 516 | 2473 | Valide |

Run de reference appliquee:

| Modele | Prompt | Completion | Total | Usage |
|---|---:|---:|---:|---|
| `mistral-medium-3.5` reference | 586 | 328 | 914 | Brouillon utile, corrige puis applique |

Tokens Mistral utiles retenus:

- `mistral-small-latest` retry: `2378`
- `mistral-medium-3.5` retry: `2392`
- `mistral-large-latest` retry: `2473`
- `mistral-medium-3.5` reference: `914`

Total utile retenu: `8157` tokens.

Sorties non retenues:

- tout le premier passage, y compris `devstral-latest`, car les sorties restaient utiles mais pas assez strictes pour l'oracle local

## Resultat

Validation positive sous verification Codex.

- Le premier prompt a montre que Mistral comprend bien le diagnostic general, mais qu'un contrat trop libre n'est pas assez mecanique pour etre compte.
- Le retry plus literal a permis a `mistral-small-latest`, `mistral-medium-3.5`, et `mistral-large-latest` de passer l'oracle strict.
- `mistral-medium-3.5` est le meilleur defaut: meme niveau de conformite que `mistral-large-latest`, cout plus bas, structure plus sobre.
- `mistral-small-latest` devient une option economique viable si Codex garde le retry litteral et le validateur.
- Le workflow retenu a ete capitalise dans `mistral-subagent/references/image-feedback-triage-fr.md`.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Classifier trois feedbacks de generation image C2R en diagnostics bornes et corrections de prompt actionnables, en JSON strict, sans reecrire le promptLock ni la negative list globale."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Classifier trois feedbacks de generation image C2R en diagnostics bornes et corrections de prompt actionnables, en JSON strict, sans reecrire le promptLock ni la negative list globale."
```

Delegation:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-15-image-feedback-triage-retry-prompt.txt" -Raw
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-15-image-feedback-triage-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.1 --json
```

Verification locale:

```powershell
node "docs/daily-tests/evidence/2026-06-15-validate-image-feedback-triage.mjs" "docs/daily-tests/evidence/2026-06-15-mistral-small-latest-image-feedback-triage-retry.json" "docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-triage-retry.json" "docs/daily-tests/evidence/2026-06-15-mistral-large-latest-image-feedback-triage-retry.json"
npm run validate
npm run check:helper
```

## Limitations

- Ce workflow ne juge pas la qualite finale d'une image; il structure seulement la correction de prompt a partir d'un rejet borne.
- Le premier prompt libre ne suffit pas toujours, meme quand la comprehension semantique est bonne.
- `devstral-latest` est utile pour cadrer la tache, mais n'a pas tenu l'oracle strict dans ce run.

## Prochaine action

Tester une capacite recurrente voisine dans les projets reels, par exemple la classification bornee de feedback multi-images en priorites de regeneration ou le triage de corrections prompt-vers-negative-list.

## Contribution vers l'objectif des 70 pourcent

Oui.

Cette capacite compte vers l'objectif, car le triage de retours image et la preparation de corrections de prompt sont recurrentes dans le projet C2R et ont ete valides ici avec un oracle local strict avant integration par Codex. Estimation cumulative apres ce run: **82 pourcent** de couverture des taches recurrentes delegables vers Mistral.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-context.md`
- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-prompt.txt`
- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-recommend.json`
- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-select-model.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-small-latest-image-feedback-triage.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-triage.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-large-latest-image-feedback-triage.json`
- `docs/daily-tests/evidence/2026-06-15-devstral-latest-image-feedback-triage.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-small-latest-image-feedback-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-large-latest-image-feedback-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-15-image-feedback-triage-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-15-image-feedback-reference-context.md`
- `docs/daily-tests/evidence/2026-06-15-image-feedback-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium-3.5-image-feedback-reference.json`
