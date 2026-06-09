# Contexte borne pour test RAG/embeddings multi-projets

## Objectif reel

Produire un plan JSON de preparation RAG/embeddings pour le cerveau central `D:\00_Cerveau_IA` et pour le repo public `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`, afin d'aider Codex a indexer, router et retrouver rapidement les connaissances utiles sans exposer de secret.

## Regles et structure confirmees

- Structure obligatoire du cerveau central:
  - `D:\00_Cerveau_IA\Conpetances`
  - `D:\00_Cerveau_IA\Instructions`
  - `D:\00_Cerveau_IA\Memoire`
  - `D:\00_Cerveau_IA\API\env.Local`
- Regles AGENTS:
  - les infos importantes utilisateur vont dans la memoire user
  - les evolutions projet vont dans la memoire projet
  - apres chaque mise a jour memoire, regenerer les index
  - tout doit rester compatible multi-projets
- Commandes confirmees depuis `D:\00_Cerveau_IA\Conpetances`:
  - `npm run memoire:record -- --scope user ...`
  - `npm run memoire:record -- --scope projet --project \"<projet>\" ...`
  - `npm run memoire:update`

## Arborescence utile observee

### Racine `D:\00_Cerveau_IA`

- `Conpetances\`
- `Instructions\`
- `Memoire\`
- `Projet\`
- `API\env.Local`
- `AGENTS.md`
- `README_CERVEAU_IA.md`
- `STRUCTURE_CERVEAU.md`

### `D:\00_Cerveau_IA\Memoire`

- `Memoire User\`
- `Memoire projet\`
- `COMPETENCES_INDEX.md`
- `INSTRUCTIONS_INDEX.md`
- `MEMOIRE_INDEX.md`
- `PROJET_MEMOIRE_INDEX.md`
- `USER_MEMOIRE_INDEX.md`
- `PROJET_GLOBAL_ETAT.md`

### `D:\00_Cerveau_IA\Conpetances`

- scripts Node/PowerShell/Python multi-projets
- `package.json` contient:
  - `memoire:record`
  - `memoire:update`
  - automatisations image/video/telegram/webgl

### Repo public `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`

- `README.md`
- `package.json`
- `docs/daily-tests/`
- `mistral-subagent/SKILL.md`
- `mistral-subagent/references/`
- `mistral-subagent/scripts/mistral-subagent.mjs`

## Contraintes de securite

- Ne jamais indexer ni envoyer le contenu de `D:\00_Cerveau_IA\API\env.Local`.
- Exclure les secrets, tokens, credentials, et chemins marques comme sensibles.
- Mistral ne doit pas recevoir un snapshot massif; seulement un plan borne.

## Ce qu'un bon plan doit couvrir

- collections ou corpus distincts pour:
  - `Conpetances`
  - `Instructions`
  - `Memoire`
  - repo `codex-mistral-subagent-skill`
- exclusions explicites:
  - `API/env.Local`
  - fichiers secrets
  - gros binaires et caches
- chunking adapte a de la doc et a des scripts
- metadata utiles pour multi-projets:
  - projet
  - type de source
  - chemin
  - date de mise a jour
  - portee user/projet/global si pertinent
- refresh:
  - reindexation apres `npm run memoire:update`
  - reindexation lors d'ajout de competence, instruction ou reference
- validation:
  - verifier que les chemins et commandes existent deja
  - ne pas inventer de scripts ou d'infrastructure non observee

## Format attendu

Codex veut un JSON strict, en francais, concis mais exploitable, avec:

- `task_category`
- `why_it_matters_fr`
- `collections`
- `exclusions`
- `chunking_policy`
- `metadata_schema`
- `refresh_triggers`
- `validation_checks`
- `risks`
- `contributes_to_70_objective`

Chaque `collection` doit preciser au minimum:

- `id`
- `paths`
- `content_types`
- `priority`
- `notes_fr`

Chaque `validation_check` doit rester faisable avec des commandes deja connues localement ou une verification manuelle simple.
