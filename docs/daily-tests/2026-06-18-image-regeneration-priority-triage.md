# Test quotidien 2026-06-18 - triage multi-images C2R vers priorites de regeneration

## Statut

**Valide**

## Categorie de tache

Classification bornee de feedback post-generation et priorisation de regeneration sous oracle local strict.

## Pourquoi c'est important pour les projets reels

Le projet reel `D:\00_Cerveau_IA\Projet\05_Generateur image C2R` enregistre des retours via `POST /api/feedback`. Quand plusieurs images d'un meme batch sont rejetables ou presque utiles, Codex doit choisir quoi regenerer immediatement, quoi corriger d'abord, et quoi garder comme controle visuel. Si Mistral tient ce triage sous schema ferme, une part recurrente du QA manuel devient delegable avant verification locale.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
  - `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- Capacite testee:
  - lire `4` feedbacks de rejet compatibles avec le flux `POST /api/feedback`
  - ordonner les cas par priorite de regeneration
  - attribuer un bucket borne et une action bornee par cas
  - produire une action prompt-side compacte en anglais quand une regeneration est justifiee
  - passer un oracle local strict sur l'ordre, les buckets, les actions, et les signaux obligatoires de `prompt_action_en`

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

Routage conseille par le helper:

- `recommend`: `mistral-small-latest`
- `select-model`: `mistral-small-latest`

Modeles retenus pour la reference appliquee:

- `mistral-small-latest` comme option economique par defaut
- `mistral-medium-3.5` comme option de synthese plus confortable

## Resume des prompts et du contexte

- Contexte borne:
  - extrait public du preset `versions/v6-exact-100`
  - contraintes utiles du `promptLock`
  - flux reel `POST /api/feedback`
  - `4` cas de rejet reel-simules: anatomie/cadrage critique, profondeur/emotion, derive textile+accessoire, image a garder comme controle
- Sortie imposee:
  - JSON strict avec `task`, `batch_id`, `cases`, `rank`, `priority_bucket`, `next_action`, `keep_for_reference`, `prompt_action_en`, `reason_fr`
- Contrat mecanique:
  - ordre exact des ids par priorite
  - buckets limites a `p0_immediate_regen`, `p1_prompt_fix_then_regen`, `p2_hold_control`
  - actions limitees a `regenerate_now`, `edit_prompt_then_regenerate`, `keep_as_control`
  - `prompt_action_en` compact avec signaux exacts par cas

## Usage et tokens

Sorties de triage validees:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 2299 | 545 | 2844 | Valide |
| `mistral-medium-3.5` | 2299 | 601 | 2900 | Valide |
| `mistral-large-latest` | 2299 | 569 | 2868 | Valide |
| `devstral-latest` | 2299 | 549 | 2848 | Valide |

Sorties documentaires retenues:

| Modele | Usage | Prompt | Completion | Total | Verdict |
|---|---|---:|---:|---:|---|
| `mistral-small-latest` | Brouillon de rapport quotidien | 1462 | 1208 | 2670 | Retenu et normalise |
| `mistral-small-latest` | Brouillon de reference skill | 643 | 314 | 957 | Retenu et normalise |

Sortie non retenue:

- `mistral-medium-3.5` brouillon de rapport: `finish_reason = length`, donc non compte comme utile

Total utile retenu: `15087` tokens.

## Resultat

Validation positive sous verification Codex.

- Les `4` modeles ont retourne le bon ordre de priorite, les bons buckets, les bonnes actions, et des `prompt_action_en` compatibles avec l'oracle local.
- `mistral-small-latest` est suffisant pour ce cas si le schema JSON est strict et si Codex garde un validateur local.
- `mistral-medium-3.5` reste utile quand la justification FR doit etre un peu plus lisible, mais n'apporte pas ici de gain necessaire sur la decision de triage elle-meme.
- `mistral-large-latest` et `devstral-latest` ont aussi passe, mais sans avantage net par rapport au cout ou a la simplicite du routage.
- Le workflow retenu a ete capitalise dans `mistral-subagent/references/image-regeneration-priority-triage-fr.md`.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Classer quatre feedbacks de generation image C2R en priorites de regeneration bornees et actions prompt-side compactes, en JSON strict, pour choisir quoi regenerer maintenant, quoi corriger d abord, et quoi garder comme controle."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Classer quatre feedbacks de generation image C2R en priorites de regeneration bornees et actions prompt-side compactes, en JSON strict, pour choisir quoi regenerer maintenant, quoi corriger d abord, et quoi garder comme controle."
```

Delegation:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-context.md" --model mistral-small-latest --max-tokens 1200 --temperature 0.1 --json
```

Verification locale:

```powershell
node docs/daily-tests/evidence/2026-06-18-validate-image-regeneration-priority.mjs docs/daily-tests/evidence/2026-06-18-mistral-small-latest-image-regeneration-priority.json docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-image-regeneration-priority.json docs/daily-tests/evidence/2026-06-18-mistral-large-latest-image-regeneration-priority.json docs/daily-tests/evidence/2026-06-18-devstral-latest-image-regeneration-priority.json
npm run validate
npm run check:helper
```

## Limitations

- L'oracle valide la priorisation, les buckets, et les actions prompt-side, pas la qualite esthetique finale des images.
- Le workflow reste borne a un batch court de `4` cas et a un preset connu.
- Les raisons `reason_fr` restent libres tant qu'elles sont non vides; la valeur appliquee ici est la decision de triage, pas la formulation exacte.
- Codex garde la verification locale, l'edition des presets, les relances reelles, et le tri final si plusieurs batches se chevauchent.

## Prochaine action

Tester une capacite voisine de QA recurrente, par exemple le triage multi-batches en fenetres de regeneration ou la conversion d'un rejet en patch borne de preset/negative list.

## Contribution vers l'objectif des 70 pourcent

Oui.

Cette capacite compte vers l'objectif, car le triage de plusieurs rejets d'un meme batch vers un ordre de regeneration et des actions prompt-side est recurrent dans `05_Generateur image C2R` et a ete valide ici avec un oracle local strict avant integration par Codex. Estimation cumulative apres ce run: **84 pourcent** de couverture des taches recurrentes delegables vers Mistral.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-check.json`
- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-recommend.json`
- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-select-model.json`
- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-context.md`
- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-latest-image-regeneration-priority.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-image-regeneration-priority.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-large-latest-image-regeneration-priority.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-latest-image-regeneration-priority.json`
- `docs/daily-tests/evidence/2026-06-18-validate-image-regeneration-priority.mjs`
- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-report-context.md`
- `docs/daily-tests/evidence/2026-06-18-image-regeneration-priority-reference-context.md`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-latest-image-regeneration-priority-report-draft.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-latest-image-regeneration-priority-reference-draft.json`
