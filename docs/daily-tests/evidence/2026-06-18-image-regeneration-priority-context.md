# Contexte borne - triage multi-images C2R vers priorites de regeneration

Projet reel source: `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`

Pourquoi cette tache existe dans le flux reel:

- l'application enregistre les retours via `POST /api/feedback`
- un batch de generation peut produire plusieurs images rejetables ou quasi utiles
- avant de relancer un lot, Codex doit choisir quoi regenerer tout de suite, quoi corriger d'abord, et quoi garder comme simple controle visuel

Extraits publics utiles de `versions/v6-exact-100/preset.json`:

- visage `three-quarter` ou frontal avec yeux ouverts visibles
- code FACS obligatoire dans le prompt, jamais en texte rendu
- univers ouvert avec profondeur `foreground`, `mid-ground`, `far background`
- femme centree en espace ouvert, jamais collee au decor
- tenue composee uniquement de `thick wet impasto oil paint`, sans logique textile
- anatomie lisible: doigts separes, pieds et orteils lisibles

Negative list globale deja geree par le generateur:

- `fabric dress`
- `textile dress`
- `pressed against wall`
- `flat wall pose`
- `closed eyes`
- `blank face`
- `profile-only face`
- `object in hand`
- `paintbrush`
- `weapon`
- `missing feet`
- `cropped limbs`

Tache demandee a Mistral:

- lire `4` feedbacks de rejet compatibles avec le flux reel
- classer les cas dans des priorites de regeneration bornees
- dire si l'image doit etre regenee tout de suite, apres correction de prompt, ou gardee seulement comme controle
- proposer une action prompt-side compacte en anglais quand une regeneration est justifiee

Buckets autorises:

- `p0_immediate_regen`
- `p1_prompt_fix_then_regen`
- `p2_hold_control`

Actions autorisees:

- `regenerate_now`
- `edit_prompt_then_regenerate`
- `keep_as_control`

Cas a traiter, classes ensuite par rang de priorite `1` a `4`:

1. `cliff_anatomy_crop`
   - `versionId`: `v6-exact-100`
   - `status`: `rejected`
   - brief cible: heroine seule sur une falaise ouverte apres l'orage, `AU2+AU5+AU25`, palette ardoise / cuivre / ecume, spray marin foreground, falaises sculptees mid-ground, ciel ouvert far background, angle frontal or three-quarter
   - feedback note: `Main recadree, pieds quasi absents, visage trop profile et les yeux ne lisent pas assez. Le decor ouvert existe mais le sujet ne tient pas les contraintes anatomiques minimales.`
   - attente locale: cas critique a regenir vite avec renfort anatomie + regard ouvert + cadrage corps

2. `lagoon_flat_depth`
   - `versionId`: `v6-exact-100`
   - `status`: `rejected`
   - brief cible: heroine seule dans un lagon mineral a l'aube, `AU6+AU12`, palette cuivre / turquoise / ivoire, reflets eau foreground, arches minerales mid-ground, horizon brumeux far background, angle frontal
   - feedback note: `La pose donne une impression plaquee au decor sombre. On perd les reflets du lagon et l horizon. Le visage est propre mais l emotion AU6+AU12 ne lit pas assez.`
   - attente locale: relecture prioritaire mais moins critique que l anatomie

3. `storm_textile_prop`
   - `versionId`: `v6-exact-100`
   - `status`: `rejected`
   - brief cible: heroine seule dans un jardin orageux apres la pluie, `AU1+AU2+AU5`, palette jade / petrole / argent, feuilles humides foreground, allee sculptee mid-ground, verriere ouverte far background, angle three-quarter
   - feedback note: `Le haut ressemble a un manteau textile avec coutures et un parapluie est apparu. Les feuilles humides du premier plan ne se lisent presque pas.`
   - attente locale: corriger le prompt puis regenir, sans urgence maximale

4. `sun_control_candidate`
   - `versionId`: `v6-exact-100`
   - `status`: `rejected`
   - brief cible: heroine seule dans une architecture solaire ouverte, `AU4+AU7+AU23`, palette ambre / craie / bleu pale, poussiere lumineuse foreground, passerelles mid-ground, ciel perce far background, angle frontal
   - feedback note: `L image reste exploitable pour la palette et la profondeur generale. Les yeux sont un peu mous et l expression pas encore assez nerveuse, mais ce n est pas une image a relancer en premier.`
   - attente locale: garder comme controle, pas de regeneration immediate

Sortie JSON attendue:

```json
{
  "task": "c2r_regeneration_priority_triage",
  "batch_id": "c2r-batch-regen-2026-06-18",
  "cases": [
    {
      "id": "cliff_anatomy_crop",
      "rank": 1,
      "priority_bucket": "p0_immediate_regen",
      "next_action": "regenerate_now",
      "keep_for_reference": false,
      "prompt_action_en": "string",
      "reason_fr": "string"
    }
  ]
}
```

Regles de sortie:

- JSON uniquement
- `task` doit valoir exactement `c2r_regeneration_priority_triage`
- `batch_id` doit valoir exactement `c2r-batch-regen-2026-06-18`
- `cases` doit contenir exactement `4` objets tries par `rank` croissant
- `rank` doit etre un entier unique de `1` a `4`
- `priority_bucket` doit utiliser uniquement les `3` labels autorises
- `next_action` doit utiliser uniquement les `3` labels autorises
- `keep_for_reference` doit etre `true` seulement pour un cas de simple controle
- `prompt_action_en` doit etre en anglais compact, sans Markdown
- `reason_fr` doit etre en francais
- si `next_action = keep_as_control`, `prompt_action_en` doit valoir exactement `keep current prompt as control reference`
- pour les cas a regenerer, `prompt_action_en` doit contenir les signaux critiques du cas sans reecrire toute la negative list
