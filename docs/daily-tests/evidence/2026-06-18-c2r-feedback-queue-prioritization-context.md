# Contexte borne - priorisation d'une file de feedbacks C2R

## Projet reel concerne

- source: `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- flux reel: `POST /api/feedback`
- metadonnees utiles: `jobId`, `status`, `note`, `prompt`, `versionId`

## Pourquoi cette capacite compte

Dans le flux reel C2R, plusieurs images d'un meme lot peuvent etre marquees `rejected` ou `valid`. Avant de relancer ComfyUI ou de retoucher un preset, Codex doit choisir:

- quelle variante regenerer tout de suite;
- quelle variante peut attendre le prochain lot;
- quelle variante peut etre gardee comme candidate ou controle.

La valeur delegable ne consiste pas a juger une image finale, mais a transformer un petit lot de feedbacks texte en file de priorites exploitable.

## Extrait public du preset actif `v6-exact-100`

Signaux `promptLock` critiques:

- `three-quarter or frontal face with visible open eyes`
- `open real universe with foreground, mid-ground and far background depth`
- `woman centered in open space, never pressed against a wall`
- `outfit made only from thick wet impasto oil paint, no fabric logic`

Signaux `negative` critiques:

- `stitched seams`
- `object in hand`
- `closed eyes`
- `pressed against wall`
- `flat wall pose`

## Regles strictes de priorisation

La sortie doit contenir exactement `4` items, tries par `priority_rank` croissant.

Buckets autorises:

- `regen_now`
- `regen_next_batch`
- `keep_candidate`

Reason keys autorises:

- `textile_prop_drift`
- `depth_wall_drift`
- `mood_expression_soft`
- `already_valid`

Politique locale:

1. Toute violation dure du `promptLock` ou du `negative` passe en `regen_now`.
2. Un cas `textile` ou `object in hand` est plus prioritaire qu'un cas `wall/depth`.
3. Un rejet sans violation dure, avec decor ouvert et yeux visibles, passe en `regen_next_batch`.
4. Un cas `valid` qui respecte deja le preset passe en `keep_candidate`.
5. `preserve_candidate=true` seulement pour `keep_candidate`.

## Lot borne a classer

### Item 1

- `job_id`: `c2r-job-102-storm-umbrella`
- `status`: `rejected`
- `note_fr`: `Belle matiere impasto, mais un parapluie textile est apparu, avec des coutures visibles et un objet tenu en main.`
- `prompt_anchor_en`: `AU1+AU2+AU5, wet leaves foreground, sculpted path mid-ground, open glasshouse far background`
- contraintes attendues:
  - `priority_bucket=regen_now`
  - `reason_key=textile_prop_drift`
  - `preserve_candidate=false`
  - `prompt_focus_en` doit contenir `no fabric logic` et `open glasshouse`

### Item 2

- `job_id`: `c2r-job-101-lagoon-flat`
- `status`: `rejected`
- `note_fr`: `Le visage est correct mais la femme parait collee a un mur mineral, la pose est plate et la profondeur manque presque completement.`
- `prompt_anchor_en`: `AU6+AU12, open space, lagoon reflections foreground, mineral arches mid-ground, mist horizon far background`
- contraintes attendues:
  - `priority_bucket=regen_now`
  - `reason_key=depth_wall_drift`
  - `preserve_candidate=false`
  - `prompt_focus_en` doit contenir `open space` et `lagoon reflections foreground`

### Item 3

- `job_id`: `c2r-job-103-solar-soft`
- `status`: `rejected`
- `note_fr`: `La scene reste ouverte avec les yeux visibles, mais la lumiere est trop grise et l'expression reste molle. Aucun objet parasite et aucun mur.`
- `prompt_anchor_en`: `AU4+AU7+AU23, open eyes, luminous dust foreground, walkways mid-ground, pierced sky far background`
- contraintes attendues:
  - `priority_bucket=regen_next_batch`
  - `reason_key=mood_expression_soft`
  - `preserve_candidate=false`
  - `prompt_focus_en` doit contenir `open eyes` et `pierced sky`

### Item 4

- `job_id`: `c2r-job-104-valid-open`
- `status`: `valid`
- `note_fr`: `Bonne profondeur, yeux ouverts, tenue impasto credible et decor ouvert. A garder comme candidate.`
- `prompt_anchor_en`: `keep current prompt`
- contraintes attendues:
  - `priority_bucket=keep_candidate`
  - `reason_key=already_valid`
  - `preserve_candidate=true`
  - `prompt_focus_en` doit valoir exactement `keep current prompt`

## Format de sortie exige

JSON strict uniquement:

- `task` doit valoir `c2r_multi_image_regen_triage`
- `version_id` doit valoir `v6-exact-100`
- `queue` doit contenir exactement les `4` items
- chaque item doit contenir:
  - `job_id`
  - `priority_rank`
  - `priority_bucket`
  - `reason_key`
  - `preserve_candidate`
  - `prompt_focus_en`
  - `fit_note_fr`
