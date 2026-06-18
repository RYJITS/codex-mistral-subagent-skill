# Triage multi-images C2R vers priorites de regeneration

## Quand l'utiliser

Utiliser ce workflow quand Codex doit classer plusieurs feedbacks de rejet d'un meme batch du projet `D:\00_Cerveau_IA\Projet\05_Generateur image C2R` pour choisir:

- quoi regenerer immediatement;
- quoi corriger au prompt puis regenerer;
- quoi garder seulement comme controle visuel.

Le run valide du `2026-06-18` a couvert `4` cas bornes issus du flux `POST /api/feedback` sous le preset `v6-exact-100`.

## Modele conseille

- Defaut economique: `mistral-small-latest`
- Option plus confortable pour la synthese FR: `mistral-medium-3.5`

Sur le run valide du `2026-06-18`, `mistral-small-latest`, `mistral-medium-3.5`, `mistral-large-latest`, et `devstral-latest` ont passe le meme oracle local. Le meilleur choix cout/fiabilite reste `mistral-small-latest`.

## Prompt recommande

Envoyer a Mistral:

- un contexte public minimal sur `v6-exact-100`;
- les buckets autorises `p0_immediate_regen`, `p1_prompt_fix_then_regen`, `p2_hold_control`;
- les actions autorisees `regenerate_now`, `edit_prompt_then_regenerate`, `keep_as_control`;
- un schema JSON ferme avec `task`, `batch_id`, `cases`, `rank`, `priority_bucket`, `next_action`, `keep_for_reference`, `prompt_action_en`, `reason_fr`;
- l'ordre exact des ids attendu par `rank`.

Pour les cas a regenerer, imposer litteralement dans `prompt_action_en` les signaux critiques du cas, par exemple:

- `visible open eyes`
- `readable feet and toes`
- `lagoon reflections foreground`
- `open glasshouse far background`
- `no umbrella`

Pour un cas a garder en simple controle, imposer une valeur exacte du type `keep current prompt as control reference`.

## Checks locaux minimum

- `task` vaut exactement `c2r_regeneration_priority_triage`
- `batch_id` vaut exactement la valeur attendue du batch
- `cases` contient exactement les ids attendus dans le bon ordre
- `rank`, `priority_bucket`, `next_action`, et `keep_for_reference` correspondent exactement au gold set
- `prompt_action_en` contient les signaux obligatoires du cas
- `reason_fr` reste non vide

## Limites

- Ce workflow ne juge pas la qualite esthetique finale des images.
- Il priorise un batch court et borne, pas un portefeuille complet de batches concurrents.
- Codex garde toujours la verification locale, l'edition des presets, la relance reelle, et la decision finale si plusieurs jobs se chevauchent.
