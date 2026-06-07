# Triage de commentaires de review en francais

## Quand l'utiliser

Utiliser ce workflow pour une premiere passe sur un petit lot de commentaires de review ou de PR quand Codex veut separer rapidement:

- ce qui peut etre applique tout de suite;
- ce qui doit etre rejete;
- ce qui exige une decision humaine.

La capacite n'est validee que sous verification Codex. Mistral ne decide ni les changements finaux, ni les pushes Git, ni les choix legaux.

## Contexte minimal a envoyer

- les commentaires de review, avec des ids stables comme `R1` a `R6`;
- le contexte repo strictement utile pour verifier si une demande est deja satisfaite, interdite, ou applicable;
- une liste fermee de chemins cibles autorises;
- une liste fermee de commandes de validation autorisees;
- les garde-fous explicites sur Git, shell, secrets, et licences.

Pour ce repo, le test valide du `2026-06-07` utilisait une liste fermee de commandes:

- `npm run validate`
- `npm run check:helper`
- `git status --short`
- `Select-String -Path README.md,mistral-subagent/SKILL.md -Pattern 'quota-report|json-extraction-maintenance-fr|ui-ux-copy-scroll-driven-fr|MISTRAL_ENV_FILE'`

## Prompt conseille

Demander un JSON strict avec:

- `verdict`
- `task_category`
- `overall_summary_fr`
- `actions`
- `global_rules_fr`
- `limitations_fr`

Chaque objet de `actions` doit garder:

- `comment_id`
- `disposition`
- `target_path`
- `reason_fr`
- `validation_commands`

Contraintes utiles:

- garder l'ordre exact des commentaires, par exemple `R1` a `R6`;
- limiter `disposition` a `apply_now`, `needs_human`, `reject`;
- utiliser `target_path: "none"` si aucun changement fichier ne doit etre applique;
- interdire toute commande hors liste fermee;
- classer en `reject` toute demande deja satisfaite dans le repo;
- classer en `needs_human` toute decision legale ou strategique finale.

## Routage modele valide

- `mistral-medium-3.5`: meilleure premiere passe stricte sur ce test; le retry a produit la seule sortie pleinement exploitable sans reparation semantique.
- `devstral-latest`: bon second avis repo; le retry a confirme les `6` classifications et la liste fermee de commandes, mais le resume restait moins strict.
- `mistral-large-latest`: bonne seconde opinion pour la formulation francaise; le retry a confirme le triage, mais pas le resume exact attendu.
- `mistral-small-latest`: a bien classe les `6` actions, mais a derive sur les commandes de validation et le resume.

## Limites observees

- Sans prompt de retry plus serre, les modeles ont tendance a recomposer les commandes `Select-String` au lieu de respecter la liste fermee.
- Un modele peut classer correctement toutes les actions tout en ratant le resume strict demande.
- Le workflow reste borne a de petits lots de commentaires et a un contexte repo deja verifie.
- La capacite ne remplace pas la verification locale Codex sur ce qui est deja implemente, interdit, ou hors gouvernance.

## Lecons du test 2026-06-07

- Les quatre modeles testes ont correctement classe `6` actions sur `6` des le premier passage.
- Le premier passage n'etait pas assez strict sur les commandes autorisees ni sur le resume attendu.
- Le retry strict a rendu `mistral-medium-3.5` pleinement exploitable.
- `devstral-latest` retry et `mistral-large-latest` retry ont servi de confirmations utiles du triage, meme si leur resume restait moins rigide.
- Le workflow est assez fiable pour une premiere passe de triage de feedback repo/documentation sous supervision Codex.

## Validation Codex

Ne compter la capacite comme validee que si Codex:

1. parse le JSON externe puis le JSON interne de `text` si necessaire;
2. verifie l'ordre exact des commentaires attendus;
3. confirme les enums `apply_now`, `needs_human`, et `reject`;
4. rejette toute commande hors liste fermee;
5. verifie localement si une demande est deja satisfaite ou explicitement interdite;
6. ne retient comme utile que les sorties directement reutilisees pour un rapport, une reference, ou un triage d'actions reel.
