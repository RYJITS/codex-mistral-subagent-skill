# Contexte borne pour generation de documentation publique FR

## Repo cible

- Repo: `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Objectif du repo: skill Codex pour deleguer a Mistral des taches bornees, textuelles, et verifiables.
- Fichier a generer: `docs/TASK_CATALOG_FR.md`
- Langue cible: francais ASCII

## Pourquoi cette documentation compte pour les projets reels

- Le dossier `D:\00_Cerveau_IA\Projet` contient plusieurs projets reels axes UI, WebGL, CV, et narration video:
  - `AI_VIDEO_WEBGL_COMPETENCES`
  - `AI_VIDEO_WEBGL_COMPETENCES_CLEAN`
  - `CV_SITE`
  - `CV_WEBGL_SCROLL_VIDEO_SITE`
- Dans ces projets, une note FR compacte expliquant quelle tache deleguer a quel modele est recurrente pour cadrer README, notes operateur, references de skill, et passes de triage avant execution.

## Sources repo deja presentes

### `README.md`

- Le repo explique deja:
  - le role du skill `mistral-subagent`
  - les commandes `recommend`, `run`, `project-scan`, `project-action`, `check`, `models`
  - le routage de modeles `mistral-small-latest`, `mistral-medium-latest`, `mistral-large-latest`, `devstral-latest`, `codestral-latest`, `mistral-ocr-latest`, `mistral-embed`, `mistral-moderation-latest`, `voxtral-mini-latest`
- Le README reference deja plusieurs workflows FR valides:
  - quota reporting
  - extraction JSON maintenance repo
  - triage de commentaires de review
  - filtrage pre-vol avant delegation
  - planification RAG/embeddings
  - traduction structuree
  - revue de diff
  - idees de tests
  - critique UI/UX copy
  - OCR
  - transcription audio

### `docs/TASK_CATALOG.md`

- Version anglaise actuelle:
  - classe les taches par modele
  - couvre texte/JSON, code/dev, projet/docs, ideation
  - rappelle ce qui est adapte ou non a Mistral
- Cette version reste generique et ne mentionne pas les validations concretes du lab en francais.

### `docs/PUBLIC_REPO_QUICKSTART_FR.md`

- La doc publique FR existe deja pour le quickstart.
- Une note FR complementaire sur le routage des taches aiderait les projets reels sans demander une traduction integrale du repo.

## Capacites deja validees ou partiellement validees dans le lab

- `Partiellement valide`: audit borne de repo public et petite amelioration documentaire
- `Partiellement valide`: generation/amelioration bornee de templates GitHub d'issue
- `Valide`: storyboard/prompt planning video scroll-driven
- `Valide`: extraction JSON stricte d'un brief de maintenance repo
- `Valide`: critique et reecriture UI/UX copy pour experience scroll-driven
- `Valide`: idees de tests unitaires bornees pour le helper
- `Valide`: revue de diff simple avec findings JSON
- `Valide`: triage strict de commentaires de review
- `Valide`: quota reporting de delegation
- `Valide`: filtrage pre-vol avant delegation
- `Valide`: planification RAG/embeddings multi-projets
- `Valide`: OCR/extraction structuree de document
- `Valide`: traduction structuree de note publique
- `Valide`: transcription audio FR bornee

## Contraintes editoriales pour `docs/TASK_CATALOG_FR.md`

- Ecrire en francais ASCII.
- Garder exacts les model ids, commandes, chemins, et noms de fichiers.
- Ne pas inventer de commande absente du repo.
- Ne pas inventer de validation ou de capacite non testee.
- Mentionner explicitement que Codex garde la main sur secrets, edition locale, shell, tests, Git, et verification finale.
- Transformer le contenu en documentation utile pour un humain:
  - plus concret que `docs/TASK_CATALOG.md`
  - plus operationnel qu'un simple README marketing
  - basee sur les validations du lab

## Structure attendue pour la doc

- Titre
- Court paragraphe d'objectif
- Section "Quand deleguer a Mistral"
- Section "Routage par modele"
- Section "Capacites deja validees dans ce repo"
- Section "Ce que Codex doit garder"
- Section "Workflow recommande"
- Section "Commandes utiles"

## Commandes du repo a citer si utile

- `npm run validate`
- `npm run check:helper`
- `node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "..."`
- `node mistral-subagent/scripts/mistral-subagent.mjs run --task "..." --context-file <path> --model mistral-small-latest`
- `node mistral-subagent/scripts/mistral-subagent.mjs project-scan --path <path> --output <path>`
- `node mistral-subagent/scripts/mistral-subagent.mjs project-action --path <path> --goal "..." --output <path>`

## Critere de validation Codex

- La sortie compte comme utile si Codex peut en appliquer directement l'essentiel dans `docs/TASK_CATALOG_FR.md`.
- Les formulations doivent rester factuelles et verifiables par les fichiers du repo.
- Les references aux capacites du lab doivent correspondre aux rapports deja presents dans `docs/daily-tests/`.
