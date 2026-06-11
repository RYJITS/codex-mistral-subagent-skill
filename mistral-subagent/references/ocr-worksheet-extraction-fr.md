# OCR de fiche pedagogique vers JSON borne

## Principe

Utiliser `mistral-ocr-latest` pour recuperer un OCR propre sur un document non sensible, puis passer ce JSON OCR a `mistral-medium-3.5` pour reconstruire un schema strict verifie localement. Ce workflow a ete valide sur une fiche pedagogique `9H` issue de `D:\00_Cerveau_IA`.

## Modeles recommandes

- `mistral-ocr-latest`: premiere passe OCR pour recuperer `header`, `markdown`, et `footer`.
- `mistral-medium-3.5`: normalisation stricte en JSON quand il faut des champs bornes et des `key_values` uniquement visibles.
- `mistral-small-latest`: possible pour une premiere passe, mais non retenu ici a cause d'inventions sur `key_values`.

## Workflow recommande

1. Choisir le support le plus net. Dans ce test, la preview PNG a ete plus fiable que le PDF page `0`.
2. Uploader le fichier via `POST /v1/files` avec `purpose=ocr`.
3. Appeler `POST /v1/ocr` avec `mistral-ocr-latest` pour recuperer le JSON OCR brut.
4. Donner ce JSON OCR a `mistral-medium-3.5` avec un prompt qui fixe exactement le schema final.
5. Verifier localement contre un oracle source avant de compter la sortie comme validee.

## Limites

- Un PDF peut ne remonter qu'une partie utile du contenu si la page capture mal la fiche ou si le document est morcele.
- `document_annotation_format` demande un vrai `json_schema`; si ce n'est pas deja pret, la voie la plus robuste reste OCR brut puis normalisation chat.
- Les champs delicats comme `student_fields` ou `key_values` demandent parfois un retry plus strict.

## Commandes utiles

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "OCR et extraction structuree d'une fiche pedagogique PDF/PNG non sensible pour reconstituer titre, niveau, sections et items de questions en JSON"
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file docs/daily-tests/evidence/2026-06-11-mistral-ocr-worksheet-png.json --model mistral-medium-3.5 --max-tokens 2200 --temperature 0.05 --json
```
