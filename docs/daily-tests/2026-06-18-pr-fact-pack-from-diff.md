# Test quotidien 2026-06-18 - fact pack de commentaire PR depuis un diff public borne

## Statut

**Partiellement valide**

## Categorie de tache

Extraction d un fact pack JSON pour preparer un commentaire GitHub de PR a partir d un diff public borne, avec normalisation locale par Codex.

## Pourquoi c est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` produisent regulierement des commits, handoffs, et comptes rendus courts a publier sur GitHub. Si Mistral peut extraire un noyau factuel stable depuis un diff public deja borne, Codex peut deleguer une partie recurrente de la communication de maintenance tout en gardant la verification editoriale finale.

## Projet et capacite testes

- Repo source: `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
- Commit cible: `0afb9c84a947ff81145bdfa25189711321ab6ea1`
- Sujet du commit: `lab mistral jour 15: valider le triage de feedback image C2R`
- Capacite testee:
  - lire un diff public borne sur `3` fichiers clefs
  - extraire un fact pack de PR avec statut, projet reel, fichiers, commandes de validation, et modele retenu
  - tenter ensuite une microcopie PR minimale (`scope_label_fr`, `summary_fr`)

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`

Routage observe:

- `recommend` reste prudent sur une tache contenant `PR` et `GitHub`
- `select-model` reste utile comme signal repo-aware, mais pas decisif sur la tenue du schema final

## Resume des prompts et du contexte

Phase `1`, diff brut:

- contexte: diff public borne a `3` fichiers du commit `0afb9c8`
- objectif: obtenir directement un fact pack complet avec `scope_label_fr`, `summary_fr`, `fact_codes`, `key_files`, `validation_commands`, `retained_model`, et `invented_items`

Phase `2`, contexte compact:

- Codex a reduit le contexte public aux faits deja prouvables par le diff
- objectif: contraindre Mistral a sortir uniquement les champs du fact pack, sans commandes ou cles additionnelles

Phase `3`, microcopie:

- objectif: recuperer seulement `scope_label_fr` et `summary_fr` dans un JSON a `2` cles
- but: verifier si une delegation en `2` temps pouvait sauver la capacite

## Usage et tokens

Diff brut, non retenu:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 4788 | 900 | 5688 | Non valide, `finish_reason=length` |
| `mistral-medium-3.5` | 4788 | 900 | 5688 | Non valide, `finish_reason=length` |
| `devstral-latest` | 4788 | 789 | 5577 | Non valide, schema derive |
| `mistral-large-latest` | 4788 | 900 | 5688 | Non valide, `finish_reason=length` |

Contexte compact, sorties partiellement utiles:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 498 | 218 | 716 | Partiel, faits centraux presents mais schema incomplet |
| `mistral-medium-3.5` | 498 | 193 | 691 | Partiel, faits centraux presents mais schema incomplet |
| `devstral-latest` | 498 | 249 | 747 | Partiel, meilleur noyau factuel normalisable |
| `mistral-large-latest` | 498 | 248 | 746 | Partiel, bon noyau factuel normalisable |

Microcopie, non retenue:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 407 | 10 | 417 | Non valide, `scope_label_fr` numerique |
| `mistral-medium-3.5` | 407 | 23 | 430 | Non valide, `summary_fr` absent |
| `devstral-latest` | 407 | 13 | 420 | Non valide, `scope_label_fr` numerique |
| `mistral-large-latest` | 407 | 38 | 445 | Non valide, cle supplementaire `scope_score` |

Tokens Mistral directement appliques a une sortie publiable: `0`.

Tokens Mistral partiellement utiles pour diagnostic et normalisation locale: `2209` (`716` + `747` + `746`).

## Resultat

Verdict partiel sous verification Codex.

- Le diff brut est trop verbeux pour obtenir un fact pack ferme et publiable en une seule passe.
- Le contexte compact aide beaucoup: les `4` modeles retrouvent bien le commit cible, le statut `Valide`, les `3` `key_files`, les `2` commandes `npm run validate` et `npm run check:helper`, ainsi que les `fact_codes`.
- Les meilleurs noyaux factuels viennent de `devstral-latest` et `mistral-large-latest`.
- En revanche, aucun modele ne tient encore l artefact final attendu:
  - `user_project` est tronque en `05_Generateur`
  - des cles alias ou supplementaires apparaissent (`real_project`, `capability`, `default_model`, `scope_score`)
  - `invented_items` manque sur le retry compact
  - la microcopie PR reste instable ou incorrecte meme sur un schema a `2` cles
- Cette capacite n est donc pas comptee comme une nouvelle capacite pleinement validee du lab a ce stade.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Extraire un fact pack JSON strict pour un commentaire GitHub de PR a partir d un diff public borne, sans invention, avec fichiers exacts, statut exact, modele retenu exact, et commandes de validation exactes."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Extraire un fact pack JSON strict pour un commentaire GitHub de PR a partir d un diff public borne, sans invention, avec fichiers exacts, statut exact, modele retenu exact, et commandes de validation exactes."
```

Diff brut:

```powershell
node docs/daily-tests/evidence/2026-06-18-build-pr-fact-pack-context.mjs
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-context.md" --model devstral-latest --max-tokens 900 --temperature 0.05 --json
```

Retry compact:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-retry-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-compact-context.md" --model devstral-latest --max-tokens 400 --temperature 0.05 --json
node docs/daily-tests/evidence/2026-06-18-validate-pr-fact-pack.mjs "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-expected.json" "docs/daily-tests/evidence/2026-06-18-mistral-small-pr-fact-pack-retry.json" "docs/daily-tests/evidence/2026-06-18-mistral-medium35-pr-fact-pack-retry.json" "docs/daily-tests/evidence/2026-06-18-devstral-pr-fact-pack-retry.json" "docs/daily-tests/evidence/2026-06-18-mistral-large-pr-fact-pack-retry.json"
```

Microcopie:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-microcopy-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-18-pr-fact-pack-compact-context.md" --model mistral-medium-3.5 --max-tokens 180 --temperature 0.05 --json
```

Repo:

```powershell
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Le schema ferme n est pas encore tenu en bout en bout sur cette famille de tache.
- Les alias utiles existent, mais ils imposent encore une normalisation locale non triviale pour etre publiables.
- Le champ editorial minimal (`scope_label_fr`, `summary_fr`) n est pas stable meme sur une demande reduite a `2` cles.
- Le protocole n est donc pas encore assez solide pour remplacer un commentaire PR final ou un handoff GitHub sans relecture importante de Codex.

## Prochaine action

Retester cette famille avec un contrat encore plus hybride: laisser Mistral sortir uniquement les faits semantiques `status`, `files`, `retained_model`, `fact_codes`, puis laisser Codex posseder integralement les champs litteraux et editoriaux du commentaire GitHub.

## Contribution vers l objectif 70 pourcent

Non, pas comme nouvelle capacite validee.

La couverture cumulative retenue pour le lab reste donc a **82 pourcent**. Ce run montre une utilite partielle pour la communication GitHub, mais pas encore une voie suffisamment stable pour augmenter le score valide.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-18-build-pr-fact-pack-context.mjs`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-context.md`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-compact-context.md`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-microcopy-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-expected.json`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-check.json`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-recommend.json`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-select-model.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-pr-fact-pack.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium35-pr-fact-pack.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-pr-fact-pack.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-large-pr-fact-pack.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-pr-fact-pack-retry.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium35-pr-fact-pack-retry.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-pr-fact-pack-retry.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-large-pr-fact-pack-retry.json`
- `docs/daily-tests/evidence/2026-06-18-pr-fact-pack-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-pr-microcopy.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium35-pr-microcopy.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-pr-microcopy.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-large-pr-microcopy.json`
- `docs/daily-tests/evidence/2026-06-18-pr-microcopy-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-18-validate-pr-fact-pack.mjs`
- `docs/daily-tests/evidence/2026-06-18-validate-pr-microcopy.mjs`
