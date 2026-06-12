# Workflow valide audio/transcription 2026-06-12

Capacite testee:
- transcription audio FR bornee d'une voix off Remotion de projet pour recuperer un transcript exploitable et reconstituer des captions

Projet reel source:
- audio: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\public\audio\voiceover-30s-v1.mp3`
- oracle captions: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\jobs\job-site-presentation-30s-v4-tiktok-captions.json`

Verdict:
- `Valide`

Resultats verifies localement:
- `voxtral-mini-latest` via `POST /v1/audio/transcriptions` avec `timestamp_granularities=segment`
  - `word_accuracy=98.21`
  - `5` segments retournes
  - une seule divergence de texte: `decision` au lieu de `decisions`
- `voxtral-mini-latest` via `POST /v1/audio/transcriptions` avec `language=fr`
  - meme divergence unique
  - pas de segments retournes
- `voxtral-mini-latest` via `POST /v1/audio/transcriptions` avec `language=fr` et `context_bias=supply,chain,automatiser,donnees,decisions`
  - `word_accuracy=100`
  - transcript normalise exactement egal a l'oracle
  - pas de segments retournes

Echecs utiles a documenter:
- premier essai `context_bias` avec des phrases contenant des espaces:
  - `HTTP 422`
  - erreur de pattern `^[^,\\s]+$`
- essais `voxtral-mini-latest` et `voxtral-small-latest` via `POST /v1/chat/completions` avec `input_audio` base64:
  - `HTTP 422`
  - payload refuse avec message indiquant que `content` est attendu comme chaine dans cette route/test

Usage expose:
- transcription timestamped:
  - `prompt_audio_seconds=29`
  - `prompt_tokens=4`
  - `completion_tokens=121`
  - `total_tokens=500`
- transcription `language=fr`:
  - `prompt_audio_seconds=29`
  - `prompt_tokens=5`
  - `completion_tokens=81`
  - `total_tokens=461`
- transcription `language=fr` + `context_bias` retry:
  - `prompt_audio_seconds=29`
  - `prompt_tokens=18`
  - `completion_tokens=82`
  - `total_tokens=475`

Interpretation utile:
- pour une tache de transcription pure sur MP3 FR de projet, l'endpoint optimise `audio/transcriptions` est la voie validee aujourd'hui
- `language=fr` plus `context_bias` atomique sans espaces corrige la divergence residuelle sur `decisions`
- le transcript valide est directement utile pour une premiere passe de captions, meme si Codex doit encore decouper les phrases si aucun segment n'est retourne
