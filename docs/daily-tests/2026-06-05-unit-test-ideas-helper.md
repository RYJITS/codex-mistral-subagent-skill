# Test quotidien 2026-06-05 - idees de tests unitaires pour le helper Mistral

## Statut

**Valide**

## Categorie de tache

Generation d'idees de tests unitaires, priorisation de regressions, JSON structure, reference skill en francais.

## Pourquoi c'est important pour les projets reels

Les helpers et scripts multi-projets du cerveau central evoluent vite et restent souvent peu testes. La capacite a deleguer une premiere passe d'idees de tests unitaires permet a Codex de prioriser les regressions critiques avant d'investir du temps dans l'implementation de la suite.

## Projet et capacite testes

- Projet reel source: `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Cible: `mistral-subagent/scripts/mistral-subagent.mjs`
- Capacite testee: proposer des idees de tests unitaires bornees et verifiables pour `loadEnvFile`, `getApiKey`, `shouldSkipPath`, `readSafeTextFile` et `buildProjectContext`

## Modeles testes

- `mistral-small-latest`
- `mistral-small-latest` retry compact
- `devstral-latest`
- `codestral-latest`
- `mistral-medium-3.5` pour le brouillon de reference

## Resume des prompts et du contexte

- Contexte transmis:
  - resume du comportement de 5 fonctions reelles du helper
  - scripts disponibles dans le repo: `npm run validate`, `npm run check:helper`
  - contrainte forte: aucune commande ni framework invente
  - sortie attendue en JSON strict, sans code de test complet
- Prompt principal:
  - demander au maximum 7 idees
  - exiger `target`, `scenario_fr`, `assertions_fr`, `regression_risk_fr`, `needs_extra_harness`
  - interdire E2E, navigateur, reseau et API distante
- Retry `mistral-small-latest`:
  - schema encore plus compact
  - exactement 5 idees
  - 2 assertions maximum par idee

## Usage et tokens

| Modele | Prompt tokens | Completion tokens | Total tokens | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1051 | 1200 | 2251 | `finish_reason=length`, JSON interne tronque, rejete |
| `mistral-small-latest` retry | 837 | 536 | 1373 | JSON parseable mais hors schema attendu, rejete |
| `devstral-latest` | 1051 | 1024 | 2075 | Meilleure sortie directe, 5 idees utiles et ancrees dans le helper |
| `codestral-latest` | 1051 | 1194 | 2245 | Second avis utile mais plus generique et parfois trop large |
| `mistral-medium-3.5` draft reference | 318 | 535 | 853 | Brouillon utile pour la nouvelle reference, normalise par Codex |

Tokens Mistral utiles retenus pour ce run:

- `devstral-latest`: `2075`
- `codestral-latest`: `2245`
- `mistral-medium-3.5` draft reference: `853`

Total utile retenu: `5173` tokens.

Sorties exclues du comptage utile:

- `mistral-small-latest` premier essai: JSON interne tronque
- `mistral-small-latest` retry: top-level hors schema (`idees_tests`), priorite invalide (`critical`), details peu fiables

## Resultat

Validation positive sous routage borne:

- `devstral-latest` a fourni la meilleure premiere passe, avec des scenarios concrets sur le parsing `.env`, la priorite des cles API et le respect des limites de `buildProjectContext`
- `codestral-latest` a servi de second avis utile pour completer la couverture, mais plusieurs idees restaient plus generiques et moins directement prioritaires
- `mistral-small-latest` n'est pas fiable sur ce schema: une sortie a tronque, puis le retry est sorti du contrat JSON demande

Sorties Mistral directement utilisees:

- priorisation initiale des tests `loadEnvFile`, `getApiKey`, `buildProjectContext`
- rappel explicite de ne pas inventer de framework ou de commande de test
- heuristique de routage `devstral` puis `codestral`
- base textuelle de la reference `mistral-subagent/references/unit-test-ideas-helper-fr.md`

## Commandes de validation

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Generer des idees de tests unitaires bornees et verifiables pour un helper Node.js de delegation Mistral, sortie JSON stricte, sans ecrire les tests"
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt principal>" --context-file "docs/daily-tests/evidence/2026-06-05-unit-test-ideas-context.txt" --model mistral-small-latest --max-tokens 1200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt principal>" --context-file "docs/daily-tests/evidence/2026-06-05-unit-test-ideas-context.txt" --model devstral-latest --max-tokens 1200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt principal>" --context-file "docs/daily-tests/evidence/2026-06-05-unit-test-ideas-context.txt" --model codestral-latest --max-tokens 1200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt compact>" --context-file "docs/daily-tests/evidence/2026-06-05-unit-test-ideas-context.txt" --model mistral-small-latest --max-tokens 700 --temperature 0.1 --json
Get-Content docs/daily-tests/evidence/2026-06-05-devstral-unit-test-ideas.json -Raw | ConvertFrom-Json
($outer.text | ConvertFrom-Json).test_ideas
npm run validate
npm run check:helper
```

## Limitations

- Les fonctions ne sont pas exportees, donc la mise en place d'une vraie suite necessitera un petit harnais local ou une extraction testable
- Un JSON valide ne suffit pas: certaines idees peuvent rester trop larges ou melanger plusieurs assertions
- `mistral-small-latest` est trop fragile sur ce type de schema multi-champs

## Prochaine action

Tester une capacite voisine orientee verification stricte, par exemple revue de diff simple ou classification de commentaires/retours GitHub.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour la preparation de futures suites de tests sur les helpers et scripts locaux. Estimation cumulative apres ce run: **30 pourcent** de couverture delegable vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-05-unit-test-ideas-context.txt`
- `docs/daily-tests/evidence/2026-06-05-unit-test-ideas-prompt.txt`
- `docs/daily-tests/evidence/2026-06-05-mistral-small-unit-test-ideas.json`
- `docs/daily-tests/evidence/2026-06-05-mistral-small-unit-test-ideas-retry.json`
- `docs/daily-tests/evidence/2026-06-05-devstral-unit-test-ideas.json`
- `docs/daily-tests/evidence/2026-06-05-codestral-unit-test-ideas.json`
- `docs/daily-tests/evidence/2026-06-05-mistral-medium35-unit-test-reference-draft.json`
