# Traduction structuree FR vers EN pour note repo

Utiliser cette note quand Codex veut deleguer a Mistral une traduction bornee d'une note repo publique du francais vers l'anglais, avec glossaire verrouille et verification locale stricte.

## Quand l'utiliser

- note de release publique courte;
- extrait `README.md` ou note `docs/daily-tests/` a rendre lisible en anglais;
- commentaire ou resume repo qui doit garder commandes, chemins, et noms de fichier exacts.

## Entrees minimales

Donner a Mistral uniquement:

- la note source FR;
- le schema JSON cible;
- la liste exacte des termes verrouilles a preserver, par exemple `Codex`, `Mistral`, `README.md`, `npm run validate`, `npm run check:helper`, `docs/daily-tests/`, et `main`;
- l'interdiction d'inventer dependances, scripts, etapes CI, URLs, ou commandes.

## Modeles conseilles

- `mistral-small-latest`: bon premier passage economique si le schema est tres borne;
- `mistral-medium-3.5`: meilleur defaut pour traduction publique precise avec JSON strict;
- `mistral-large-latest`: utile comme seconde verification publique;
- `devstral-latest`: acceptable si la tache est formulee comme artefact repo structure, mais inutilement lourd si la traduction seule est deja bornee.

Note pratique:

- le helper `recommend` peut etre trop conservateur si le prompt contient des signaux `repo` ou `structure`;
- dans ce cas, garder le perimetre et l'oracle locaux, puis verifier la sortie au lieu de suivre le refus heuristique a la lettre.

## Verification locale

- parser le JSON renvoye;
- verifier l'egalite exacte avec l'oracle si les chaines cibles sont imposees;
- confirmer que `invented_items` reste vide;
- lancer `npm run validate` puis `npm run check:helper` avant integration;
- Codex garde la verification finale et la decision de publication sur `main`.

## Limites

- ce workflow valide une traduction repo courte et schema-first, pas une localisation longue ou marketing;
- si la consigne laisse trop de latitude stylistique, la comparaison exacte a l'oracle n'est plus adaptee;
- pour des documents plus longs, preferer une verification par champs critiques plutot qu'une egalite totale.
