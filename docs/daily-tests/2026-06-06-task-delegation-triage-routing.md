# Test quotidien 2026-06-06 - triage de delegation et routage modele

## Statut

**Partiellement valide**

## Categorie de tache

Classification de delegation, routage de modele, garde-fous de redaction, et JSON strict pour taches multi-projets.

## Pourquoi c'est important pour les projets reels

Dans `D:\00_Cerveau_IA`, Codex doit souvent decider tres vite si une demande peut etre envoyee a Mistral, avec quel modele, et ce qui doit rester local. Si ce triage est suffisamment fiable, une partie recurrente du cadrage peut etre deleguee avant l'integration repo, sans exposer de secret ni perdre du temps sur des taches non delegables.

## Projet et capacite testes

- Projets source de contexte:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - classer `8` briefs reels et bornes en `oui`, `partiel`, `non`
  - proposer un modele Mistral autorise
  - forcer un JSON strict exploitable par Codex

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`
- retries stricts sur `mistral-small-latest`, `mistral-medium-3.5`, et `mistral-large-latest`

## Resume des prompts et du contexte

- Contexte transmis:
  - `8` briefs reels, sans secret, inspires des projets `CV_WEBGL_SCROLL_VIDEO_SITE`, `AI_VIDEO_WEBGL_COMPETENCES`, `codex-mistral-subagent-skill`, et `Cerveau Central IA`
  - regles de non-delegation explicites pour `env.Local`, shell, Git, memoire, et decisions legales finales
  - liste fermee des modeles autorises
- Prompt principal:
  - demander un JSON strict de triage avec verdict, categorie, tableau `triage`, regles globales, et limitations
  - imposer `delegation_mode`, `recommended_model`, et `redaction_level`
- Prompt de retry:
  - interdire explicitement les variantes `tasks`, `delegations`, ou un objet indexe par `T1`
  - exiger `triage` en tableau de `8` objets avec cles fixes

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1001 | 398 | 1399 | Bon fond, schema inutilisable: objet indexe par `T1` |
| `mistral-medium-3.5` | 1001 | 606 | 1607 | Bon fond, schema casse avec `delegations` |
| `devstral-latest` | 1001 | 541 | 1542 | Bon fond repo, schema casse avec `tasks` |
| `mistral-large-latest` | 1001 | 547 | 1548 | Bon fond, schema melange top-level et objets `T1` |
| `mistral-small-latest` retry | 1095 | 973 | 2068 | Schema presque bon, mais `global_rules_fr` et `limitations_fr` restent des strings |
| `mistral-medium-3.5` retry | 1095 | 1128 | 2223 | Meilleure sortie strictement exploitable, mais routage encore trop generique |
| `mistral-large-latest` retry | 1095 | 1273 | 2368 | Meilleure nuance sur les cas `partiel`, mais trop prudent sur des taches repo/doc |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5` retry: `2223`
- `mistral-large-latest` retry: `2368`

Total utile retenu: `4591` tokens.

Sorties exclues du comptage utile:

- tous les premiers passages, car schema non exploitable directement
- `mistral-small-latest` retry, car types de champs encore non conformes

## Resultat

Validation partielle.

- Les modeles ont bien appris les refus critiques:
  - `T4` secret/env file
  - `T6` shell/commit/push/memoire
- `mistral-medium-3.5` retry et `mistral-large-latest` retry ont produit un JSON directement parseable et reutilisable pour la reference du skill
- `mistral-large-latest` retry a mieux traite les cas `partiel`, notamment `T8` sur licence/politique de securite
- Le point faible reste le routage modele:
  - les taches `T2`, `T3`, et `T5` sont souvent routees vers `mistral-medium-3.5` ou `codestral-latest` au lieu de `devstral-latest` ou `mistral-small-latest`
  - plusieurs sorties sur-classent `partiel` pour des taches repo/doc pourtant delegables en premiere passe

Conclusion de travail:

- oui pour un triage borne et supervise
- non pour un auto-routage final sans verification Codex

## Commandes de validation

Appels Mistral:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-06-task-triage-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-06-task-triage-context.md" --model mistral-small-latest --max-tokens 1600 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-06-task-triage-context.md" --model mistral-medium-3.5 --max-tokens 1600 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-06-task-triage-context.md" --model devstral-latest --max-tokens 1600 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-06-task-triage-context.md" --model mistral-large-latest --max-tokens 1600 --temperature 0.1 --json
```

Retry strict:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-06-task-triage-retry-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-06-task-triage-context.md" --model mistral-small-latest --max-tokens 1300 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-06-task-triage-context.md" --model mistral-medium-3.5 --max-tokens 1300 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-06-task-triage-context.md" --model mistral-large-latest --max-tokens 1300 --temperature 0.05 --json
```

Verification locale:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-06-task-triage-validation-summary.json -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Le schema strict tient seulement apres un prompt de retry plus dur
- Le triage securite est meilleur que le choix fin du modele
- `mistral-small-latest` peut rester utile comme filtre bon marche, mais pas comme routeur final
- les cas repo/doc avec commandes visibles restent sur-prudents ou sur-routes sans verification Codex

## Prochaine action

Tester une capacite voisine a gold set plus net: seconde opinion de code review ou triage de commentaires/diff simple avec attentes exactes.

## Contribution vers l'objectif 70 pourcent

Oui, partiellement. Cette capacite ajoute une brique utile de pre-triage multi-projets, mais ne compte pas encore comme routage autonome complet. Estimation cumulative apres ce run: **28 pourcent** de couverture delegable vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-06-task-triage-context.md`
- `docs/daily-tests/evidence/2026-06-06-task-triage-prompt.txt`
- `docs/daily-tests/evidence/2026-06-06-task-triage-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-06-task-triage-expected.json`
- `docs/daily-tests/evidence/2026-06-06-task-triage-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-small-task-triage.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-medium35-task-triage.json`
- `docs/daily-tests/evidence/2026-06-06-devstral-task-triage.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-large-task-triage.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-small-task-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-medium35-task-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-large-task-triage-retry.json`
