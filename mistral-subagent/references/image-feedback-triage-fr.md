# Triage de feedback image C2R vers corrections de prompt

## Quand l'utiliser

Utiliser ce workflow quand Codex doit transformer un feedback de rejet d'image du projet `D:\00_Cerveau_IA\Projet\05_Generateur image C2R` en diagnostic borne plus correction de prompt reutilisable, sans reecrire le `promptLock` ni la negative list globale.

Cas typiques:

- image jugee trop plate ou collee au decor;
- derive textile ou accessoire parasite dans une tenue en impasto;
- expression trop neutre, yeux presque fermes, ou decor trop ferme.

## Modele conseille

- Defaut: `mistral-medium-3.5`
- Option economique: `mistral-small-latest`
- Option de polissage avec meme oracle: `mistral-large-latest`

Sur le run valide du `2026-06-15`, ces `3` modeles ont passe l'oracle strict apres un retry plus literal. `devstral-latest` a produit un JSON utile en premiere passe, mais non assez strict pour etre compte comme valide sur ce cas.

## Prompt recommande

Envoyer a Mistral:

- un contexte public minimal sur le preset actif, ici `versions/v6-exact-100`;
- les labels de diagnostic autorises;
- des feedbacks FR bornes de type `rejected`;
- un schema JSON ferme avec `task`, `cases`, `diagnosis`, `severity`, `keep_prompt_lock`, `prompt_fix_en`, `negative_additions`, `fit_note_fr`.

Si la premiere passe est trop libre, faire un retry litteral avec les fragments exacts a garder dans `prompt_fix_en`, par exemple:

- code FACS exact;
- angle exact;
- profondeur `foreground`, `mid-ground`, `far background`;
- formulation explicite comme `open space`, `no fabric logic`, `open eyes`, ou `open solar architecture`.

## Checks locaux minimum

- `task` vaut exactement `c2r_feedback_triage`
- `cases` contient exactement les `3` ids attendus dans le bon ordre
- `diagnosis` correspond au cas attendu
- `severity` vaut `high`
- `keep_prompt_lock` vaut `true`
- `prompt_fix_en` conserve le code FACS, l'angle, et les depth cues obligatoires
- `negative_additions` reste court et n'ajoute que des blocages specifiques au cas

## Limites

- Une premiere passe trop generale reste souvent insuffisante pour un oracle mecanique; le retry plus literal est donc normal sur ce type de tache.
- Ce workflow prepare des corrections de prompt, pas une decision finale de publication d'image.
- Codex garde toujours la verification locale, l'edition des presets, et l'integration dans le projet source.
