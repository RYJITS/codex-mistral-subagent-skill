# Contexte borne pour commentaire GitHub de PR a partir d un diff public

## Perimetre

- Repo source: `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
- Commit cible: `2ed077fa48c13806d1b37e1b4e6886196630ad55`
- Sujet du commit: `lab mistral jour 14: valider note de release sur diff public`
- Type de message attendu: commentaire ou resume de PR GitHub en francais, destine a des reviewers humains

## Faits verifies

- Le commit ajoute `16` fichiers et `481` lignes.
- Les artefacts principaux ajoutes sont:
  - `docs/daily-tests/2026-06-14-release-note-from-diff.md`
  - `docs/daily-tests/evidence/2026-06-14-release-note-context.md`
  - `docs/daily-tests/evidence/2026-06-14-release-note-validation-summary.json`
  - `mistral-subagent/references/release-note-from-diff-fr.md`
- Le rapport quotidien associe est marque `Valide`.
- La capacite validee dans ce rapport:
  - rediger une note de release FR a partir d un diff public borne
  - garder un JSON strict
  - preserver les commandes de validation exactes
  - citer uniquement des fichiers reels du commit
- Les modeles testes dans le run source:
  - `mistral-small-latest`
  - `mistral-medium-3.5`
  - `devstral-latest`
  - `mistral-large-latest`
- Le meilleur brouillon public retenu dans le rapport source est `mistral-large-latest`.
- Les commandes exactes a preserver sont:
  - `npm run validate`
  - `npm run check:helper`

## Liste exacte des fichiers modifies par le commit

- `docs/daily-tests/2026-06-14-release-note-from-diff.md`
- `docs/daily-tests/evidence/2026-06-14-devstral-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-large-release-note-reference.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-large-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium35-release-note-report.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium35-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-small-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-release-note-context.md`
- `docs/daily-tests/evidence/2026-06-14-release-note-prompt.txt`
- `docs/daily-tests/evidence/2026-06-14-release-note-recommend.json`
- `docs/daily-tests/evidence/2026-06-14-release-note-reference-context.md`
- `docs/daily-tests/evidence/2026-06-14-release-note-report-context.md`
- `docs/daily-tests/evidence/2026-06-14-release-note-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-14-release-note-select-model.json`
- `docs/daily-tests/evidence/2026-06-14-release-note-validation-summary.json`
- `mistral-subagent/references/release-note-from-diff-fr.md`

## Contraintes

- Ne pas inventer de numero de PR, d issue, de CI, de ticket, de dependance, de script, ni de fichier absent de la liste.
- Ne pas dire que `README.md` ou `mistral-subagent/SKILL.md` ont ete modifies dans ce commit.
- Ne pas inventer d autres modeles testes.
- Le commentaire doit rester compact et publiable tel quel sur GitHub.
