# Test quotidien 2026-06-11 - OCR et extraction structuree d'une fiche pedagogique

## Statut

**Valide**

## Categorie de tache

OCR/document extraction structuree vers JSON borne pour une fiche pedagogique non sensible.

## Pourquoi c'est important pour les projets reels

Dans `D:\00_Cerveau_IA`, plusieurs flux manipulent des PDF, previews PNG, screenshots de pages, notes visuelles et supports pedagogiques. Si Mistral peut extraire de facon fiable un schema JSON verifiable depuis ce type d'artefact, Codex gagne du temps sur l'indexation, la memoire projet, la preparation RAG, et les futures automatisations de catalogage de contenu.

## Artefacts et oracle

- Preview PNG testee:
  - `D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h_preview_full.png`
- PDF teste:
  - `D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h.pdf`
- Oracle local de verification:
  - `D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h.html`

Schema cible valide:

- `title`
- `subtitle`
- `level`
- `student_fields`
- `sections[].{id,title,statement,question_count,questions,key_values}`
- `hint`
- `footer`

## Modeles testes

- `mistral-ocr-latest`
- `mistral-small-latest`
- `mistral-medium-3.5`

## Resume des prompts et du contexte

- OCR:
  - utilisation de `mistral-ocr-latest` sur la preview PNG et le PDF
  - recuperation du JSON OCR brut avec `header`, `markdown`, `footer`
- Normalisation stricte:
  - passage du JSON OCR PNG a `mistral-small-latest` et `mistral-medium-3.5`
  - schema fixe et consignes strictes sur `key_values`
  - retry cible, puis retry final sur `mistral-medium-3.5` pour imposer `student_fields=["Prenom","Date"]` et retirer tout `:`

## Usage et tokens

Usage OCR disponible:

| Modele | Support | Usage dispo | Observation |
|---|---|---|---|
| `mistral-ocr-latest` | preview PNG | `pages_processed=1`, `doc_size_bytes=79449` | complet, tous les checks de completude passent |
| `mistral-ocr-latest` | PDF page `0` | `pages_processed=1`, `doc_size_bytes=71167` | partiel, seulement la premiere partie utile |

Usage chat disponible:

| Modele | Variante | Prompt | Completion | Total | Observation |
|---|---|---:|---:|---:|---|
| `mistral-small-latest` | normalisation initiale | 1018 | 698 | 1716 | invente des `key_values` pedagogiques |
| `mistral-medium-3.5` | normalisation initiale | 1018 | 737 | 1755 | presque bon, mais `key_values` incomplets |
| `mistral-small-latest` | retry | 997 | 691 | 1688 | ajoute encore des valeurs derivees |
| `mistral-medium-3.5` | retry | 997 | 755 | 1752 | semantiquement bon, mais `student_fields` gardent `:` |
| `mistral-medium-3.5` | retry final applique | 976 | 745 | 1721 | JSON final valide contre l'oracle |
| `mistral-medium-3.5` | draft reference FR | 603 | 454 | 1057 | brouillon utile pour la reference du skill |

Tokens Mistral utiles retenus avec mesure disponible:

- `mistral-medium-3.5` retry final: `1721`
- `mistral-medium-3.5` draft reference FR: `1057`

Total utile mesure cote chat: `2778` tokens.

Sortie Mistral directement appliquee sans token OCR disponible:

- JSON OCR brut `mistral-ocr-latest` sur la preview PNG, utilise comme base du flux valide

## Resultat

Validation positive sous verification Codex.

- `mistral-ocr-latest` sur la preview PNG a fourni un OCR complet contenant titre, sous-titre, cinq sections, astuce et footer.
- le PDF en `page 0` n'a pas remonte toute la fiche; il n'a donc pas ete retenu comme support principal.
- `mistral-small-latest` n'est pas fiable ici pour les `key_values`: il invente des valeurs derivees ou des categories pedagogiques.
- `mistral-medium-3.5` devient fiable apres un prompt final tres borne: le JSON final matche l'oracle local sur tous les champs verifies.
- le workflow retenu est donc: `mistral-ocr-latest` sur la meilleure preview PNG, puis `mistral-medium-3.5` pour la normalisation stricte en JSON.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "OCR et extraction structuree d'une fiche pedagogique PDF/PNG non sensible pour reconstituer titre, niveau, sections et items de questions en JSON"
```

OCR brut:

```powershell
curl.exe -sS -X POST "https://api.mistral.ai/v1/files" -H "Authorization: Bearer $MISTRAL_API_KEY" -F "purpose=ocr" -F "file=@D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h_preview_full.png"
curl.exe -sS -X POST "https://api.mistral.ai/v1/files" -H "Authorization: Bearer $MISTRAL_API_KEY" -F "purpose=ocr" -F "file=@D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h.pdf"
```

Normalisation stricte:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-11-ocr-worksheet-normalize-final-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-11-mistral-ocr-worksheet-png.json" --model mistral-medium-3.5 --max-tokens 2200 --temperature 0.05 --json
```

Verification locale:

```powershell
Get-Content "docs/daily-tests/evidence/2026-06-11-ocr-worksheet-validation-summary.json" -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
git status --short
```

## Limitations

- `document_annotation_format` sur `POST /v1/ocr` demande un vrai `json_schema`; un simple mode JSON ne suffit pas dans ce workflow.
- la preview PNG a ete plus fiable que le PDF dans ce test; il ne faut pas supposer qu'un PDF sera toujours le meilleur support.
- certains artefacts OCR concurrents non suivis existaient deja dans le repo au debut de ce run; ils n'ont pas ete comptes dans la validation du jour.
- les accents issus du flux OCR/chat peuvent varier; la verification locale doit rester basee sur un oracle normalise.

## Prochaine action

Tester une capacite recurrente encore non couverte mais proche d'un flux reel, par exemple transcription/audio planning borne ou traduction structuree FR/EN de notes repo et supports de projet.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme **validee** pour l'extraction structuree d'un document non sensible a partir d'une preview propre, avec verification locale. Estimation cumulative apres ce run: **66 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-context.md`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-annotation-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-normalize-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-normalize-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-normalize-final-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-expected.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-worksheet-png.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-worksheet-png-markdown.md`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-worksheet-pdf.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-ocr-worksheet-pdf-markdown.md`
- `docs/daily-tests/evidence/2026-06-11-mistral-small-ocr-worksheet-normalize.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium35-ocr-worksheet-normalize.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-small-ocr-worksheet-normalize-retry.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium35-ocr-worksheet-normalize-retry.json`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium35-ocr-worksheet-normalize-final.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-reference-context.md`
- `docs/daily-tests/evidence/2026-06-11-ocr-worksheet-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-11-mistral-medium35-ocr-worksheet-reference.json`
