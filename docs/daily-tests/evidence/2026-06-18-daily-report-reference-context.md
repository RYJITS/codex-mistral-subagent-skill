# Contexte de reference - rapport final 2026-06-18

## Capacite validee si le retry passe

Redaction d'un rapport quotidien GitHub en francais a partir d'evidences bornees, avec titres exacts, commandes locales exactes, et sans invention.

## Importance projet

- `AGENTS.md` du Cerveau Central impose des rapports en francais pour audit, validation, GitHub, et synchronisation memoire.
- Ce repo accumule des preuves JSON/TXT/MD a convertir en rapport public presque chaque jour du lab.
- Si Mistral tient ce format, Codex peut deleguer une tache recurrente de compte rendu tout en gardant la verification locale.

## Titre et statut imposes

- Titre exact: `# Test quotidien 2026-06-18 - redaction d'un rapport quotidien FR depuis evidences bornees`
- Statut exact: `**Valide**`
- Estimation cumulative apres ce run: `85 pourcent`

## Pre-vol exact

- `check`: `env.Local` present, cle configuree via `MISTRAL.API_KEY`
- `recommend`: `suitable=false`, `confidence=0.34`, donc faux negatif pour cette tache pourtant bornee
- `select-model`: `devstral-latest`
- `run --dry-run`: endpoint `https://api.mistral.ai/v1/chat/completions`, payload par defaut vers `mistral-small-latest`

## Premier passage compare

- `mistral-small-latest`: `2513` tokens totaux, `Non valide`
- `mistral-medium-3.5`: `2562` tokens totaux, `Non valide`
- `mistral-large-latest`: `2845` tokens totaux, `Non valide`
- `devstral-latest`: `2628` tokens totaux, `Non valide`

Cause commune du premier passage:

- les quatre sorties tenaient le squelette global
- les quatre sorties rataient les trois litteraux obligatoires
- `mistral-small-latest` ratait aussi des commandes exactes et l'ASCII

## Litteraux obligatoires a recopier tels quels

- `recommend a donne un faux negatif`
- `select-model a route vers `devstral-latest``
- `Codex garde la verification, les tests, l'edition locale, Git, et la memoire`

## Resume du retry a expliquer

- un prompt plus litteral a ete applique pour forcer les trois fragments manquants
- le retry reste borne au meme scope et aux memes commandes exactes
- le rapport final doit presenter le premier passage comme `Non valide`, puis conclure que la capacite globale est `Valide` grace au retry retenu

## Sections exactes attendues

1. `## Statut`
2. `## Categorie de tache`
3. `## Pourquoi c'est important pour les projets reels`
4. `## Projet et capacite testes`
5. `## Modeles testes`
6. `## Resume des prompts et du contexte`
7. `## Usage et tokens`
8. `## Resultat`
9. `## Commandes de validation`
10. `## Limitations`
11. `## Prochaine action`
12. `## Contribution vers l'objectif des 70 pourcent`
13. `## Fichiers de preuve`

## Commandes exactes a inclure

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Rediger un rapport quotidien GitHub en francais a partir d evidences JSON bornees, avec titres exacts, commandes locales exactes et sans invention."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Rediger un rapport quotidien GitHub en francais a partir d evidences JSON bornees, avec titres exacts, commandes locales exactes et sans invention."
npm run validate
npm run check:helper
```

## Fichiers de preuve a lister

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
