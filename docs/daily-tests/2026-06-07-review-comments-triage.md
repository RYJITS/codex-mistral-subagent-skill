# Test quotidien 2026-06-07 - triage de commentaires de review en JSON actionnable

## Statut

**Valide**

## Categorie de tache

Triage de commentaires de review GitHub, classification actionnable en JSON strict, et garde-fous de repo public pour `apply`, `reply`, `reject`, et `clarify`.

## Pourquoi c'est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` passent regulierement par des retours de maintenance sur README, skills, helpers, et rapports de validation. Si Mistral peut faire une premiere passe fiable sur des commentaires de review, Codex peut deleguer une partie recurrente du triage des retours de PR tout en gardant la verification locale, la memoire, les commits, et les decisions finales.

## Projet et capacite testes

- Projets source de contexte:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - classer `8` commentaires de review en `apply`, `reply`, `reject`, ou `clarify`
  - detecter les cas critiques `already_present`, `invented_command`, `secret`, `factual_error`, et `scope_question`
  - produire un JSON suffisamment propre pour etre reutilise par Codex apres normalisation legere

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`
- retries stricts sur `mistral-medium-3.5`, `devstral-latest`, et `mistral-large-latest`

## Resume des prompts et du contexte

- Contexte initial transmis:
  - `8` commentaires de review inspires d'un vrai flux de maintenance repo public
  - faits verifies sur `package.json`, `README.md`, le chemin par defaut `D:\00_Cerveau_IA\API\env.Local`, et la contrainte de rapport FR
  - liste fermee de chemins autorises pour `target_paths`
- Prompt initial:
  - imposer un JSON strict avec `comment_actions`, `decision`, `safety_flag`, `target_paths`, et `reason_fr`
  - rappeler `apply`, `reply`, `reject`, et `clarify`
- Retry strict:
  - ajouter des preuves locales explicites sur le README, les scripts, et l'existence actuelle de `mistral-medium-3.5` le `2026-06-07`
  - forcer `reply` pour un point deja present, `reject` pour `npm test` absent, et `reject` pour la demande de toucher `env.Local`

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 955 | 575 | 1530 | Sur-applique `npm test`, le README, et la suppression de `mistral-medium-3.5` |
| `mistral-medium-3.5` | 955 | 605 | 1560 | Bon fond, mais manque `reply` sur le README |
| `devstral-latest` | 955 | 620 | 1575 | Triage trop instable au premier passage |
| `mistral-large-latest` | 955 | 614 | 1569 | Bon second avis, mais sur-applique encore deux points |
| `mistral-medium-3.5` retry | 1398 | 235 | 1633 | `8/8` decisions correctes apres normalisation |
| `devstral-latest` retry | 1398 | 405 | 1803 | `8/8` decisions correctes apres normalisation |
| `mistral-large-latest` retry | 1398 | 458 | 1856 | `8/8` decisions correctes apres normalisation |
| `mistral-medium-3.5` reference draft | 473 | 453 | 926 | Brouillon utile pour la nouvelle reference FR |
| `mistral-large-latest` reference draft | 74 | 900 | 974 | Hors sujet et tronque, non retenu |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5` retry: `1633`
- `devstral-latest` retry: `1803`
- `mistral-large-latest` retry: `1856`
- `mistral-medium-3.5` brouillon de reference: `926`

Total utile retenu: `6218` tokens.

Sorties exclues du comptage utile:

- tous les premiers passages, car le triage n'etait pas assez fiable sur `already_present` et `factual_error`
- le brouillon `mistral-large-latest` de reference, car hors sujet et tronque

## Resultat

Validation positive sous verification Codex.

- Sans preuves supplementaires, aucun modele ne tient un triage suffisamment strict pour compter la capacite comme validee.
- Avec extraits verifies du README, de `package.json`, et de `models`, `mistral-medium-3.5`, `devstral-latest`, et `mistral-large-latest` atteignent `8/8` decisions correctes apres normalisation legere du schema.
- Le point structurel le plus important est la distinction entre:
  - `reply` quand le repo couvre deja le point, par exemple `README.md` pour `MISTRAL.API_KEY`
  - `reject` pour une commande inventee comme `npm test`
  - `reject` pour un secret hors scope comme `D:\00_Cerveau_IA\API\env.Local`
  - `reject` pour un fait faux comme la disparition supposee de `mistral-medium-3.5` au `2026-06-07`

Sorties Mistral directement utilisees:

- `mistral-medium-3.5` retry comme base principale du triage valide
- `devstral-latest` retry comme confirmation repo-centrique
- `mistral-large-latest` retry comme second avis convergent
- `mistral-medium-3.5` pour le brouillon initial de `mistral-subagent/references/review-comments-triage-fr.md`, ensuite resserre et verifie par Codex

## Commandes de validation

Verification des faits repo:

```powershell
Get-Content package.json
Select-String -Path README.md -Pattern 'MISTRAL.API_KEY|MISTRALAI_API_KEY|MISTRAL_AI_API_KEY|MISTRAL_API_KEY|mistral-medium-3.5' -Context 2,2
node mistral-subagent/scripts/mistral-subagent.mjs models | Select-String -Pattern 'mistral-medium-3.5|mistral-medium-3-5|mistral-medium-2604' -Context 0,3
```

Appels Mistral:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-07-review-comments-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comments-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.05 --json

$retryPrompt = Get-Content docs/daily-tests/evidence/2026-06-07-review-comments-retry-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $retryPrompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comments-retry-full-context.md" --model devstral-latest --max-tokens 1200 --temperature 0.05 --json
```

Verification des sorties et du repo:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-07-review-comments-validation-summary.json -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Le workflow depend d'un contexte prouve; sans extraits explicites, les modeles sur-appliquent facilement un point deja present.
- Le schema des retries reste heterogene sur les champs non critiques des items `apply`; Codex doit normaliser legerement avant integration.
- Ce test couvre un lot borne de `8` commentaires, pas une PR large avec plusieurs centaines de lignes.

## Prochaine action

Tester une capacite specialisee encore non couverte avec oracle net, par exemple OCR/document extraction bornee ou moderation/classification exploitable dans les flux multi-projets.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour une famille recurrente de triage de retours de PR et de maintenance repo. Estimation cumulative apres ce run: **46 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-07-review-comments-context.md`
- `docs/daily-tests/evidence/2026-06-07-review-comments-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-review-comments-expected.json`
- `docs/daily-tests/evidence/2026-06-07-review-comments-retry-full-context.md`
- `docs/daily-tests/evidence/2026-06-07-review-comments-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-review-comments-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-small-review-comments.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-review-comments.json`
- `docs/daily-tests/evidence/2026-06-07-devstral-review-comments.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-large-review-comments.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-review-comments-retry.json`
- `docs/daily-tests/evidence/2026-06-07-devstral-review-comments-retry.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-large-review-comments-retry.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-review-comments-reference-draft.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-large-review-comments-reference-draft.json`
