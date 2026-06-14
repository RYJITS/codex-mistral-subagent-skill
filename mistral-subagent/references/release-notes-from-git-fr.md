# Notes de version bornees depuis Git et rapports

## Quand l'utiliser

Utiliser ce workflow pour rediger une note de version publique courte en francais a partir d'un lot borne de commits `git log` et de rapports deja verifies sous `docs/daily-tests/`.

## Modele conseille

- Defaut: `mistral-medium-3.5`
- Alternative economique: `mistral-small-latest`
- Alternative repo-aware: `devstral-latest`
- Polissage public seulement apres verification: `mistral-large-latest`

Sur le run valide du `2026-06-14`, `mistral-small-latest`, `mistral-medium-3.5`, et `devstral-latest` ont tenu le JSON ferme. `mistral-large-latest` n'a pas ete retenu pour la sortie appliquee car son resume depassait la borne fixee.

## Prompt minimal

Donner a Mistral:

- une plage de commits extraite par `git log`
- la liste exacte des rapports quotidiens concernes sous `docs/daily-tests/`
- les comptes de statut exacts (`Valide`, `Partiellement valide`, `Non valide`)
- l'interdiction d'inventer d'autres hashes, fichiers, modeles, ou statuts
- un schema JSON ferme pour la sortie

Preferer un objet JSON avec:

- periode
- comptes de statut
- `highlights_fr`
- `watchouts_fr`
- hashes exacts
- chemins de preuves exacts

## Validation locale

- Verifier que les hashes sont exacts et gardent le bon ordre.
- Verifier que les chemins de preuves sont exacts et gardent le bon ordre.
- Verifier que le compte `Valide` / `Partiellement valide` / `Non valide` est exact.
- Garder visibles les echecs et resultats partiels dans la note finale.
- Convertir ensuite le JSON valide en Markdown localement.

## Limites

- Un prompt trop libre pousse vite Mistral vers une synthese trop generale ou trop longue.
- `mistral-large-latest` peut rester utile pour une seconde passe, mais pas comme source appliquee sans borne stricte.
- Codex doit toujours verifier les faits Git avant publication.
