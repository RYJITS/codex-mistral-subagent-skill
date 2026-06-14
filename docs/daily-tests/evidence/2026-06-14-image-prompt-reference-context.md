# Contexte de redaction - reference FR pour planification de prompts image

Capacite testee:

- planification structuree de `prompt_variable` pour le projet reel `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- integration a un `promptLock` existant dans `versions/v6-exact-100/preset.json`
- sortie attendue: JSON borne pour `3` briefs image

Resultat de validation locale:

- `mistral-small-latest`: valide
- `mistral-medium-3.5`: valide
- `mistral-large-latest`: non valide, car omet le code FACS exact dans `prompt_variable`

Tokens:

- `mistral-small-latest`: prompt `1422`, completion `569`, total `1991`
- `mistral-medium-3.5`: prompt `1422`, completion `495`, total `1917`
- `mistral-large-latest`: prompt `1422`, completion `585`, total `2007`

Regles a rappeler dans la reference:

- ne jamais envoyer de secret ni de chemin sensible
- transmettre seulement le brief borne, les contraintes publiques utiles, et le schema JSON attendu
- demander un `prompt_variable` concatene au `promptLock`, pas une reecriture du preset complet
- verifier localement: `task`, nombre de variantes, FACS exact dans `prompt_variable`, palette, profondeur, angle, longueur raisonnable, et absence de termes bannis
- recommander `mistral-medium-3.5` comme meilleur defaut
- garder `mistral-small-latest` comme option economique acceptable
- ne pas recommander `mistral-large-latest` pour ce cas tant qu'il oublie le FACS dans le prompt

Format souhaite pour la reference:

- titre
- quand l'utiliser
- modele recommande
- protocole en `4` ou `5` etapes
- checks locaux
- limites
