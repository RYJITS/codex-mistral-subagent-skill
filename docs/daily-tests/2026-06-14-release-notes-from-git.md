# Test quotidien 2026-06-14 - notes de version publiques FR depuis Git et rapports quotidiens

## Statut

**Valide**

## Categorie de tache

Redaction structuree d'une note de version publique FR a partir d'un `git log` borne et de rapports quotidiens deja verifies localement.

## Pourquoi c'est important pour les projets reels

Les repos publics et multi-projets de `D:\00_Cerveau_IA` ont regulierement besoin de changelogs, notes de version, et handoffs courts pour expliquer ce qui a ete valide, ce qui reste fragile, et quels artefacts ont change. Si Mistral peut produire une premiere passe fiable sur ce format borne, Codex peut deleguer une partie recurrente de la communication de release sans relire tout l'historique a la main.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
- Capacite testee:
  - lire `6` commits exacts via `git log`;
  - resumer `6` rapports quotidiens exacts;
  - conserver les comptes `Valide`, `Partiellement valide`, `Non valide`;
  - citer uniquement les bons hashes et chemins de preuves;
  - fournir une base directement exploitable pour une note publique appliquee dans `docs/LAB_RELEASE_NOTES_2026-06-12_2026-06-13_FR.md`.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

Modele utilise pour la reference skill appliquee:

- `mistral-medium-3.5`

## Resume des prompts et du contexte

- Contexte borne:
  - plage Git `00f902c..e2c490b`
  - `6` hashes exacts
  - `6` rapports quotidiens exacts sous `docs/daily-tests/`
  - compte de statut ferme: `4` valides, `1` partiellement valide, `1` non valide
  - interdiction d'inventer d'autres fichiers, statuts, ou commits
- Prompt principal:
  - sortie JSON stricte avec periode, comptes, `highlights_fr`, `watchouts_fr`, hashes ordonnes, et chemins de preuves ordonnes
  - resume borne entre `140` et `220` caracteres
- Validation locale:
  - script `docs/daily-tests/evidence/2026-06-14-validate-release-notes.mjs`
  - comparaison stricte contre `docs/daily-tests/evidence/2026-06-14-release-notes-expected.json`

## Usage et tokens

Runs de la capacite:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1918 | 480 | 2398 | Valide |
| `mistral-medium-3.5` | 1918 | 482 | 2400 | Valide |
| `mistral-large-latest` | 1918 | 588 | 2506 | Non retenu, resume trop long |
| `devstral-latest` | 1918 | 518 | 2436 | Valide |

Run de reference appliquee:

| Modele | Prompt | Completion | Total | Usage |
|---|---:|---:|---:|---|
| `mistral-medium-3.5` reference | 557 | 311 | 868 | Brouillon utile, normalise puis applique |

Tokens Mistral utiles retenus:

- `mistral-small-latest`: `2398`
- `mistral-medium-3.5`: `2400`
- `devstral-latest`: `2436`
- `mistral-medium-3.5` reference: `868`

Total utile retenu: `8102` tokens.

Sorties non retenues:

- `mistral-large-latest`: exclu du comptage utile pour cette capacite, car le resume depassait la borne de longueur definie par l'oracle local

## Resultat

Validation positive sous verification Codex.

- `mistral-small-latest`, `mistral-medium-3.5`, et `devstral-latest` ont tous passe l'oracle local ferme.
- `mistral-medium-3.5` a ete retenu comme meilleur defaut: cout proche du plus petit modele, schema exact, resume assez dense sans depasser la borne.
- `devstral-latest` reste une bonne alternative repo-aware.
- `mistral-large-latest` n'est pas invalide au sens factuel, mais il ne tient pas ici le contrat editorial borne sur la longueur du resume.
- La sortie retenue a ete appliquee dans `docs/LAB_RELEASE_NOTES_2026-06-12_2026-06-13_FR.md`.
- Le workflow a aussi ete capitalise dans `mistral-subagent/references/release-notes-from-git-fr.md`.

## Commandes de validation

- `node docs/daily-tests/evidence/2026-06-14-validate-release-notes.mjs D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill docs/daily-tests/evidence/2026-06-14-mistral-medium-3.5-release-notes-candidate.json`
- `npm run validate`
- `npm run check:helper`
- `git log --reverse --date=short --pretty=format:"%h | %ad | %s" 00f902c..e2c490b`

## Limitations

- Ce workflow reste fiable seulement si le contexte est fortement borne et si les preuves sont deja preparees par Codex.
- Le modele peut rester factuellement correct tout en violant le contrat editorial, comme ici avec `mistral-large-latest`.
- La transformation finale du JSON vers un Markdown public reste plus sure cote Codex que cote Mistral direct.

## Prochaine action

Tester une capacite voisine de communication recurrente, par exemple la redaction FR d'un commentaire GitHub ou d'un resume PR borne a partir d'un diff et d'un rapport valide.

## Contribution vers l'objectif des 70 pourcent

Oui.

Cette capacite compte vers l'objectif, car la redaction de notes de version et de changelogs publics est recurrente, borne, et a ete validee ici avec un oracle local net avant integration par Codex.
