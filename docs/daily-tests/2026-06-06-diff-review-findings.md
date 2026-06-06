# Test quotidien 2026-06-06 - revue bornee de diff avec findings actionnables

## Statut

**Valide**

## Categorie de tache

Revue de diff bornee, classement JSON de retours actionnables, et routage modele pour maintenance de repo public.

## Pourquoi c'est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` passent souvent par des petits patches sur des skills, helpers, README, et workflows. Si Mistral sait faire une premiere passe de revue sur un diff borne sans inventer de commandes ni de fichiers, Codex peut deleguer une partie recurrente des retours de PR et garder son temps pour la verification et l'integration locale.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `codestral-latest`

## Resume des prompts et du contexte

- Contexte envoye: un cas borne de diff sur `mistral-subagent/scripts/mistral-subagent.mjs` et `README.md`, avec extraits source verifies avant diff, commandes repo prouvees, et rappel explicite que `npm test` n'existe pas dans `package.json`.
- Prompt principal: demander un JSON strict en francais avec au maximum 3 findings, uniquement a forte confiance, ancres dans le diff et le contexte, sans hypothese hors du scope.
- Brouillon de reference: un second appel `mistral-medium-3.5` a servi a rediger une premiere passe du workflow FR de revue de diff, ensuite normalisee par Codex.

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1257 | 757 | 2014 | Faux positif documentaire, sortie non retenue |
| `mistral-medium-3.5` | 1257 | 871 | 2128 | Meilleure sortie, 3 findings utiles et verifiables |
| `devstral-latest` | 1257 | 743 | 2000 | Bon second avis, 3 findings utiles mais priorisation moins nette |
| `codestral-latest` | 1257 | 637 | 1894 | Capte le changement code et `npm test`, mais banalise l'incoherence README |
| `mistral-medium-3.5` reference | 697 | 595 | 1292 | Brouillon utile pour la nouvelle reference FR |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5` revue de diff: 2128
- `devstral-latest` revue de diff: 2000
- `mistral-medium-3.5` brouillon reference: 1292

Total utile retenu: `5420` tokens.

## Resultat

Validation positive sous verification Codex.

- `mistral-medium-3.5` a correctement remonte les trois problemes reels du diff:
  - regression du chemin par defaut de `DEFAULT_ENV`;
  - suppression de `fileEnv.MISTRAL_API_KEY` et `fileEnv.MISTRAL_AI_API_KEY`;
  - ajout d'une commande `npm test` non prouvee.
- `devstral-latest` a confirme ces trois axes, mais avec une priorisation moins utile sur le fix du changement de chemin.
- `codestral-latest` a bien capte le changement code et la commande `npm test`, mais a traite l'incoherence README comme une simple mise a jour au lieu d'un probleme de contrat repo.
- `mistral-small-latest` a derive sur un faux finding documentaire et n'est pas retenu comme base fiable pour cette capacite.

Sorties Mistral directement utilisees:

- findings de `mistral-medium-3.5` pour la validation de la capacite;
- findings de `devstral-latest` comme confirmation secondaire;
- brouillon `mistral-medium-3.5` pour la reference `mistral-subagent/references/diff-review-findings-fr.md`, ensuite resserre et verifie par Codex.

## Commandes de validation

Verification du contexte repo:

```powershell
Select-String -Path 'mistral-subagent/scripts/mistral-subagent.mjs' -Pattern 'DEFAULT_ENV|fileEnv\.MISTRAL_API_KEY|fileEnv\.MISTRAL_AI_API_KEY'
Select-String -Path 'README.md','package.json' -Pattern 'env.Local|npm test|check:helper|validate'
```

Verification des sorties Mistral:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-06-mistral-medium-3.5-diff-review.json -Raw | ConvertFrom-Json
Get-Content docs/daily-tests/evidence/2026-06-06-devstral-diff-review.json -Raw | ConvertFrom-Json
```

Validation repo apres integration:

```powershell
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Le test porte sur un diff borne et controle, pas sur une PR large ni sur un repo multi-centaines de lignes.
- `mistral-small-latest` n'est pas assez fiable ici sans schema encore plus compact et diff plus court.
- `codestral-latest` reste utile pour du code pur, mais n'est pas le meilleur premier choix quand le diff melange logique helper et contrat README/commande.
- La capacite reste subordonnee a une verification Codex stricte; elle n'est pas autonome.

## Prochaine action

Tester une capacite voisine a fort rendement operationnel: classification stricte de commentaires/reviews GitHub en JSON actionnable ou extraction OCR/document bornee si un cas reel se presente.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour une famille recurrente de revue de patchs et de retours de maintenance sur repo public. Estimation cumulative apres ce run: **38 pourcent** de couverture des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-06-diff-review-context.txt`
- `docs/daily-tests/evidence/2026-06-06-diff-review-prompt.txt`
- `docs/daily-tests/evidence/2026-06-06-mistral-small-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-medium-3.5-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-devstral-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-codestral-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-medium-3.5-diff-review-reference-draft.json`
