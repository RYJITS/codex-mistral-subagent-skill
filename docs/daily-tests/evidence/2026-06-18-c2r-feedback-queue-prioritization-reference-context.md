# Contexte de redaction de reference

Capacite validee le `2026-06-18`:

- titre de travail: `priorisation d'une file de feedbacks C2R`
- tache: classer `4` feedbacks texte d'un lot image C2R en priorites de regeneration
- sortie attendue: JSON strict avec `task`, `version_id`, `queue`, `priority_rank`, `priority_bucket`, `reason_key`, `preserve_candidate`, `prompt_focus_en`, `fit_note_fr`

Projet reel rattache:

- `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- preset public: `v6-exact-100`
- flux reel: `POST /api/feedback`

Oracle local retenu:

- ordre exact des `4` `job_id`
- `priority_bucket` exact
- `reason_key` exact
- `preserve_candidate` exact
- signaux obligatoires dans `prompt_focus_en`

Modeles testes et valides:

- `mistral-small-latest` avec `2068` tokens totaux
- `mistral-medium-3.5` avec `2050` tokens totaux
- `mistral-large-latest` avec `2087` tokens totaux
- `devstral-latest` avec `2095` tokens totaux

Constats utiles:

- les `4` modeles ont passe l'oracle strict au premier essai
- `mistral-medium-3.5` est le meilleur defaut entre cout et sobriete
- `mistral-small-latest` est une option economique credible
- `devstral-latest` est valide mais n'apporte pas de gain clair sur cette tache
- `recommend` a sous-estime la tache avec `suitable=false` et `confidence=0.43`, alors que la tache etait en pratique bien delegable

Sections souhaitees pour la reference Markdown:

- `#` titre court
- `## Quand l'utiliser`
- `## Modele conseille`
- `## Prompt recommande`
- `## Checks locaux minimum`
- `## Limites`

Contraintes:

- rediger en francais
- rester compact
- ASCII seulement
- ne pas mentionner de secret ni de token API
- ne pas inventer de nouveaux fichiers ou commandes
