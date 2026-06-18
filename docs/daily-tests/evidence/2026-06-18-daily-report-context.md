# Contexte borne - test quotidien 2026-06-18

## Capacite cible

Redaction d'un rapport quotidien GitHub en francais a partir d'evidences JSON/Markdown bornees, avec titres exacts, commandes locales exactes, et sans invention.

## Pourquoi cette capacite compte dans les projets reels

- `D:\00_Cerveau_IA\AGENTS.md` impose une documentation francaise apres audit, validation, GitHub, ou synchronisation memoire.
- Dans `D:\00_Cerveau_IA\Projet`, Codex doit souvent transformer des preuves locales en rapport public court et verifiable.
- Si Mistral sait tenir ce format sous contrainte, une partie recurrente des comptes rendus peut etre deleguee avant verification locale.

## Scope autorise

- `D:\00_Cerveau_IA`
- `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`

## Faits imposes

- Date du run: `2026-06-18`
- Titre exact du rapport: `# Test quotidien 2026-06-18 - redaction d'un rapport quotidien FR depuis evidences bornees`
- Statut attendu pour le candidat de comparaison: `**Valide**`
- Estimation cumulative cible apres ce run si la capacite est validee: `85 pourcent`
- Le rapport doit rester en ASCII

## Pre-vol deja observe

- `check`:
  - `env_path`: `D:\00_Cerveau_IA\API\env.Local`
  - `env_file_exists`: `true`
  - `api_key_configured`: `true`
  - `configured_key_names`: `MISTRAL.API_KEY`
- `recommend`:
  - `suitable`: `false`
  - `confidence`: `0.34`
  - `suggested_model`: `devstral-latest`
- `select-model`:
  - `model`: `devstral-latest`
- `run --dry-run`:
  - `endpoint`: `https://api.mistral.ai/v1/chat/completions`
  - payload par defaut route vers `mistral-small-latest`

## Modeles a mentionner

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

## Sections imposees

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

## Contraintes de redaction

- Ne pas inventer de PR, issue, CI, test absent, fichier absent, ou modele absent.
- Ne pas mentionner `mistral-medium-latest`, `codestral-latest`, ou `voxtral-mini-latest`.
- Sous `## Usage et tokens`, ecrire exactement: `Tokens a completer par Codex apres comparaison inter-modeles.`
- Mentionner que `recommend` a donne un faux negatif et que `select-model` a route vers `devstral-latest`.
- Mentionner que Codex garde la verification, les tests, l'edition locale, Git, et la memoire.

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
- `docs/daily-tests/evidence/2026-06-18-daily-report-expected.json`
- `docs/daily-tests/evidence/2026-06-18-validate-daily-report.mjs`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-latest-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-large-latest-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-latest-daily-report.json`
- `docs/daily-tests/evidence/2026-06-18-daily-report-validation-summary.json`
- `docs/daily-tests/2026-06-18-daily-validation-report-from-evidence.md`
- `mistral-subagent/references/daily-validation-report-fr.md`
