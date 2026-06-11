# Workflow valide OCR contact sheet

Capacite validee le 2026-06-11:

- extraction OCR structuree d'un contact sheet reel de projet video/WebGL
- image source:
  - `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\examples\contact-sheets\c2r-v9-micro-pilot-timeline-contact-sheet.jpg`
- oracle verifie par Codex:
  - `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_MANIFEST.json`
  - `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_REPORT.md`

Resultat utile:

- `mistral-ocr-latest` a d'abord retourne une erreur `400` avec `document_annotation_format.type=json_object`
- le retry avec `document_annotation_format.type=json_schema` a reussi
- `mistral-small-latest`, `mistral-medium-latest`, et `mistral-large-latest` via vision chat ont aussi retourne un JSON exploitable
- toutes les sorties utiles retenues ont retrouve:
  - `scene_count = 9`
  - `scene 01 = 99 frames`
  - `scene 02-09 = 66 frames`
  - `resolution = 1024x576`

Ce que la reference doit transmettre:

- quand choisir `mistral-ocr-latest` plutot qu'un modele vision general
- rappeler que l'endpoint OCR demande ici un `json_schema`
- schema minimal conseille:
  - `scene_count`
  - `scenes[].scene_id`
  - `scenes[].frame_count`
  - `scenes[].resolution`
  - `scenes[].label_text`
- validation locale minimale:
  - comparer avec manifest/report s'ils existent
  - rejeter toute scene inventee
  - normaliser `scene_id` sur deux chiffres
  - si le texte n'est pas lisible, renvoyer `null`

Style attendu:

- Markdown public en francais
- ASCII uniquement
- concis et reutilisable dans le skill
