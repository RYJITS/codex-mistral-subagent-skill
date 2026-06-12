# Transcription audio FR pour voix off Remotion

Utiliser cette note quand Codex veut deleguer a Mistral une transcription audio FR bornee sur une voix off de projet Remotion, puis reutiliser le transcript pour captions, QA audio, ou recap contenu.

## Quand l'utiliser

- MP3 court et propre de voix off FR, typiquement autour de `30s`
- besoin de recuperer vite un transcript exploitable plutot qu'un montage audio complet
- oracle local disponible: captions existantes, script, ou texte attendu a comparer
- besoin recurrent dans un flux video/web, sans envoyer de secrets ni de contexte projet large

Le test du `2026-06-12` a valide ce workflow sur:

- `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\public\audio\voiceover-30s-v1.mp3`
- compare a `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\jobs\job-site-presentation-30s-v4-tiktok-captions.json`

## Routage recommande

- voie validee: `POST /v1/audio/transcriptions`
- modele: `voxtral-mini-latest`
- premier essai utile:
  - `language=fr` si la langue est deja connue
- retry utile si un terme reste faux:
  - `language=fr`
  - `context_bias` sous forme de mots atomiques separes par des virgules, sans espaces
  - exemple valide observe: `supply,chain,automatiser,donnees,decisions`

Points verifies le `2026-06-12`:

- `timestamp_granularities=segment` a retourne `5` segments et un transcript a `98.21 %` de precision locale
- `language=fr` seul garde la meme divergence residuelle
- `language=fr` + `context_bias` atomique a donne un transcript normalise egal a l'oracle local

## Contrat de sortie conseille

Demander ou attendre au minimum:

- un transcript complet
- des segments si l'endpoint en retourne
- aucun enrichissement hors transcription

Ne pas compter comme pleinement valide:

- une sortie qui invente du texte absent
- une route chat audio non verifiee localement
- un transcript impossible a comparer a un oracle ou a un texte attendu

## Validation locale

Verifier chaque sortie avant usage:

1. parser la reponse JSON brute;
2. normaliser le texte en comparaison accent-insensible si l'oracle est ASCII;
3. comparer le transcript a l'oracle local;
4. compter la precision mot a mot ou au minimum les phrases retrouvees;
5. verifier si les segments retournes sont suffisants ou si Codex doit redecouper les phrases localement.

Validation minimale utile:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-12-audio-transcription-validation-summary.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr-bias-retry.json -Raw | ConvertFrom-Json
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\public\audio\voiceover-30s-v1.mp3"
```

## Limites

- le test valide ici un MP3 FR propre et court, pas un audio long, bruite, ou multi-locuteurs
- les runs utiles avec `language=fr` ne renvoient pas de segments, donc Codex doit encore redecouper les phrases pour faire des captions fines
- un `context_bias` multipart avec espaces a renvoye `HTTP 422`; rester sur des mots atomiques sans espaces
- les essais `POST /v1/chat/completions` avec `input_audio` base64 ont renvoye `HTTP 422` dans ce workflow et ne sont pas valides ici

## Verdict de delegation

Capacite validee pour la transcription audio FR bornee de voix off Remotion, si:

- Codex passe par `POST /v1/audio/transcriptions`
- `voxtral-mini-latest` est utilise comme modele principal
- `language=fr` est fixe quand la langue est connue
- un retry `context_bias` atomique est tente seulement si un terme residuel reste faux
- Codex garde la verification locale et le decoupage final des captions si besoin
