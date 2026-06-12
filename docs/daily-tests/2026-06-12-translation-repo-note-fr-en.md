# Test quotidien 2026-06-12 - traduction structuree de note repo FR vers EN

## Statut

**Valide**

## Categorie de tache

Traduction structuree FR vers EN d'une note repo publique avec glossaire verrouille, sortie JSON stricte, et oracle local ferme.

## Pourquoi c'est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` publient des README, notes de validation, et suivis publics ou semi-publics qui doivent parfois etre relayes en anglais sans casser les commandes, chemins, noms de fichier, ou conventions de branche. Si Mistral peut tenir ce cadre avec un glossaire verrouille, Codex peut deleguer une partie recurrente de localisation documentaire tout en gardant une verification locale rapide.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - traduire une note repo publique du francais vers l'anglais;
  - preserver exactement `Codex`, `Mistral`, `README.md`, `npm run validate`, `npm run check:helper`, `docs/daily-tests/`, et `main`;
  - produire un JSON strict compare a un oracle local ferme;
  - signaler toute invention via `invented_items`.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

Routage observe:

- `select-model` a recommande `devstral-latest` a cause du signal `repo` structure;
- `recommend` a retourne `suitable: false` avec une heuristique trop conservative;
- une fois la tache resserree en schema JSON et oracle local, les quatre modeles testes ont pourtant passe la validation exacte.

## Resume des prompts et du contexte

- Note source FR transmise:
  - titre, resume, et cinq consignes publiques courtes;
  - preservation obligatoire des termes verrouilles;
  - interdiction d'inventer dependances, scripts, ou etapes CI.
- Prompt principal:
  - schema JSON strict avec `title_en`, `summary_en`, `bullets_en`, `locked_terms_preserved`, `invented_items`;
  - chaines anglaises exactes imposees pour les champs attendus;
  - aucun texte hors JSON.
- Reference FR:
  - courte note Markdown pour expliquer ce workflow dans `mistral-subagent/references/`.

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 655 | 154 | 809 | `JSON` exact, passe l'oracle |
| `mistral-medium-3.5` | 655 | 177 | 832 | `JSON` exact, meilleur brouillon de reference FR |
| `mistral-large-latest` | 655 | 177 | 832 | `JSON` exact, bonne seconde verification publique |
| `devstral-latest` | 655 | 177 | 832 | `JSON` exact malgre le biais repo du routage |
| `mistral-medium-3.5` reference | 312 | 225 | 537 | brouillon utile pour la reference FR |
| `mistral-small-latest` rapport | 474 | 207 | 681 | rejete, car invente des modeles et un statut faux |

Tokens Mistral utiles retenus pour ce run:

- `mistral-small-latest`: `809`
- `mistral-medium-3.5`: `832`
- `mistral-large-latest`: `832`
- `devstral-latest`: `832`
- `mistral-medium-3.5` reference: `537`

Total utile retenu: `3842` tokens.

Sorties exclues du comptage utile:

- le brouillon de rapport `mistral-small-latest`, car il a invente des modeles et un statut non conforme;
- la recommandation heuristique `recommend`, qui n'est pas une sortie Mistral utile appliquee a l'artefact final.

## Resultat

Validation positive sous verification Codex.

- Les quatre modeles testes ont produit un `JSON` exactement egal a l'oracle local ferme.
- `mistral-small-latest` suffit deja quand la traduction est tres bornee et les chaines cibles sont imposees.
- `mistral-medium-3.5` a fourni en plus un brouillon de reference FR exploitable apres resserrage local.
- Le principal point a retenir n'est pas la traduction elle-meme, mais le cadrage:
  - glossaire verrouille;
  - schema ferme;
  - verification locale stricte;
  - rejet systematique des sorties qui inventent du contexte.

Changements repo appliques a partir des sorties retenues:

- ajout de `mistral-subagent/references/translation-repo-note-fr-en-fr.md`
- ajout du lien de reference dans `README.md`
- ajout de la reference dans `mistral-subagent/SKILL.md`

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Traduction structuree d'une note repo publique du francais vers l'anglais avec glossaire verrouille"
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Traduction structuree FR vers EN d'une note repo publique avec commandes et chemins verrouilles"
```

Appels Mistral:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-12-translation-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-12-translation-context.md" --model mistral-small-latest --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-12-translation-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-12-translation-context.md" --model mistral-large-latest --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-12-translation-context.md" --model devstral-latest --max-tokens 1200 --temperature 0.05 --json
```

Verification locale:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-12-translation-repo-note-validation-summary.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-12-translation-expected.json -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
```

## Limitations

- le test valide une note repo courte et tres contrainte, pas une traduction longue ou stylistiquement libre;
- `recommend` sous-estime encore ce type de tache des que le libelle ressemble a un travail repo plus large;
- une egalite exacte a l'oracle n'est viable que si les chaines cibles sont imposees a l'avance.

## Prochaine action

Tester une capacite recurrente voisine non encore couverte, par exemple transcription/audio planning borne, moderation/classification sur lot reel plus large, ou generation README/doc plus libre avec verification par champs critiques plutot que par egalite totale.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme **validee** pour la traduction structuree FR vers EN de notes repo publiques bornees avec glossaire verrouille. Estimation cumulative apres ce run: **72 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-12-translation-source-note-fr.txt`
- `docs/daily-tests/evidence/2026-06-12-translation-context.md`
- `docs/daily-tests/evidence/2026-06-12-translation-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-translation-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-translation-expected.json`
- `docs/daily-tests/evidence/2026-06-12-translation-select-model.json`
- `docs/daily-tests/evidence/2026-06-12-translation-recommend.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-small-translation.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-medium35-translation.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-large-translation.json`
- `docs/daily-tests/evidence/2026-06-12-devstral-translation.json`
- `docs/daily-tests/evidence/2026-06-12-translation-repo-note-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-12-translation-reference-context.md`
- `docs/daily-tests/evidence/2026-06-12-translation-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-mistral-medium35-translation-reference.json`
- `docs/daily-tests/evidence/2026-06-12-translation-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-mistral-small-translation-report.json`
