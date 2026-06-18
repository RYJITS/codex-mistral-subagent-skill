# Redaction de rapport quotidien FR depuis evidences bornees

## Quand c'est utile
Utile pour generer des rapports quotidiens en francais, strictement conformes aux evidences fournies, avec titres exacts, commandes locales exactes, et sans invention. Ce workflow repond au besoin d'audit, de validation, et de synchronisation memoire impose par `AGENTS.md`.

## Route validee dans le lab
Teste sur `mistral-small-latest`, `mistral-medium-3.5`, `mistral-large-latest`, et `devstral-latest`. Le premier passage a echoue pour les quatre modeles, car les trois litteraux obligatoires n'etaient pas reproduits mot pour mot. Un retry avec prompt plus litteral a valide la capacite.

## Recommandation pratique
Choisir `mistral-medium-3.5` comme modele par defaut pour ce workflow. Garder un prompt compact, des titres imposes, et un oracle local qui verifie les litteraux obligatoires, les commandes exactes, l'ASCII, et la liste des fichiers de preuve.

## Prompt type
Le prompt initial doit imposer le titre, l'ordre des sections, la langue, et l'interdiction d'inventer des fichiers, modeles, CI, ou commandes. Si le premier passage oublie des fragments critiques, faire un retry plus litteral en forant explicitement:

- `recommend a donne un faux negatif`
- `select-model a route vers `devstral-latest``
- `Codex garde la verification, les tests, l'edition locale, Git, et la memoire`

## Validation Codex
Verifier localement:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Rediger un rapport quotidien GitHub en francais a partir d evidences JSON bornees, avec titres exacts, commandes locales exactes et sans invention."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Rediger un rapport quotidien GitHub en francais a partir d evidences JSON bornees, avec titres exacts, commandes locales exactes et sans invention."
npm run validate
npm run check:helper
```

## Limites observees
- Le workflow est sensible aux formulations du prompt quand des litteraux precis doivent etre recopies.
- `recommend` a produit un faux negatif (`suitable=false`, `confidence=0.34`) sur une tache pourtant bornee et verifiable.
- `select-model` a route vers `devstral-latest`, mais `mistral-medium-3.5` a ete le meilleur defaut pratique sur le retry retenu.
