# Test quotidien 2026-06-18 - priorisation d'une file de feedbacks C2R

## Statut

**Valide**

## Categorie de tache

Classification bornee d'un lot multi-images vers une file de priorites de regeneration, sous JSON strict et oracle local.

## Pourquoi c'est important pour les projets reels

Le projet reel `D:\00_Cerveau_IA\Projet\05_Generateur image C2R` enregistre les retours de generation via `POST /api/feedback`. Avant de relancer un batch, Codex doit souvent trier plusieurs rejets et un ou deux candidats presque utiles. Si Mistral tient ce format de file de priorites, une part recurrente du QA prompt-side devient delegable avant verification locale.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
  - `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- Capacite testee:
  - lire `4` feedbacks C2R bornes d'un meme lot
  - classer chaque cas en `regen_now`, `regen_next_batch`, ou `keep_candidate`
  - ordonner la file par `priority_rank`
  - conserver un `reason_key` borne et un `prompt_focus_en` compact
  - passer un oracle local strict sur l'ordre, les buckets, les labels, et les signaux de prompt obligatoires

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

Modele retenu pour la reference appliquee:

- `mistral-medium-3.5`

## Resume des prompts et du contexte

- Contexte borne:
  - extrait public du flux `POST /api/feedback`
  - signaux publics du preset `v6-exact-100`
  - politique locale stricte de priorisation
  - `4` cas C2R: derive textile+objet, mur/profondeur, humeur molle sans violation dure, candidate deja valide
- Prompt principal:
  - JSON strict avec `task`, `version_id`, `queue`, `priority_rank`, `priority_bucket`, `reason_key`, `preserve_candidate`, `prompt_focus_en`, `fit_note_fr`
  - ordre exact impose sur les `4` `job_id`
  - taxonomie limitee a `3` buckets et `4` `reason_key`
- Validation locale:
  - script `docs/daily-tests/evidence/2026-06-18-validate-c2r-feedback-queue-prioritization.mjs`
  - comparaison mecanique des labels, rangs, booleens, et signaux requis

## Usage et tokens

Essais utiles retenus:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1662 | 406 | 2068 | Valide |
| `mistral-medium-3.5` | 1662 | 388 | 2050 | Valide |
| `mistral-large-latest` | 1662 | 425 | 2087 | Valide |
| `devstral-latest` | 1662 | 433 | 2095 | Valide |

Redaction de reference appliquee:

| Modele | Prompt | Completion | Total | Usage |
|---|---:|---:|---:|---|
| `mistral-medium-3.5` reference | 750 | 249 | 999 | Brouillon utile, normalise puis applique |

Tokens Mistral utiles retenus:

- `mistral-small-latest`: `2068`
- `mistral-medium-3.5`: `2050`
- `mistral-large-latest`: `2087`
- `devstral-latest`: `2095`
- `mistral-medium-3.5` reference: `999`

Total utile retenu: `9299` tokens.

Sorties non retenues:

- `recommend` et `select-model` ne sont pas comptes comme sorties utiles appliquees

## Resultat

Validation positive sous verification Codex.

- Les `4` modeles ont passe l'oracle strict au premier essai.
- `mistral-medium-3.5` est le meilleur defaut: meme conformite que `mistral-large-latest`, cout plus bas, structure plus sobre.
- `mistral-small-latest` devient une option economique credible sur cette tache.
- `devstral-latest` reste valide, mais sans gain clair face a `mistral-medium-3.5`.
- Le helper `recommend` a sous-estime cette tache avec `suitable=false` et `confidence=0.43`; sur ce type de triage C2R borne, il ne doit pas etre la seule base de decision.
- Le workflow retenu a ete capitalise dans `mistral-subagent/references/c2r-feedback-queue-prioritization-fr.md`.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check --env "D:\00_Cerveau_IA\API\env.Local"
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Classer un lot borne de feedbacks image C2R en priorites de regeneration verifiables, avec JSON strict, pour relancer un prochain batch dans le generateur image C2R." --env "D:\00_Cerveau_IA\API\env.Local"
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Classer un lot borne de feedbacks image C2R en priorites de regeneration verifiables, avec JSON strict, pour relancer un prochain batch dans le generateur image C2R." --env "D:\00_Cerveau_IA\API\env.Local"
```

Delegation:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-context.md" --model mistral-medium-3.5 --max-tokens 900 --temperature 0.1 --json --env "D:\00_Cerveau_IA\API\env.Local"
```

Verification locale:

```powershell
node "docs/daily-tests/evidence/2026-06-18-validate-c2r-feedback-queue-prioritization.mjs" "docs/daily-tests/evidence/2026-06-18-mistral-small-latest-c2r-feedback-queue-prioritization.json" "docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-c2r-feedback-queue-prioritization.json" "docs/daily-tests/evidence/2026-06-18-mistral-large-latest-c2r-feedback-queue-prioritization.json" "docs/daily-tests/evidence/2026-06-18-devstral-latest-c2r-feedback-queue-prioritization.json"
npm run validate
npm run check:helper
```

## Limitations

- Ce workflow trie des feedbacks texte bornes; il ne remplace pas une QA visuelle finale.
- La politique de priorisation doit etre deja explicitee par Codex.
- Le helper `recommend` peut sous-estimer cette famille de taches, surtout quand le vocabulaire combine `image`, `feedback`, et `generation`.

## Prochaine action

Tester une capacite voisine sur le meme flux, par exemple la conversion d'une file priorisee en mini-plan de regeneration multi-preset ou l'extraction de `negative additions` strictes a partir d'un lot mixte.

## Contribution vers l'objectif des 70 pourcent

Oui.

Cette capacite compte vers l'objectif, car la priorisation de lots de feedbacks image est recurrente dans le projet C2R et a ete validee ici avec un oracle local strict avant integration par Codex. Estimation cumulative apres ce run: **84 pourcent** de couverture des taches recurrentes delegables vers Mistral.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-context.md`
- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-expected.json`
- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-recommend.json`
- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-select-model.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-latest-c2r-feedback-queue-prioritization.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-c2r-feedback-queue-prioritization.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-large-latest-c2r-feedback-queue-prioritization.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-latest-c2r-feedback-queue-prioritization.json`
- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-reference-context.md`
- `docs/daily-tests/evidence/2026-06-18-c2r-feedback-queue-prioritization-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-c2r-feedback-queue-reference-draft.json`
- `docs/daily-tests/evidence/2026-06-18-validate-c2r-feedback-queue-prioritization.mjs`
