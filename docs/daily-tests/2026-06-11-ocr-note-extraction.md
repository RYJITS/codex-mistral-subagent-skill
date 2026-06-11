# Test quotidien 2026-06-11 - extraction OCR structuree de note projet

## Statut

**Valide**

## Categorie de tache

OCR/document extraction structuree sur capture de note projet, avec sortie JSON stricte et verification contre un oracle local.

## Pourquoi c'est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` manipulent souvent des captures de briefs, notes de QA, et mini comptes-rendus visuels avant patch ou publication. Si Mistral sait extraire de facon fiable ces informations en JSON borne, Codex peut deleguer une premiere passe recurrente de tri, de structuration, et de suivi sans relire manuellement chaque capture.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - lire une capture PNG non sensible de note projet;
  - extraire `project`, `category`, `priority`, `status`, `owner`, `deadline`, `commands`, `risks`, `decision`, `next_action`;
  - distinguer correctement `actions` et `commands`;
  - comparer localement la sortie a un oracle JSON ferme.

## Modeles testes

- `mistral-ocr-latest` via `POST /v1/ocr` avec `document_annotation_format.type=json_schema`
- `mistral-small-latest` via vision/chat
- `mistral-medium-3.5` via vision/chat
- `mistral-large-latest` via vision/chat

## Resume des prompts et du contexte

- Artefact source:
  - `docs/daily-tests/evidence/2026-06-11-ocr-note.png`
  - note projet locale non sensible, en francais ASCII
- Oracle:
  - `docs/daily-tests/evidence/2026-06-11-ocr-expected.json`
- Prompt principal:
  - JSON strict avec `project`, `category`, `priority`, `status`, `owner`, `deadline`, `commands`, `risks`, `decision`, `next_action`
  - contrainte de ne rien inventer
- Retry strict:
  - precision explicite que `commands` doit contenir seulement les lignes shell contenant `npm run`
  - exclusion des autres actions numerotees

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-ocr-latest` premier prompt | n/a | n/a | n/a | `usage_info`: `pages_processed=1`, `doc_size_bytes=50812`; erreur sur `commands` |
| `mistral-ocr-latest` retry strict | n/a | n/a | n/a | `10/10` apres normalisation locale autorisee |
| `mistral-small-latest` premier prompt | 2359 | 148 | 2507 | `9/10`, melange `actions` et `commands` |
| `mistral-medium-3.5` premier prompt | 2359 | 171 | 2530 | `9/10`, melange `actions` et `commands` |
| `mistral-medium-3.5` retry strict | 2353 | 136 | 2489 | `10/10`, sortie utile retenue |
| `mistral-large-latest` premier prompt | 2359 | 142 | 2501 | `10/10`, meilleure sortie directe |
| `mistral-large-latest` brouillon reference | 687 | 406 | 1093 | brouillon utile pour la reference FR |
| `mistral-medium-3.5` brouillon rapport | 664 | 1095 | 1759 | brouillon utile pour le rapport quotidien |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5` retry strict: `2489`
- `mistral-large-latest` premier prompt: `2501`
- `mistral-large-latest` brouillon reference: `1093`
- `mistral-medium-3.5` brouillon rapport: `1759`

Total utile comptabilise avec tokens exposes: `7842`.

Sortie utile additionnelle sans metrique tokens exposee:

- `mistral-ocr-latest` retry strict, retenu via `usage_info` OCR seulement.

## Resultat

Validation positive sous verification Codex.

- `mistral-large-latest` a produit des le premier essai une extraction `10/10` directement exploitable.
- `mistral-ocr-latest` a bien lu la structure du document, mais le premier prompt a melange `actions` et `commands`; le retry strict a corrige le point et a atteint `10/10`.
- `mistral-medium-3.5` a suivi la meme dynamique: premier prompt a `9/10`, retry strict a `10/10`.
- `mistral-small-latest` reste utile pour une passe economique, mais pas assez fiable ici sans relance.

Sorties Mistral directement utilisees:

- `mistral-large-latest` premier prompt comme meilleure extraction directe;
- `mistral-ocr-latest` retry strict comme validation de la route OCR dediee;
- `mistral-medium-3.5` retry strict comme fallback plus compact;
- deux brouillons FR de `mistral-large-latest` et `mistral-medium-3.5` pour rediger la reference et le rapport, ensuite verifies et resserres par Codex.

Normalisations locales autorisees et appliquees:

- suppression du prefixe `lancer ` devant une commande shell;
- comparaison accent-insensible pour eviter un rejet artificiel sur `apres` vs `apres` accentue.

## Commandes de validation

Routage et configuration:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Extraire une capture de note projet en JSON strict depuis une image PNG"
```

Verification locale:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-11-ocr-validation-summary.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-11-mistral-ocr-structured-retry.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-11-mistral-large-latest-ocr-chat.json -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
```

## Limitations

- la distinction `actions` vs `commands` est sensible au prompt; il faut expliciter que seules les lignes contenant `npm run` doivent apparaitre dans `commands`
- la route OCR expose `usage_info` mais pas les tokens comme les modeles chat
- ce test valide une capture de note projet propre et lisible; il ne couvre pas encore des documents plus denses, flous, ou multi-pages

## Prochaine action

Tester une capacite specialisee voisine avec oracle local clair, par exemple transcription audio bornee, moderation/classification sur lot plus large, ou OCR sur document plus dense qu'une note projet simple.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme **validee** pour l'extraction OCR/document structuree sur captures de notes projet bornees. Estimation cumulative apres ce run: **68 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-11-ocr-note.png`
- `docs/daily-tests/evidence/2026-06-11-ocr-note-source.txt`
- `docs/daily-tests/evidence/2026-06-11-ocr-expected.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-extraction-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-ocr-extraction-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-structured.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-structured-retry.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-small-latest-ocr-chat.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium-3.5-ocr-chat.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium-3.5-ocr-chat-retry.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-large-latest-ocr-chat.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-reference-context.md`
- `docs/daily-tests/evidence/2026-06-11-ocr-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-mistral-large-ocr-reference-draft.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium35-ocr-report-draft.json`
