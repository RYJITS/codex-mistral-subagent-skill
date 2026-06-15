# Test quotidien 2026-06-15 - commentaire GitHub de PR a partir d un diff public borne

## Statut

**Partiellement valide**

## Categorie de tache

Redaction d un commentaire ou resume de PR GitHub en francais a partir d un diff public borne, avec sortie JSON stricte et commentaire publiable apres verification locale.

## Pourquoi c est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` ont regulierement besoin de commentaires GitHub, resumes de PR, et messages de handoff courts pour expliquer un commit ou un diff deja verifie. Si Mistral peut produire ce commentaire sans inventer de PR, de CI, ou de fichiers hors scope, Codex peut deleguer une partie recurrente de la communication de maintenance tout en gardant Git, les tests, et la validation finale.

## Projet et capacite testes

- Repo source: `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
- Commit cible: `2ed077fa48c13806d1b37e1b4e6886196630ad55`
- Sujet du commit: `lab mistral jour 14: valider note de release sur diff public`
- Capacite testee:
  - lire un diff public deja borne par Codex
  - produire un brouillon de commentaire GitHub FR
  - conserver les fichiers autorises et les commandes exactes
  - rester publiable en JSON strict sans invention ni debordement editorial

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`

Routage observe:

- `recommend` deconseille encore la tache malgre le contexte public borne
- `select-model` propose `devstral-latest` comme meilleur point de depart repo-aware

## Resume des prompts et du contexte

- Contexte transmis:
  - hash et sujet exacts du commit
  - liste exacte des `16` fichiers modifies
  - faits verifies: `481` lignes ajoutees, rapport source `Valide`, meilleur brouillon public precedent sur `mistral-large-latest`
  - commandes litterales `npm run validate` et `npm run check:helper`
- Prompt v1:
  - schema JSON avec `comment_title_fr`, `comment_body_fr`, `highlights_fr`, `key_files`, `models_tested`, `retained_model`, `validation_commands`, `invented_items`
  - but: verifier si un commentaire PR compact pouvait sortir directement
- Prompt v2:
  - schema encore plus serre
  - `key_files`, `models_tested`, `retained_model`, `validation_commands`, et `invented_items` imposes
  - corps limite a un seul paragraphe avec le litteral `Statut: Valide.`

## Usage et tokens

| Run | Total tokens | Verdict |
|---|---:|---|
| `mistral-small-latest` v1 | 1624 | Rejete, corps trop long et `invented_items` absent |
| `mistral-medium-3.5` v1 | 1603 | Rejete, corps trop long et `invented_items` absent |
| `devstral-latest` v1 | 1504 | Rejete, meilleur brouillon semantique mais `Valide` et `invented_items` absents |
| `mistral-large-latest` v1 | 1730 | Rejete, corps trop long et `invented_items` absent |
| `mistral-small-latest` v2 | 1649 | Rejete, 4 highlights et `invented_items` absent |
| `mistral-medium-3.5` v2 | 1711 | Rejete, JSON tronque |
| `devstral-latest` v2 | 1617 | Rejete, toujours sans `Valide` ni `invented_items` |
| `mistral-large-latest` v2 | 1711 | Rejete, JSON tronque |
| `mistral-medium-3.5` rapport | 1626 | Utilise pour un premier brouillon de ce rapport, puis corrige localement |

Tokens Mistral retenus pour la capacite testee: `0`.

## Resultat

Verdict partiel sous verification Codex.

- Les `8` runs de la capacite restent bien dans le scope du diff public.
- Les sorties parseables gardent correctement les `key_files` autorises et les commandes `npm run validate` et `npm run check:helper`.
- La qualite semantique des commentaires est proche d un usage humain, surtout sur `devstral-latest` v1.
- En revanche, aucun modele ne rend un artefact completement conforme et publiable tel quel:
  - `invented_items` disparait sur toutes les sorties parseables
  - le contrat editorial sur la longueur du corps reste instable
  - `mistral-medium-3.5` v2 et `mistral-large-latest` v2 tronquent le JSON
- Cette capacite n est donc pas comptee comme validee vers l objectif du lab a ce stade.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Rediger un commentaire de PR GitHub en francais a partir d un diff public borne et d un rapport quotidien valide, avec sortie JSON stricte et uniquement des faits verifiables."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Rediger un commentaire de PR GitHub en francais a partir d un diff public borne et d un rapport quotidien valide, avec sortie JSON stricte et uniquement des faits verifiables."
```

Validation locale:

```powershell
node docs/daily-tests/evidence/2026-06-15-validate-pr-comment.mjs D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill docs/daily-tests/evidence/2026-06-15-devstral-pr-comment.json
Get-Content docs/daily-tests/evidence/2026-06-15-pr-comment-validation-summary.json -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
```

## Limitations

- Le schema demande etait encore trop large pour une sortie stable et directement publiable.
- L obligation du champ `invented_items` n a pas ete respectee par les sorties parseables.
- La qualite de redaction publique existe, mais le format strict reste trop fragile pour compter cette tache comme autonome.
- Le helper `recommend` sous-estime toujours cette famille de taches quand le mot `PR` ou `GitHub` apparait avant le rappel du perimetre borne.

## Prochaine action

Retester cette famille seulement avec un schema beaucoup plus petit, ou bien demander a Mistral un fact pack strict puis laisser Codex formater le commentaire GitHub final.

## Contribution vers l objectif 70 pourcent

Non.

Cette capacite ne compte pas encore comme validee vers l objectif des `70 %`. Apres reconciliation de l historique deja valide jusqu au 2026-06-14, l estimation cumulative reste donc a **82 pourcent** de couverture des taches recurrentes delegables deja validees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-15-pr-comment-context.md`
- `docs/daily-tests/evidence/2026-06-15-pr-comment-prompt.txt`
- `docs/daily-tests/evidence/2026-06-15-pr-comment-prompt-v2.txt`
- `docs/daily-tests/evidence/2026-06-15-pr-comment-recommend.json`
- `docs/daily-tests/evidence/2026-06-15-pr-comment-select-model.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-small-pr-comment.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium35-pr-comment.json`
- `docs/daily-tests/evidence/2026-06-15-devstral-pr-comment.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-large-pr-comment.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-small-pr-comment-v2.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium35-pr-comment-v2.json`
- `docs/daily-tests/evidence/2026-06-15-devstral-pr-comment-v2.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-large-pr-comment-v2.json`
- `docs/daily-tests/evidence/2026-06-15-pr-comment-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium35-pr-comment-report.md.json`
