# Contexte borne - triage de commentaires de review GitHub

Date de verification locale: 2026-06-07.

Repo concerne:

- `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`

Faits repo verifies par Codex:

- `package.json` expose uniquement `npm run validate`, `npm run check:helper`, et `npm run check:models`.
- Il n'existe pas de script `npm test`.
- Le helper `mistral-subagent/scripts/mistral-subagent.mjs` pointe par defaut vers `D:\00_Cerveau_IA\API\env.Local`.
- Le helper accepte ces noms de cle API: `MISTRAL_API_KEY`, `MISTRAL_AI_API_KEY`, `MISTRALAI_API_KEY`, `MISTRAL.API_KEY`.
- Les rapports quotidiens publics du lab doivent etre en francais et indiquer clairement `Valide`, `Non valide`, ou `Partiellement valide`.
- Si une capacite est validee, le repo doit idealement ajouter une reference reutilisable sous `mistral-subagent/references/`.
- `D:\00_Cerveau_IA\API\env.Local` ne doit jamais etre committe ni modifie par une sortie Mistral.
- Le 2026-06-07, `mistral-medium-3.5` est encore disponible comme alias via la commande locale `models`.

Scope du PR en revue:

- ajout d'un nouveau rapport quotidien sous `docs/daily-tests/`
- ajout eventuel d'une nouvelle reference FR sous `mistral-subagent/references/`
- mise a jour eventuelle du `README.md`
- aucun changement permis sur `env.Local`

Chemins autorises pour `target_paths`:

- `README.md`
- `docs/daily-tests/2026-06-07-review-comments-triage.md`
- `mistral-subagent/references/review-comments-triage-fr.md`
- `NONE`

Commentaires de review a trier:

## C1

Le rapport quotidien doit indiquer explicitement `Valide`, `Non valide` ou `Partiellement valide`, sinon le suivi de l'objectif 70 % devient ambigu.

## C2

Ajoute `npm test` dans les commandes de validation du rapport pour couvrir le helper.

## C3

La section `API Key Configuration` du `README.md` doit lister `MISTRAL.API_KEY`, car c'est la cle detectee localement.

## C4

Pousse aussi une mise a jour de `D:\00_Cerveau_IA\API\env.Local` pour uniformiser la cle utilisee par le helper.

## C5

Si ce test est valide, ajoute une reference FR dediee dans `mistral-subagent/references/` pour reutiliser le workflow de triage de commentaires.

## C6

Retire `mistral-medium-3.5` du `README.md`; ce modele n'existe plus.

## C7

Les commandes finales du rapport doivent inclure `npm run check:helper` en plus de `npm run validate`.

## C8

Je ne sais pas si la nouvelle reference FR doit couvrir seulement le triage de commentaires ou aussi la revue de diff. Merci de preciser le scope avant merge.
