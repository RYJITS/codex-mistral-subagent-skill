# Faits verifies - reference skill 2026-06-18

- Capacite validee: triage multi-images C2R vers priorites de regeneration
- Projet source reel: `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- Objectif: a partir de `4` feedbacks de rejet d'un batch, classer quoi regenerer maintenant, quoi corriger puis regenerer, et quoi garder comme controle
- Sortie attendue qui a passe l'oracle:
  - `task = c2r_regeneration_priority_triage`
  - `batch_id = c2r-batch-regen-2026-06-18`
  - `cases` tries par `rank`
  - `priority_bucket` dans `p0_immediate_regen`, `p1_prompt_fix_then_regen`, `p2_hold_control`
  - `next_action` dans `regenerate_now`, `edit_prompt_then_regenerate`, `keep_as_control`
  - `prompt_action_en` compact et directement reutilisable
- Modeles ayant passe l'oracle:
  - `mistral-small-latest`
  - `mistral-medium-3.5`
  - `mistral-large-latest`
  - `devstral-latest`
- Recommendation de routage:
  - defaut economique: `mistral-small-latest`
  - option plus confortable pour la synthese et la lisibilite: `mistral-medium-3.5`
- Ce que l'oracle verifie:
  - ordre exact des ids
  - bucket exact
  - action exacte
  - booleen `keep_for_reference`
  - signaux obligatoires dans `prompt_action_en`
- Ce que l'oracle ne verifie pas:
  - qualite esthetique finale de l'image
  - choix stylistiques hors signaux imposes

Contraintes de redaction:

- rediger une note de reference concise en francais pour un nouveau fichier `mistral-subagent/references/image-regeneration-priority-triage-fr.md`
- structure attendue:
  - titre
  - quand l'utiliser
  - modele conseille
  - prompt recommande
  - checks locaux minimum
  - limites
- ne pas inventer de nouveaux ids de modele ni de nouveaux buckets
