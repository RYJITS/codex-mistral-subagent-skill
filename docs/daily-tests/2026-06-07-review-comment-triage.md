# Test quotidien 2026-06-07 - triage strict de commentaires de review

## Statut

**Valide**

## Categorie de tache

Classification de commentaires de review en JSON actionnable pour maintenance repo, documentation, et feedback PR borne.

## Pourquoi c'est important pour les projets reels

Dans `D:\00_Cerveau_IA`, beaucoup de taches recurrentes commencent par un lot de retours melanges: corrections doc, demandes interdites, standardisations douteuses, ou decisions a escalader. Si Mistral sait faire une premiere passe fiable pour separer `apply_now`, `needs_human`, et `reject`, Codex peut deleguer une partie repetitive du triage avant de modifier les fichiers locaux.

## Projet et capacite testes

- Projets source de contexte:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - trier `6` commentaires de review bornes en `apply_now`, `needs_human`, ou `reject`
  - garder l'ordre exact `R1` a `R6`
  - limiter les chemins cibles a une liste fermee
  - limiter les commandes de validation a une liste fermee

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`
- retry strict sur `mistral-medium-3.5`, `devstral-latest`, et `mistral-large-latest`

## Resume des prompts et du contexte

- Contexte transmis:
  - un repo public borne avec facts verifies sur `README.md`, `mistral-subagent/SKILL.md`, `package.json`, et `mistral-subagent/scripts/mistral-subagent.mjs`
  - `6` commentaires melanges:
    - `R1` documentation manquante de `quota-report`
    - `R2` references manquantes dans `SKILL.md`
    - `R3` demande interdite de commit/push automatique
    - `R4` choix de licence finale
    - `R5` ajout de `npm test` absent du repo
    - `R6` demande deja satisfaite sur `MISTRAL_ENV_FILE`
  - liste fermee des chemins cibles et des commandes autorisees
- Prompt principal:
  - demander un JSON strict avec `verdict`, `task_category`, `overall_summary_fr`, `actions`, `global_rules_fr`, et `limitations_fr`
  - imposer `6` actions dans l'ordre `R1` a `R6`
  - limiter `disposition` a `apply_now`, `needs_human`, `reject`
- Prompt de retry:
  - forcer le resume exact `2 apply_now, 1 needs_human, 3 reject`
  - interdire toute recomposition de la commande `Select-String`
  - geler `R3`, `R5`, et `R6` sur `target_path: "none"`

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1356 | 691 | 2047 | Classe bien `6/6` actions, mais derive sur les commandes et le resume |
| `mistral-medium-3.5` | 1356 | 710 | 2066 | Classe bien `6/6`, mais commande `Select-String` recomposee |
| `devstral-latest` | 1356 | 679 | 2035 | Classe bien `6/6`, mais resume non strict et commandes recomposees |
| `mistral-large-latest` | 1356 | 794 | 2150 | Bonne seconde opinion, meme derive sur resume/commandes |
| `mistral-medium-3.5` retry | 1430 | 671 | 2101 | Seule sortie pleinement exploitable sans reparation semantique |
| `devstral-latest` retry | 1430 | 628 | 2058 | Confirmation utile des `6` classifications, resume encore moins strict |
| `mistral-large-latest` retry | 1430 | 686 | 2116 | Confirmation utile et bonne formulation, resume encore moins strict |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5` retry: `2101`
- `devstral-latest` retry: `2058`
- `mistral-large-latest` retry: `2116`

Total utile retenu: `6275` tokens.

Sorties exclues du comptage utile:

- les quatre premiers passages, car les commandes de validation etaient recomposees et le resume n'etait pas assez strict
- `mistral-small-latest`, malgre `6/6` classifications justes, car la sortie restait trop libre sur les commandes et le resume
- les brouillons de reference FR, car ils demandaient encore une normalisation structurelle par Codex

## Resultat

Validation positive sous verification Codex.

- Les quatre modeles ont correctement classe les `6` commentaires des le premier passage.
- Le point faible initial n'etait pas le triage lui-meme, mais la discipline de sortie:
  - recomposition de la commande `Select-String`
  - resume trop libre par rapport au comptage exact demande
- Le retry strict a rendu `mistral-medium-3.5` pleinement exploitable pour un JSON directement reutilisable.
- `devstral-latest` retry et `mistral-large-latest` retry ont servi de confirmations utiles:
  - `6/6` classifications conformes
  - commandes de validation conformes a la liste fermee
  - resume encore legerement moins rigide que la phrase exacte attendue

Sorties Mistral directement utilisees:

- triage `mistral-medium-3.5` retry pour valider la capacite et piloter les modifications repo;
- triages `devstral-latest` retry et `mistral-large-latest` retry comme confirmations secondaires du meme gold set;
- brouillon de reference FR `mistral-medium-3.5` retry comme base de structure, ensuite resserree et verifiee par Codex.

Changements repo appliques a partir du triage valide:

- documentation de `quota-report` dans `README.md`
- ajout des references manquantes dans `mistral-subagent/SKILL.md`
- ajout de `mistral-subagent/references/review-comment-triage-fr.md`

## Commandes de validation

Appels Mistral:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-07-review-comment-triage-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md" --model mistral-small-latest --max-tokens 1400 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md" --model mistral-medium-3.5 --max-tokens 1400 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md" --model devstral-latest --max-tokens 1400 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md" --model mistral-large-latest --max-tokens 1400 --temperature 0.05 --json
```

Retry strict:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-07-review-comment-triage-retry-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md" --model devstral-latest --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md" --model mistral-large-latest --max-tokens 1200 --temperature 0.05 --json
```

Verification locale:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-07-review-comment-triage-validation-summary.json -Raw | ConvertFrom-Json
Select-String -Path README.md,mistral-subagent/SKILL.md -Pattern 'quota-report|json-extraction-maintenance-fr|ui-ux-copy-scroll-driven-fr|MISTRAL_ENV_FILE'
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Sans retry strict, la capacite classe bien le fond mais tient moins bien la liste fermee de commandes et le resume exact.
- Le test porte sur un lot borne de `6` commentaires et non sur une review GitHub longue ou multi-fichiers.
- `mistral-small-latest` peut etre un bon filtre bon marche, mais pas encore une base assez stricte pour une integration sans normalisation.
- La capacite reste subordonnee a la verification Codex; elle n'est pas autonome.

## Prochaine action

Tester une capacite voisine a fort rendement recurrent: extraction d'actions sur feedback texte plus long, ou classification stricte de brief multi-commentaires vers patch/doc/decision.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour une famille recurrente de triage de retours PR/review et de priorisation d'actions doc/repo. Estimation cumulative apres ce run: **45 pourcent** de couverture des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-07-review-comment-triage-context.md`
- `docs/daily-tests/evidence/2026-06-07-review-comment-triage-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-review-comment-triage-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-review-comment-triage-expected.json`
- `docs/daily-tests/evidence/2026-06-07-review-comment-triage-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-small-review-comment-triage.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-review-comment-triage.json`
- `docs/daily-tests/evidence/2026-06-07-devstral-review-comment-triage.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-large-review-comment-triage.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-review-comment-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-07-devstral-review-comment-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-large-review-comment-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-07-review-comment-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-review-comment-reference-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-review-comment-reference.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-review-comment-reference-retry.json`
