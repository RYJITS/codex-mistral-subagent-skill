# Test quotidien 2026-06-04 - audit borne de repo public

## Statut

**Partiellement valide**

## Categorie de tache

Audit borne d'un repo public avec proposition d'une petite amelioration documentaire ou de validation.

## Pourquoi c'est important pour les projets reels

Cette capacite revient souvent sur les skills, repos publics, README et notes de publication du cerveau central IA. Si Mistral sait faire une premiere passe d'audit fiable, Codex peut deleguer une partie recurrente du cadrage documentaire et reduire son temps sur les taches de faible risque.

## Modeles testes

- `devstral-latest`
- `mistral-medium-latest`
- `mistral-small-latest`

## Resume des prompts et du contexte

- Contexte transmis: snapshot JSON filtre du repo via `project-scan`, limite a 8 fichiers inclus, 40 fichiers au manifest, et 14000 octets de contexte.
- Prompt 1 et 2: demander un audit borne avec un seul changement recommande, un format JSON strict, des commandes de validation limitees au snapshot, et une sortie en francais quand le contenu vise l'utilisateur.
- Prompt 3: demander une section Markdown francaise directement integrable dans `mistral-subagent/references/delegation-playbook.md` pour formaliser ce workflow pour les futurs runs.

## Usage et tokens

- `devstral-latest`: 5262 tokens totaux, 4912 prompt, 350 completion. Sortie non comptee comme validee car la recommandation etait redondante avec le template de PR existant.
- `mistral-medium-latest`: 5438 tokens totaux, 4912 prompt, 526 completion. Sortie non comptee comme validee car elle inventait `npm test`, absent du repo.
- `mistral-small-latest`: 1380 tokens totaux, 746 prompt, 634 completion. Sortie directement utile comme base de la nouvelle section du playbook, puis normalisee par Codex.
- Tokens Mistral utiles comptes pour la validation du jour: `634`.

## Resultat

- `devstral-latest` a correctement qualifie la tache comme delegable, mais a propose un ajout de section de tests redondant dans `.github/PULL_REQUEST_TEMPLATE.md`.
- `mistral-medium-latest` a bien detecte le besoin de renforcer la reference de validation, mais sa liste de commandes n'etait pas suffisamment fiable pour etre appliquee telle quelle.
- `mistral-small-latest` a fourni un brouillon exploitable pour documenter une procedure d'audit borne. Codex a conserve l'idee, retire les elements hors scope et integre une version verifiee dans le playbook.

## Commandes de validation

- `npm run validate`
- `npm run check:helper`
- `git status --short`

## Limitations

- Le helper a marque `README.md` comme `secret_like_content` dans le snapshot du jour, donc l'audit n'a pas porte sur toute la documentation publique.
- Les modeles ont encore tendance a inventer des commandes ou a proposer des changements redondants si le prompt n'impose pas un perimetre tres strict.
- La capacite reste utile seulement sous verification Codex; elle n'est pas autonome.

## Prochaine action

Tester une capacite voisine mais plus mecanique, par exemple extraction JSON stricte ou revue de diff simple, pour mesurer si Mistral tient mieux un format verifiable de bout en bout.

## Contribution vers l'objectif 70 pourcent

Oui, partiellement. Cette capacite compte comme une brique utile mais non autonome. En tenant compte des autres rapports deja presents dans `docs/daily-tests/` pour le 2026-06-04, estimation cumulative apres ce run: **15 pourcent** de couverture des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-04-project-scan.json`
- `docs/daily-tests/evidence/2026-06-04-devstral-audit.json`
- `docs/daily-tests/evidence/2026-06-04-medium-audit.json`
- `docs/daily-tests/evidence/2026-06-04-small-playbook.json`
