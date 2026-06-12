# Test quotidien 2026-06-12 - transcription audio FR de voix off Remotion

## Statut

**Valide**

## Categorie de tache

Transcription audio FR bornee sur une voix off de projet Remotion, avec verification locale contre un oracle captions.

## Pourquoi c'est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` manipulent deja des voix off, captions et rendus video courts dans Remotion, LTX et WebGL. Si Mistral sait retranscrire proprement un MP3 de projet, Codex peut lui deleguer une premiere passe recurrente de transcript, de captions, et de QA audio au lieu de retaper manuellement le texte entendu.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - lire un MP3 FR de voix off de projet;
  - recuperer un transcript exploitable;
  - comparer localement la transcription a l'oracle captions du job Remotion;
  - verifier si la sortie peut servir de base directe pour regenerer des captions.
- Artefacts reels:
  - audio: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\public\audio\voiceover-30s-v1.mp3`
  - oracle: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\jobs\job-site-presentation-30s-v4-tiktok-captions.json`

## Modeles testes

- `voxtral-mini-latest` via `POST /v1/audio/transcriptions`
  - run `timestamp_granularities=segment`
  - run `language=fr`
  - run `language=fr` + `context_bias=supply,chain,automatiser,donnees,decisions`
- `voxtral-mini-latest` via `POST /v1/chat/completions` avec `input_audio` base64
- `voxtral-small-latest` via `POST /v1/chat/completions` avec `input_audio` base64
- `mistral-medium-3.5` pour le brouillon FR du rapport
- `mistral-large-latest` pour le brouillon FR de la reference skill

## Resume des prompts et du contexte

- Contexte borne:
  - une voix off FR de `29.52s` mesuree localement par `ffprobe`
  - un oracle captions ferme deja versionne dans le projet Remotion
- Voie principale testee:
  - `POST /v1/audio/transcriptions` avec `voxtral-mini-latest`
- Variantes utiles:
  - `timestamp_granularities=segment` pour mesurer si des segments exploitables reviennent directement
  - `language=fr` pour fixer la langue connue
  - `context_bias` atomique sans espaces pour corriger un terme residuel
- Echecs instrumentes:
  - premier essai `context_bias` avec des valeurs contenant des espaces
  - deux essais `chat/completions` audio avec `input_audio` base64

## Usage et tokens

| Run | Prompt audio sec. | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---:|---|
| `voxtral-mini-latest` timestamped | 29 | 4 | 121 | 500 | `5` segments, `word_accuracy=98.21` |
| `voxtral-mini-latest` `language=fr` | 29 | 5 | 81 | 461 | meme divergence unique, sans segments |
| `voxtral-mini-latest` `language=fr` + `context_bias` retry | 29 | 18 | 82 | 475 | transcript normalise exact, `word_accuracy=100` |
| `mistral-medium-3.5` brouillon rapport | n/a | 1135 | 875 | 2010 | brouillon utile, resserre puis verifie par Codex |
| `mistral-large-latest` brouillon reference | n/a | 1022 | 560 | 1582 | brouillon utile, resserre puis verifie par Codex |

Tokens Mistral utiles retenus pour ce run:

- transcriptions utiles: `500 + 461 + 475 = 1436`
- brouillon rapport utile: `2010`
- brouillon reference utile: `1582`

Total utile comptabilise avec tokens exposes: `5028`.

Sorties non retenues comme valides:

- premier essai `context_bias` avec espaces: `HTTP 422`
- `voxtral-mini-latest` chat audio: `HTTP 422`
- `voxtral-small-latest` chat audio: `HTTP 422`

## Resultat

Validation positive sous verification Codex.

- La voie **validee aujourd'hui** est `POST /v1/audio/transcriptions` avec `voxtral-mini-latest`.
- Le run `timestamp_granularities=segment` retrouve presque parfaitement la voix off et remonte deja `5` segments utiles, mais garde une divergence residuelle sur `decision` au lieu de `decisions`.
- Le run `language=fr` seul garde la meme divergence.
- Le retry `language=fr` + `context_bias=supply,chain,automatiser,donnees,decisions` aligne le transcript normalise exactement sur l'oracle local: `word_accuracy=100`.

Sorties Mistral directement utilisees:

- les trois transcriptions reussies comme evidence comparee et validee localement;
- le retry `language=fr` + `context_bias` comme meilleure sortie retenue;
- le brouillon FR de `mistral-medium-3.5` pour structurer le rapport quotidien;
- le brouillon FR de `mistral-large-latest` pour structurer la reference skill.

Echecs utiles conserves comme apprentissage:

- un `context_bias` multipart contenant des espaces renvoie ici `HTTP 422` avec le pattern `^[^,\\s]+$`;
- les essais `POST /v1/chat/completions` avec `input_audio` base64 ont renvoye `HTTP 422` dans ce workflow et ne comptent pas comme voie validee aujourd'hui.

## Commandes de validation

Configuration et disponibilite:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs check
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs models | Select-String -Pattern 'voxtral'
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\public\audio\voiceover-30s-v1.mp3"
```

Verification locale:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-12-audio-transcription-validation-summary.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr-bias-retry.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-12-voxtral-mini-chat-headers.txt
Get-Content docs/daily-tests/evidence/2026-06-12-voxtral-small-chat-headers.txt
npm run validate
npm run check:helper
```

## Limitations

- la voie validee concerne ici une voix off MP3 FR propre, courte et monocanal; ce test ne couvre pas encore un audio plus bruite, plus long, ou multi-locuteurs
- les runs `language=fr` utiles ne retournent pas de segments, donc un decoupage local des phrases reste necessaire pour fabriquer des captions fines
- le `context_bias` accepte ici des mots atomiques sans espaces; les phrases biaisees en multipart ont ete rejetees en `HTTP 422`
- le mode `chat/completions` audio n'est pas valide dans ce workflow au `2026-06-12`

## Prochaine action

Tester une capacite audio voisine avec oracle local clair, par exemple la regeneration de captions segmentees a partir d'un transcript valide, ou une transcription FR sur un audio plus dense que cette simple voix off de 30 secondes.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme **validee** pour la transcription audio FR bornee de voix off de projet, avec une voie stable via `audio/transcriptions`. Estimation cumulative apres ce run: **74 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-12-audio-transcription-context.md`
- `docs/daily-tests/evidence/2026-06-12-audio-transcription-expected.json`
- `docs/daily-tests/evidence/2026-06-12-audio-chat-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription.json`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-headers.txt`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr.json`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr-headers.txt`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr-bias.json`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr-bias-retry.json`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr-bias-retry-headers.txt`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-chat.json`
- `docs/daily-tests/evidence/2026-06-12-voxtral-mini-chat-headers.txt`
- `docs/daily-tests/evidence/2026-06-12-voxtral-small-chat.json`
- `docs/daily-tests/evidence/2026-06-12-voxtral-small-chat-headers.txt`
- `docs/daily-tests/evidence/2026-06-12-audio-transcription-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-12-audio-reference-context.md`
- `docs/daily-tests/evidence/2026-06-12-audio-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-audio-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-mistral-medium35-audio-report-draft.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-large-audio-reference-draft.json`
