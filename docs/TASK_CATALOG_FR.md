# Catalogue FR des taches delegables a Mistral

Ce document cadre les taches textuelles et verifiables que Codex peut deleguer a Mistral dans `codex-mistral-subagent-skill`, a partir des validations concretes du lab et des besoins reels de projets UI, WebGL, CV, et narration video.

## Quand deleguer a Mistral

Deleguer a Mistral quand la tache est:

- bornee: objectif clair, contexte limite, sortie controlable;
- textuelle: Markdown, JSON, critique, triage, extraction, traduction, transcription;
- non sensible: aucun secret, aucune donnee privee, aucun acces shell ou Git requis;
- verifiable: Codex peut comparer la sortie a un oracle local, a un schema, ou a des fichiers du repo.

Exemples recurents: extraire un JSON de maintenance, critiquer une copy UI/UX, preparer un storyboard, transcrire une voix off FR, ou rediger une note publique compacte.

## Routage par modele

- `mistral-small-latest`: premier choix pour extraction, classification, triage, et brouillons textuels courts.
- `mistral-medium-latest` ou `mistral-medium-3.5`: synthese plus riche, revue de diff, traduction structuree, et normalisation de sorties vers un format borne.
- `mistral-large-latest`: passe de qualite publique ou seconde opinion quand la formulation compte plus que le cout.
- `devstral-latest`: audit de repo, generation documentaire bornee, decomposition de taches, et cadrage de changements repo-centric.
- `codestral-latest`: taches proches du code comme idee de tests, revue de snippets, ou petit patch borne.
- `mistral-ocr-latest`: OCR et extraction structuree sur image ou document.
- `mistral-embed`: planification retrieval/RAG ou embeddings avant implementation locale.
- `mistral-moderation-latest`: signal moderation/PII supplementaire, jamais politique finale a lui seul.
- `voxtral-mini-latest`: transcription audio FR bornee via la route audio dediee.

## Capacites deja validees dans ce repo

**Valide**

- storyboard/prompt planning video scroll-driven
- extraction JSON stricte d'un brief de maintenance repo
- critique et reecriture UI/UX copy pour experience scroll-driven
- idees de tests unitaires bornees pour le helper
- revue de diff simple avec findings JSON
- triage strict de commentaires de review
- quota reporting de delegation
- filtrage pre-vol avant delegation
- planification RAG/embeddings multi-projets
- OCR/extraction structuree de document
- traduction structuree de note publique
- transcription audio FR bornee
- generation de documentation publique FR bornee a partir d'un contexte repo filtre
- planification structuree de prompts image sous `promptLock` existant
- triage borne de feedback image vers corrections de prompt sous oracle local

**Partiellement valide**

- audit borne de repo public et petite amelioration documentaire
- generation/amelioration bornee de templates GitHub d'issue

## Ce que Codex doit garder

Codex garde toujours la main sur:

- les secrets, credentials, et fichiers sensibles;
- l'edition locale des fichiers;
- l'execution shell et les tests;
- Git, les commits, et les pushes;
- la verification finale des faits, commandes, chemins, et sorties.

Mistral reste un sous-agent de redaction, d'analyse, ou de preparation. Il ne decide pas seul d'un changement de repo.

## Workflow recommande

1. Borner la tache: objectif, sortie attendue, et fichiers autorises.
2. Filtrer le contexte: retirer secrets, bruit, et parties non necessaires.
3. Choisir le modele adapte au type de livrable.
4. Preferer un format de sortie simple et verifiable.
5. Verifier localement avant toute integration.

Pour une documentation publique compacte, le lab a montre qu'un Markdown direct avec titres imposes tient mieux qu'un JSON tres verbeux. `devstral-latest` et `mistral-medium-3.5` ont produit les brouillons les plus utiles sur ce cas.

## Commandes utiles

- `npm run validate`
- `npm run check:helper`
- `node mistral-subagent/scripts/mistral-subagent.mjs models`
- `node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "..."`
- `node mistral-subagent/scripts/mistral-subagent.mjs run --task "..." --context-file <path> --model mistral-small-latest`
- `node mistral-subagent/scripts/mistral-subagent.mjs project-scan --path <path> --output <path>`
- `node mistral-subagent/scripts/mistral-subagent.mjs project-action --path <path> --goal "..." --output <path>`
