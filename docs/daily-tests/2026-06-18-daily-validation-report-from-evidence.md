# Test quotidien 2026-06-18 - redaction d'un rapport quotidien FR depuis evidences bornees

## Statut
**Valide**

## Categorie de tache
Redaction d'un rapport quotidien GitHub en francais a partir d'evidences bornees, avec titres exacts, commandes locales exactes, et sans invention.

## Pourquoi c'est important pour les projets reels
- `AGENTS.md` du Cerveau Central impose des rapports en francais pour audit, validation, GitHub, et synchronisation memoire.
- Ce repo accumule des preuves JSON/TXT/MD a convertir en rapport public presque chaque jour du lab.
- Si Mistral tient ce format, Codex peut deleguer une tache recurrente de compte rendu tout en gardant la verification locale.

## Projet et capacite testes
Capacite a valider: generer un rapport quotidien en francais, strictement conforme aux evidences fournie, avec des titres exacts, des commandes locales exactes, et sans invention de details absents (fichiers, modeles, CI, etc.).

## Modeles testes
- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

## Resume des prompts et du contexte
Le prompt initial decrivait la tache avec les contraintes de format, de langue, et d'exactitude, mais sans insister suffisamment sur la reproduction litterale des trois fragments obligatoires. Le contexte fournissait les titres, sections, commandes, fichiers de preuve, et litteraux a reproduire.

## Usage et tokens
- `mistral-small-latest`: 2513 tokens totaux, Non valide
- `mistral-medium-3.5`: 2562 tokens totaux, Non valide
- `mistral-large-latest`: 2845 tokens totaux, Non valide
- `devstral-latest`: 2628 tokens totaux, Non valide
Retry applique: un prompt plus litteral a force les trois fragments manquants.

Litteraux obligatoires reproduits:
- `recommend a donne un faux negatif`
- `select-model a route vers `devstral-latest``
- `Codex garde la verification, les tests, l'edition locale, Git, et la memoire`

## Resultat
Le premier passage a echoue pour les quatre modeles testes, car aucune sortie ne contenait les trois litteraux obligatoires (et `mistral-small-latest` omettait aussi des commandes exactes et l'ASCII). Le retry avec un prompt plus litteral a permis d'obtenir une sortie conforme, validant ainsi la capacite globale.

## Commandes de validation
```
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Rediger un rapport quotidien GitHub en francais a partir d evidences JSON bornees, avec titres exacts, commandes locales exactes et sans invention."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Rediger un rapport quotidien GitHub en francais a partir d evidences JSON bornees, avec titres exacts, commandes locales exactes et sans invention."
npm run validate
npm run check:helper
```

## Limitations
- Le premier passage a montre une sensibilite aux formulations du prompt pour les litteraux obligatoires.
- `recommend` a produit un faux negatif (`suitable=false`, `confidence=0.34`) pour une tache pourtant bornee.

## Prochaine action
Integrer ce format valide dans les workflows quotidiens du lab, avec verification systematique des litteraux obligatoires et des commandes exactes.

## Contribution vers l'objectif des 70 pourcent
Oui. Ce test porte l'estimation cumulative a 85 pourcent.

## Fichiers de preuve
- `docs/daily-tests/evidence/2026-06-18-daily-report-context.md`
- `docs/daily-tests/evidence/2026-06-18-daily-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-daily-report-reference-context.md`
- `docs/daily-tests/evidence/2026-06-18-daily-report-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-daily-report-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-18-validate-daily-report.mjs`
- `docs/daily-tests/evidence/2026-06-18-validate-final-daily-report.mjs`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-latest-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-large-latest-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-latest-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-daily-report-retry.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-latest-daily-report-retry.json`
- `docs/daily-tests/2026-06-18-daily-validation-report-from-evidence.md`
- `mistral-subagent/references/daily-validation-report-fr.md`