# Test quotidien 2026-06-13 - generation de documentation publique FR

## Statut

**Valide**

## Categorie de tache

Generation de documentation publique FR bornee a partir d'un contexte repo filtre.

## Pourquoi c'est important pour les projets reels

Le dossier `D:\00_Cerveau_IA\Projet` contient plusieurs projets reels UI, WebGL, CV, et narration video qui ont besoin de notes FR compactes pour router les taches, documenter les workflows, et accelerer les handoffs entre Codex et Mistral. Si Mistral sait produire ce type de doc publique dans un cadre borne, Codex peut deleguer une partie recurrente des README, notes operateur, catalogues de taches, et references de skill.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

## Resume des prompts et du contexte

- Contexte transmis: fichier borne `docs/daily-tests/evidence/2026-06-13-public-doc-generation-context.md` contenant le role du repo, les projets reels concernes, les references deja presentes, les capacites validees du lab, les commandes exactes, et les contraintes editoriales de publication.
- Prompt 1: schema JSON riche avec `doc_markdown`, sections attendues, commandes exactes, distinction `Valide` / `Partiellement valide`, et interdiction d'inventer des commandes ou des rapports.
- Prompt 2: schema JSON plus compact centre sur un seul document `docs/TASK_CATALOG_FR.md`.
- Prompt 3 retenu: generation directe du Markdown, avec titres imposes, sans tableau ni code fence, et plafond de taille.

## Usage et tokens

- Route `json_v1`
  - `mistral-small-latest`: `3593` tokens totaux, sortie tronquee, non retenue.
  - `mistral-medium-3.5`: `1446` tokens totaux, sous-reponse limitee au titre, non retenue.
  - `mistral-large-latest`: `3593` tokens totaux, sortie tronquee, non retenue.
  - `devstral-latest`: `1443` tokens totaux, titre seul, non retenu.
- Route `json_retry`
  - `mistral-small-latest`: `3187` tokens totaux, sortie tronquee, non retenue.
  - `mistral-medium-3.5`: `3187` tokens totaux, sortie tronquee, non retenue.
  - `mistral-large-latest`: `3187` tokens totaux, sortie tronquee, non retenue.
  - `devstral-latest`: `2818` tokens totaux, brouillon utile mais schema encore derive, non compte comme sortie appliquee.
- Route `markdown_direct`
  - `mistral-medium-3.5`: `2377` tokens totaux, dont `822` utiles retenus pour verification croisee.
  - `devstral-latest`: `2585` tokens totaux, dont `1042` utiles retenus comme base principale du document final.
- Tokens Mistral utiles comptes pour la validation du jour: `1864`.

## Resultat

- Les deux routes JSON ont montre une limite claire sur cette capacite: soit une troncature, soit une sous-reponse, soit un schema derive trop pauvre pour etre publie.
- La route `markdown_direct` a en revanche produit deux brouillons compacts et directement exploitables.
- `devstral-latest` a fourni la meilleure base pour `docs/TASK_CATALOG_FR.md`.
- `mistral-medium-3.5` a servi de seconde passe utile pour verifier la structure, resserrer le cadrage, et confirmer la route retenue.
- Codex a integre une version verifiee dans `docs/TASK_CATALOG_FR.md`, ajoute une reference reutilisable sous `mistral-subagent/references/public-doc-generation-fr.md`, puis documente la regle dans `README.md` et `mistral-subagent/SKILL.md`.

## Commandes de validation

- `npm run validate`
- `npm run check:helper`
- `git status --short`
- `Get-Content docs/daily-tests/evidence/2026-06-13-public-doc-generation-validation-summary.json -Raw | ConvertFrom-Json`

## Limitations

- Pour un document complet, un JSON verbeux contenant tout le Markdown est trop fragile sur ce lot de modeles.
- `mistral-large-latest` n'a pas apporte d'avantage net ici face a `devstral-latest` et `mistral-medium-3.5`.
- Codex doit toujours verifier les statuts cites, les commandes exactes, l'ASCII, et l'absence d'inventions.

## Prochaine action

Tester une capacite publique voisine encore peu couverte, par exemple la generation d'un commentaire GitHub FR borne a partir d'un diff ou d'un rapport valide, avec verification de ton, d'exactitude, et d'actionnabilite.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee car Mistral a produit un document public FR directement exploitable dans une route borne et reproductible. Estimation cumulative apres ce run: **76 pourcent** de couverture des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-context.md`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-markdown-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-mistral-small-latest-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-latest-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-devstral-latest-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-small-latest-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-latest-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-devstral-latest-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-public-doc-generation-markdown.json`
- `docs/daily-tests/evidence/2026-06-13-devstral-latest-public-doc-generation-markdown.json`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-validation-summary.json`
