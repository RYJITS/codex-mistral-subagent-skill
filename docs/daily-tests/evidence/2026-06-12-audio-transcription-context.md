# Contexte borne pour test audio 2026-06-12

Capacite candidate:
- transcription audio FR bornee d'une voix off Remotion de projet pour regenerer un transcript et des captions exploitables

Pourquoi c'est utile:
- plusieurs projets reels dans `D:\00_Cerveau_IA` utilisent des voix off, captions et videos courtes
- si Mistral sait retranscrire proprement un MP3 de projet, Codex peut lui deleguer une premiere passe de sous-titres, QA audio et recap contenu

Asset reel teste:
- audio: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\public\audio\voiceover-30s-v1.mp3`
- job oracle: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\jobs\job-site-presentation-30s-v4-tiktok-captions.json`
- duree audio mesuree localement par `ffprobe`: `29.52s`

Contraintes de validation:
- ne compter comme valide que le texte effectivement retrouve par Mistral et directement utile
- ne pas exiger des timings identiques a l'oracle; l'oracle principal est le texte des `captions`
- mesurer en priorite:
  - transcript complet normalise
  - nombre de segments/captions utiles
  - phrases exactes recuperees apres normalisation ASCII/minuscule

Modeles/routes testes prevus:
- `voxtral-mini-latest` via `POST /v1/audio/transcriptions`
- `voxtral-mini-latest` via `POST /v1/audio/transcriptions` avec `language=fr`
- `voxtral-mini-latest` via `POST /v1/chat/completions` avec `input_audio`
- `voxtral-small-latest` via `POST /v1/chat/completions` avec `input_audio`

Important d'apres la doc officielle Mistral:
- `timestamp_granularities` n'est pas compatible avec `language` sur l'endpoint transcription
- `voxtral-small-latest` et `voxtral-mini-latest` acceptent l'audio en chat
- `voxtral-mini-latest` est aussi le modele de l'endpoint optimise `audio/transcriptions`
