# Test quotidien 2026-06-11 - extraction OCR structuree de contact sheet

## Statut

**Valide**

## Categorie de tache

OCR/document extraction structuree sur contact sheet image de projet video/WebGL, avec comparaison a un oracle local verifie.

## Pourquoi c'est important pour les projets reels

Les projets video du cerveau central utilisent deja des contact sheets pour verifier vite une timeline, des scenes, et des volumes de frames sans relire tout le manifest. Si Mistral sait extraire une structure fiable depuis ce type d'image, Codex peut deleguer une premiere passe recurrente de QA documentaire avant verification locale.

## Projet et capacite testes

- Projet source:
  - `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES`
- Artefact teste:
  - `examples/contact-sheets/c2r-v9-micro-pilot-timeline-contact-sheet.jpg`
- Capacite testee:
  - extraire `scene_count`, `scene_id`, `frame_count`, `resolution`, et `label_text` depuis le contact sheet;
  - comparer automatiquement la sortie a un gold set verifie via `docs/C2R_V9_MICRO_PILOT_MANIFEST.json` et `docs/C2R_V9_MICRO_PILOT_REPORT.md`;
  - documenter le workflow valide dans `mistral-subagent/references`.

## Modeles testes

- `mistral-ocr-latest`
- `mistral-small-latest`
- `mistral-medium-latest`
- `mistral-large-latest`

## Resume des prompts et du contexte

- Contexte transmis:
  - un seul contact sheet reel non sensible;
  - l'oracle local deja verifie par Codex;
  - un schema ferme limite a `scene_count` et `scenes[]`;
  - la regle stricte: mettre `null` pour tout champ illisible et ne rien inventer.
- Prompt principal:
  - retourner uniquement un JSON valide;
  - conserver l'ordre visuel;
  - extraire `scene_id`, `frame_count`, `resolution`, `label_text`;
  - ne jamais corriger avec un savoir externe.
- Prompt OCR:
  - meme contrat, mais via `document_annotation_prompt` sur `POST /v1/ocr`.

## Usage et tokens

| Modele | Usage | Observation |
|---|---|---|
| `mistral-ocr-latest` premier essai | pas de tokens exposes | erreur `400`: `json_object` rejete |
| `mistral-ocr-latest` retry | `pages_processed=1`, `doc_size_bytes=432960` | JSON valide avec `json_schema` |
| `mistral-small-latest` | `3012` prompt, `574` completion, `3586` total | `9/9` scenes exactes |
| `mistral-medium-latest` | `3012` prompt, `631` completion, `3643` total | `9/9` scenes exactes |
| `mistral-large-latest` | `3012` prompt, `668` completion, `3680` total | `9/9` scenes exactes |
| `mistral-medium-latest` reference | `720` prompt, `501` completion, `1221` total | brouillon retenu comme base structurelle |
| `mistral-large-latest` reference | `708` prompt, `579` completion, `1287` total | brouillon non retenu, commande inventee |

Tokens Mistral utiles retenus pour ce run:

- `mistral-ocr-latest` retry: sortie appliquee comme preuve principale, sans comptage tokens detaille expose par l'endpoint;
- `mistral-small-latest`: `3586`
- `mistral-medium-latest`: `3643`
- `mistral-large-latest`: `3680`
- `mistral-medium-latest` reference: `1221`

Total utile mesurable retenu: `12130` tokens chat, plus `1` page OCR utile hors comptage token detaille.

Sorties exclues du comptage utile:

- `mistral-ocr-latest` premier essai, rejete par erreur `400`;
- `mistral-large-latest` reference, car le draft proposait une commande inventee non presente dans le repo.

## Resultat

Validation positive sous verification Codex.

- Les trois modeles vision chat ont retrouve exactement les `9` scenes attendues, avec `scene 01 = 99 frames`, `scene 02-09 = 66 frames`, et `1024x576` partout.
- `mistral-ocr-latest` a confirme le meme resultat apres correction du format de sortie vers `json_schema`.
- Le point operationnel le plus utile du jour est precis:
  - le `2026-06-11`, sur cette cle et cet endpoint, `document_annotation_format.type=json_object` a provoque une erreur `400`;
  - le retry en `json_schema` a fonctionne immediatement.
- Le repo est mis a jour avec une nouvelle reference FR reutilisable pour ce workflow OCR borne.

Changements repo appliques a partir des sorties retenues:

- ajout de `mistral-subagent/references/ocr-contact-sheet-extraction-fr.md`
- ajout du lien de reference dans `README.md`
- ajout de la reference dans `mistral-subagent/SKILL.md`

## Commandes de validation

Configuration et capacites:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs models
```

Verification de l'oracle local:

```powershell
Select-String -Path "D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_REPORT.md","D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_MANIFEST.json" -Pattern '99 frames|66 frames|1024x576'
```

Verification des sorties retenues:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-validation-summary.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-11-mistral-ocr-contact-sheet-retry.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-11-mistral-small-latest-contact-sheet.json -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Le test valide une extraction structuree sur un contact sheet a texte lisible, pas tous les documents image possibles.
- L'endpoint OCR n'a pas expose de comptage token detaille dans cette reponse, seulement `pages_processed` et `doc_size_bytes`.
- La reference ajoutee documente un workflow d'appel HTTP direct, car le helper local n'emballe pas encore un sous-commande OCR dediee.

## Prochaine action

Tester une capacite specialisee voisine avec preuve locale claire, par exemple transcription audio borne, moderation/classification avec gold set plus large, ou extraction OCR sur document plus dense et moins propre qu'un contact sheet.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour les extractions OCR structurees sur artefacts visuels reels de projet. Estimation cumulative apres ce run: **68 pourcent** de couverture des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-context.md`
- `docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-expected.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-contact-sheet.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-contact-sheet-retry.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-small-latest-contact-sheet.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium-latest-contact-sheet.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-large-latest-contact-sheet.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-reference-context.md`
- `docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium-ocr-reference.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-large-ocr-reference.json`
