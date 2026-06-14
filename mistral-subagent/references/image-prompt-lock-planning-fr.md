# Planification de prompts image sous promptLock

## Quand l'utiliser

Utiliser ce workflow quand Codex doit deleguer a Mistral la redaction d'un `prompt_variable` borne pour un generateur image qui possede deja un `promptLock` stable, comme `D:\00_Cerveau_IA\Projet\05_Generateur image C2R\versions\v6-exact-100\preset.json`.

Cas typiques:

- preparer plusieurs variantes de prompts image a partir de briefs creatifs courts;
- garder une compatibilite stricte avec un preset public deja verrouille;
- sortir un JSON simple que Codex peut verifier localement avant integration.

## Modeles recommandes

- Defaut: `mistral-medium-3.5`
- Option economique: `mistral-small-latest`
- A eviter pour l'instant sur ce cas: `mistral-large-latest` si le prompt exige le code FACS exact dans `prompt_variable`

## Protocole recommande

1. Extraire seulement les contraintes publiques utiles du preset: structure du `promptLock`, angles autorises, palette, profondeur, liste negative deja geree.
2. Envoyer a Mistral un brief borne et un schema JSON strict.
3. Demander un `prompt_variable` concatene au `promptLock`, pas une reecriture du preset complet.
4. Imposer explicitement les champs a verifier localement: `task`, ids de variantes, `facs_code`, `prompt_variable`, `palette`, `depth_cues`, `negative_additions`, `risk_flags`, `fit_note_fr`.
5. Valider localement avant toute utilisation dans le projet source.

## Checks locaux minimum

- `task` vaut exactement `c2r_prompt_pack`
- `variants` contient le bon nombre de briefs
- chaque `prompt_variable` contient le code FACS exact demande
- palette, profondeur et angle sont bien presentes
- absence de termes bannis dans `prompt_variable`
- `negative_additions` reste court et ne recopie pas la negative list globale

## Verdict du lab

- `mistral-medium-3.5`: valide et meilleur defaut pour ce cas
- `mistral-small-latest`: valide comme option economique
- `mistral-large-latest`: non valide sur le test du 2026-06-14 car il omet le code FACS exact dans `prompt_variable`

## Limites

- Ce workflow prepare des prompts; Codex garde la verification semantique finale et l'integration locale.
- Si le projet exige une taxonomie plus riche, preferer un schema JSON un peu plus large plutot qu'un prompt libre.
- Ne pas envoyer de secret, de chemin sensible, ni le preset complet si seules quelques contraintes publiques suffisent.
