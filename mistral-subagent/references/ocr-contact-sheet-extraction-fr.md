# OCR structure pour contact sheet video

Utiliser cette note quand Codex veut deleguer a Mistral une extraction OCR structuree depuis un contact sheet reel de projet video ou WebGL.

## Quand l'utiliser

- contact sheet de timeline ou de QA avec texte lisible sur chaque ligne;
- verification rapide des scenes, du nombre de frames, ou de la resolution;
- preparation d'un JSON borne que Codex comparera ensuite a un manifest, un report, ou un autre oracle local.

Ne pas deleguer l'arbitrage final de qualite visuelle. Mistral peut extraire la structure visible, pas valider seul la coherence produit.

## Routage recommande

- `mistral-ocr-latest`: choix principal pour une extraction OCR stricte sur image ou document.
- `mistral-small-latest`: bon fallback vision quand il faut un JSON compact sur une seule image et qu'un endpoint OCR dedie n'est pas pratique.
- `mistral-medium-latest` ou `mistral-large-latest`: seconde passe utile si Codex veut une comparaison de sortie ou une reformulation plus lisible.

Point observe le `2026-06-11`:

- l'endpoint `POST /v1/ocr` a rejete `document_annotation_format.type=json_object` avec une erreur `400`;
- le meme workflow a reussi avec `document_annotation_format.type=json_schema`.

Pour ce type de delegation, preferer donc un schema JSON explicite sur l'endpoint OCR.

## Contrat de sortie conseille

Demander un JSON strict et minimal, par exemple:

- `scene_count`
- `scenes[].scene_id`
- `scenes[].frame_count`
- `scenes[].resolution`
- `scenes[].label_text`

Regles de prompt a rappeler:

- conserver l'ordre visuel;
- mettre `null` pour tout champ illisible;
- ne jamais inventer une scene absente;
- ne jamais corriger avec un savoir externe non visible dans l'image.

## Commande type

Exemple PowerShell borne avec appel HTTP direct:

```powershell
$apiKey = ((Get-Content "D:\00_Cerveau_IA\API\env.Local") | Where-Object { $_ -match '^MISTRAL\\.API_KEY=' }) -replace '^MISTRAL\\.API_KEY=', ''
$imageBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("D:\path\contact-sheet.jpg"))
$body = @{
  model = "mistral-ocr-latest"
  document = @{
    type = "image_url"
    image_url = "data:image/jpeg;base64,$imageBase64"
  }
  document_annotation_format = @{
    type = "json_schema"
    json_schema = @{
      name = "contact_sheet_extraction"
      schema = @{
        type = "object"
        additionalProperties = $false
      }
    }
  }
  document_annotation_prompt = "Retourne uniquement un JSON valide avec scene_count et scenes."
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri "https://api.mistral.ai/v1/ocr" -Headers @{ Authorization = "Bearer $apiKey" } -ContentType "application/json" -Body $body
```

## Validation locale

Verifier chaque sortie avant usage:

1. parser le JSON et rejeter toute sortie non conforme;
2. normaliser `scene_id` sur deux chiffres;
3. comparer `scene_count`, `frame_count`, et `resolution` a un oracle local si disponible;
4. rejeter toute scene inventee ou toute correction implicite;
5. garder `label_text` comme aide OCR, pas comme verite source si le texte est degrade.

Validation minimale utile:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-11-ocr-contact-sheet-validation-summary.json -Raw | ConvertFrom-Json
Select-String -Path "D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_REPORT.md","D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_MANIFEST.json" -Pattern '99 frames|66 frames|1024x576'
```

## Verdict de delegation

Capacite validee pour une extraction OCR structuree et bornee sur contact sheets reels, si:

- le schema attendu est explicite;
- Codex garde le filtrage du contexte et l'oracle local;
- l'endpoint OCR utilise `json_schema`;
- les sorties generalistes vision ne servent qu'en fallback ou en comparaison.
