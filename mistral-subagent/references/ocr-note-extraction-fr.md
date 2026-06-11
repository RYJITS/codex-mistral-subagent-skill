# OCR structure pour note projet

Utiliser cette note quand Codex veut deleguer a Mistral une extraction OCR structuree depuis une capture de note projet, de QA, ou de brief visuel non sensible.

## Quand l'utiliser

- capture PNG/JPG d'une note projet courte et lisible;
- besoin de transformer vite une capture en JSON borne pour suivi, tri, ou preparation de patch;
- verification locale possible contre un oracle ou une structure attendue.

Le test du `2026-06-11` a valide ce workflow sur une note projet avec metadonnees, risques, decision, et commandes shell.

## Routage recommande

- `mistral-large-latest`: meilleur premier choix si une seule image doit donner un JSON utile des le premier prompt
- `mistral-ocr-latest`: route OCR dediee sur `POST /v1/ocr`, a privilegier si Codex veut une extraction document plus stricte avec `document_annotation_format.type=json_schema`
- `mistral-medium-3.5`: bon fallback moins couteux si un retry strict est acceptable
- `mistral-small-latest`: utile pour une premiere passe economique, mais pas assez fiable ici sur le champ `commands`

Point observe le `2026-06-11`:

- le premier prompt a tendance a melanger `actions` et `commands`;
- un retry explicite qui reserve `commands` aux lignes contenant `npm run` corrige ce point;
- la route OCR dediee a reussi avec `json_schema`, pas avec une demande trop vague sur les commandes.

## Contrat de sortie conseille

Demander un JSON strict et minimal, par exemple:

- `project`
- `category`
- `priority`
- `status`
- `owner`
- `deadline`
- `commands`
- `risks`
- `decision`
- `next_action`

Regles de prompt a rappeler:

- separer explicitement les `actions` de texte libre et les `commands` shell;
- pour `commands`, ne garder que les lignes contenant `npm run`;
- ne rien inventer si un champ est absent;
- reprendre `decision` et `next_action` sans reformulation.

## Validation locale

Verifier chaque sortie avant usage:

1. parser le JSON et rejeter toute sortie non conforme;
2. retirer au besoin le prefixe `lancer ` devant une commande shell;
3. comparer la sortie a l'oracle local ou a la structure attendue;
4. comparer de facon accent-insensible si la capture est ASCII mais que la sortie reintroduit des diacritiques;
5. rejeter toute commande inventee ou toute confusion persistante entre `actions` et `commands`.

Validation minimale utile:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-11-ocr-validation-summary.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-11-mistral-ocr-structured-retry.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-11-mistral-large-latest-ocr-chat.json -Raw | ConvertFrom-Json
```

## Limites

- ce workflow valide une note projet propre et lisible, pas encore un document dense ou multi-page;
- `mistral-ocr-latest` expose `usage_info` utile, mais pas les tokens comme les modeles chat;
- sans prompt strict sur `commands`, plusieurs modeles incluent aussi des actions numerotees.

## Verdict de delegation

Capacite validee pour une extraction OCR structuree et bornee sur captures de notes projet, si:

- le JSON attendu est ferme;
- Codex garde l'oracle local et la normalisation minimale;
- `mistral-large-latest` sert de premier choix direct sur image simple;
- `mistral-ocr-latest` reste disponible pour une route OCR dediee avec `json_schema`.
