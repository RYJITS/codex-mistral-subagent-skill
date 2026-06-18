# Priorisation de feedbacks C2R

## Quand l'utiliser

Utiliser ce workflow quand Codex doit lire un petit lot de feedbacks texte du projet `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`, puis decider quelles variantes regenerer tout de suite, quelles variantes repousser au prochain batch, et quelle image garder comme candidate ou controle.

Cas typiques:

- une variante contient une derive textile ou un `object in hand`;
- une variante est collee au decor ou perd la profondeur du `promptLock`;
- une variante reste correcte mais demande seulement un second passage plus tard;
- une image est deja assez bonne pour servir de candidate ou de controle.

## Modele conseille

- Defaut: `mistral-medium-3.5`
- Option economique: `mistral-small-latest`
- Option repo-aware mais sans gain clair sur ce cas: `devstral-latest`

Sur le run valide du `2026-06-18`, ces `3` modeles ainsi que `mistral-large-latest` ont passe le meme oracle strict au premier essai. `mistral-medium-3.5` reste le meilleur compromis cout/sobriete.

## Prompt recommande

Envoyer a Mistral:

- le contexte public minimal du flux `POST /api/feedback`;
- les signaux critiques du preset actif, ici `v6-exact-100`;
- une politique locale de priorisation deja bornee par Codex;
- un schema JSON ferme avec `task`, `version_id`, `queue`, `priority_rank`, `priority_bucket`, `reason_key`, `preserve_candidate`, `prompt_focus_en`, `fit_note_fr`.

Pour ce cas, ne pas se fier a `recommend` seul: sur le run valide, l'heuristique a retourne `suitable=false` alors que la tache etait bien delegable et verifiable.

## Checks locaux minimum

- `task` vaut exactement `c2r_multi_image_regen_triage`
- `version_id` vaut exactement `v6-exact-100`
- `queue` contient exactement les `4` `job_id` attendus dans le bon ordre
- `priority_bucket` et `reason_key` correspondent a l'oracle local
- `preserve_candidate=true` seulement pour le cas `keep_candidate`
- `prompt_focus_en` contient les signaux obligatoires du cas, par exemple `no fabric logic`, `open glasshouse`, `open space`, `lagoon reflections foreground`, `open eyes`, `pierced sky`

## Limites

- Ce workflow trie une file de feedbacks texte; il ne remplace pas un jugement final sur l'image elle-meme.
- La qualite depend d'une politique de priorisation deja explicitee par Codex.
- Si le lot melange trop de cas ambigus ou des regles non bornees, Codex doit d'abord reduire la taxonomie avant delegation.
