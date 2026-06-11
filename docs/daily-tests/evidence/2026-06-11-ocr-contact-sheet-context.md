# Contexte borne pour test OCR sur contact sheet reel

Projet source:

- `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES`

Artefact OCR:

- `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\examples\contact-sheets\c2r-v9-micro-pilot-timeline-contact-sheet.jpg`

Pourquoi ce test compte pour les projets reels:

- Les projets video/WebGL du cerveau central utilisent des contact sheets pour valider vite les scenes, le nombre de frames, et la coherence d'une timeline.
- Si Mistral sait extraire une structure fiable depuis ce type d'image sans toucher aux fichiers projet, Codex peut deleguer une premiere passe de QA documentaire avant verification locale.

Oracle verifie par Codex avant delegation:

- Source 1: `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_MANIFEST.json`
- Source 2: `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES\docs\C2R_V9_MICRO_PILOT_REPORT.md`

Valeurs attendues:

- `scene_count`: `9`
- `resolution`: `1024x576` pour toutes les scenes
- `scene 01`: `99 frames`
- `scene 02` a `scene 09`: `66 frames`

Sortie attendue:

- un JSON strict, en francais, sans Markdown
- ordre des scenes conserve
- `label_text` doit reprendre le texte OCR utile de l'entete de ligne si lisible
- si un champ est illegible, retourner `null` au lieu d'inventer

Regles:

- Ne jamais inventer une scene absente de l'image.
- Ne jamais corriger avec des connaissances externes non visibles.
- Se limiter a ce qui peut etre lu ou infere avec forte confiance depuis le contact sheet.
