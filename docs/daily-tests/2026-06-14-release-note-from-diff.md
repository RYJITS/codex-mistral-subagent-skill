# Test quotidien 2026-06-14 - note de release FR a partir d un diff public borne

## Statut

**Valide**

## Categorie de tache

Redaction d une note de release ou note de mainteneur FR a partir d un commit public deja filtre par Codex, avec sortie JSON stricte et verification locale.

## Pourquoi c est important pour les projets reels

L utilisateur pousse regulierement des mises a jour sur des repos publics et des skills relies a `D:\00_Cerveau_IA`. Une premiere passe Mistral sur une note de release bornee permet a Codex de gagner du temps sur les recapitulatifs de livraison, les notes mainteneur, et les messages publics de changements sans deleguer Git, shell, ou verification finale.

## Projet et capacite testes

- Repo source: `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
- Commit cible: `f33ea9da5639315b54b424ac970b38ac89dd16e9`
- Sujet du commit: `lab mistral: valide doc publique fr bornee`
- Capacite testee:
  - lire un contexte public borne derive d un commit reel
  - produire une note de release FR en JSON strict
  - retenir des highlights verifiables
  - citer uniquement des fichiers reellement modifies
  - preserver les commandes de validation exactes

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`

Modele de reference retenu:

- `mistral-large-latest` pour le meilleur brouillon public final

## Resume des prompts et du contexte

- Contexte transmis:
  - hash et sujet du commit
  - liste exacte des `20` fichiers modifies
  - faits publics verifies sur `README.md`, `docs/TASK_CATALOG_FR.md`, et `mistral-subagent/references/public-doc-generation-fr.md`
  - commandes litterales `npm run validate` et `npm run check:helper`
- Prompt principal:
  - imposer un JSON strict avec `title_fr`, `summary_fr`, `highlights_fr`, `key_files`, `validation_commands`, et `invented_items`
  - interdire toute invention de PR, issue, CI, dependance, ou script absent du contexte
- Observation utile:
  - `recommend` deconseille la tache a cause du mot `commit`, mais `select-model` route correctement vers `mistral-large-latest`

## Usage et tokens

| Run | Total tokens | Verdict |
|---|---:|---|
| `mistral-small-latest` | 1575 | Utilisable apres normalisation |
| `mistral-medium-3.5` | 1570 | Bonne contre-verification |
| `devstral-latest` | 1569 | Bonne contre-verification repo-aware |
| `mistral-large-latest` | 1645 | Meilleure sortie retenue |
| `mistral-large-latest` reference | 918 | Brouillon retenu pour la reference |
| `mistral-medium-3.5` rapport | 1028 | Rejete, details inventes |

Tokens Mistral utiles retenus pour la capacite et la reference appliquee: `5702`.

## Resultat

Validation positive sous verification Codex.

- Les `4` modeles du test principal ont retourne un JSON exploitable.
- Les commandes `npm run validate` et `npm run check:helper` ont ete preservees exactement sur les sorties retenues.
- Aucun des `key_files` retenus n invente de chemin hors liste.
- `mistral-large-latest` produit la meilleure note publique compacte.
- `devstral-latest` et `mistral-medium-3.5` servent bien de contre-verification compacte.
- `mistral-small-latest` reste utile, mais demande plus souvent une normalisation ASCII.

Sorties Mistral directement utilisees:

- `docs/daily-tests/evidence/2026-06-14-mistral-large-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-devstral-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium35-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-large-release-note-reference.json`

Sorties non retenues comme validees:

- `docs/daily-tests/evidence/2026-06-14-release-note-recommend.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium35-release-note-report.json`

## Commandes de validation

Configuration et routage:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs check
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs recommend --task "Rediger une note de release francaise bornee a partir d un commit git public deja filtre, avec sortie JSON stricte et uniquement des faits verifiables."
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs select-model --task "Rediger une note de release francaise bornee a partir d un commit git public deja filtre, avec sortie JSON stricte et uniquement des faits verifiables."
```

Delegation:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-14-release-note-prompt.txt" -Raw
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-14-release-note-context.md" --model mistral-large-latest --max-tokens 900 --temperature 0.1 --json
```

Verification locale:

```powershell
Get-Content "docs/daily-tests/evidence/2026-06-14-release-note-validation-summary.json" -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
```

## Limitations

- `recommend` peut produire un faux negatif si la tache mentionne `commit` avant que Codex n explicite le caractere public et borne du contexte
- le flux valide ici couvre une note courte a partir d un commit unique, pas un changelog multi-commits
- une verification Codex reste obligatoire avant publication

## Prochaine action

Tester une capacite voisine plus large: synthese de changelog sur plusieurs commits publics ou lot borne de messages de livraison.

## Contribution vers l objectif 70 pourcent

Oui. Cette capacite ajoute une tache recurrente de communication repo publique qui peut etre deleguee en premiere passe a Mistral. Estimation cumulative apres ce run: **78 pourcent** de couverture des taches recurrentes delegables vers l objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-14-release-note-context.md`
- `docs/daily-tests/evidence/2026-06-14-release-note-prompt.txt`
- `docs/daily-tests/evidence/2026-06-14-release-note-recommend.json`
- `docs/daily-tests/evidence/2026-06-14-release-note-select-model.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-small-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium35-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-devstral-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-large-release-note.json`
- `docs/daily-tests/evidence/2026-06-14-release-note-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-14-release-note-reference-context.md`
- `docs/daily-tests/evidence/2026-06-14-mistral-large-release-note-reference.json`
- `docs/daily-tests/evidence/2026-06-14-release-note-report-context.md`
- `docs/daily-tests/evidence/2026-06-14-release-note-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium35-release-note-report.json`
