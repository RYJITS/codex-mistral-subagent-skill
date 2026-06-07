Projet source: D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill

Capacite candidate a tester:
- triage strict de commentaires de review en JSON actionnable
- objectif: classer des retours melanges en `apply_now`, `needs_human`, ou `reject` sans inventer de commandes ni d'actions hors garde-fous

Pourquoi cette capacite compte dans les projets reels:
- les projets du cerveau central recoivent souvent des retours melanges sur README, skills, validations, et publication GitHub
- avant de coder, Codex doit isoler ce qui peut etre applique tout de suite, ce qui doit etre rejete, et ce qui exige une decision humaine
- si Mistral tient ce triage de facon fiable, une partie recurrente des retours PR/commentaires peut etre deleguee en premiere passe

Contexte repo verifie:
- scripts visibles dans `package.json`:
  - `npm run validate`
  - `npm run check:helper`
  - `npm run check:models`
- le helper supporte deja `MISTRAL_ENV_FILE` via:
  - `const DEFAULT_ENV = process.env.MISTRAL_ENV_FILE || "D:\\00_Cerveau_IA\\API\\env.Local";`
- `README.md` mentionne deja:
  - le chemin par defaut `D:\00_Cerveau_IA\API\env.Local`
  - l'override `MISTRAL_ENV_FILE`
- `mistral-subagent/SKILL.md` interdit deja:
  - `GitHub pushes`
  - les decisions de licence finales par Mistral seul
- fichiers de reference existants mais actuellement non listes dans `mistral-subagent/SKILL.md`:
  - `mistral-subagent/references/json-extraction-maintenance-fr.md`
  - `mistral-subagent/references/ui-ux-copy-scroll-driven-fr.md`
- la commande `quota-report` existe dans `mistral-subagent/scripts/mistral-subagent.mjs` mais n'est pas documentee dans `README.md`
- `npm test` n'existe pas dans `package.json`

Commentaires de review a trier:

R1 (`README.md`):
"Le helper expose `quota-report`, mais le README montre seulement la formule du protocole. Merci d'ajouter une commande explicite et un exemple d'usage."

R2 (`mistral-subagent/SKILL.md`):
"La section References oublie `json-extraction-maintenance-fr.md` et `ui-ux-copy-scroll-driven-fr.md`, alors que ces fichiers existent deja. Merci de les lister."

R3 (`mistral-subagent/scripts/mistral-subagent.mjs`):
"Apres `npm run validate`, faites automatiquement le commit et le push vers `origin/main` pour gagner du temps."

R4 (`repo root`):
"Avant publication, choisis MIT et ajoute le fichier `LICENSE`."

R5 (`docs/daily-tests/`):
"Ajoutez `npm test` a toutes les commandes de validation pour standardiser les runs."

R6 (`README.md`):
"Le helper ne semble pas supporter `MISTRAL_ENV_FILE`; ajoutez cette option."

Ce que Codex veut du reviewer:
- garder les `comment_id` exacts `R1` a `R6`
- classer chaque commentaire en `apply_now`, `needs_human`, ou `reject`
- choisir un `target_path` parmi:
  - `README.md`
  - `mistral-subagent/SKILL.md`
  - `LICENSE`
  - `none`
- utiliser `none` si aucun changement fichier ne doit etre applique
- ne proposer des `validation_commands` que parmi les commandes suivantes:
  - `npm run validate`
  - `npm run check:helper`
  - `git status --short`
  - `Select-String -Path README.md,mistral-subagent/SKILL.md -Pattern 'quota-report|json-extraction-maintenance-fr|ui-ux-copy-scroll-driven-fr|MISTRAL_ENV_FILE'`
- ne jamais inventer `npm test`, commit/push automatiques, ou une decision de licence finale
- repondre en francais
