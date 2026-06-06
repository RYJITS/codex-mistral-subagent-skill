# Test quotidien 2026-06-06 - revue de diff simple pour le helper Mistral

## Statut

**Valide**

## Categorie de tache

Revue de diff simple, detection de regressions bornees, JSON strict, et mise a jour de reference skill.

## Pourquoi c'est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` font evoluer souvent de petits helpers, scripts et skills via des patches compacts. Si Mistral peut relire ces diffs et signaler seulement les regressions reelles, Codex peut deleguer une partie recurrente de la revue initiale tout en gardant la verification locale.

## Projet et capacite testes

- Projet reel source: `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Cible: `mistral-subagent/scripts/mistral-subagent.mjs`
- Capacite testee: relire un diff compact et signaler en JSON strict les regressions reelles avant application

## Modeles testes

- `mistral-small-latest`
- `devstral-latest`
- `codestral-latest`
- `mistral-medium-3.5`
- `mistral-medium-3.5` pour le brouillon de reference

## Resume des prompts et du contexte

- Contexte transmis:
  - un diff candidat unique sur `getApiKey` et `checkConfig`
  - le comportement attendu deja verifie dans le repo:
    - `getApiKey` doit privilegier `process.env` avant le fichier env
    - `checkConfig` doit detecter une cle presente soit dans `process.env`, soit dans le fichier env
  - les commandes reelles visibles pour valider localement
- Prompt principal:
  - demander au maximum 3 findings
  - n'accepter que des regressions reelles, user-impacting, et prouvees par le diff
  - interdire toute commande, test ou fichier invente
- Brouillon de reference:
  - demander une note francaise concise
  - Codex a normalise la cible vers la reference deja suivie `mistral-subagent/references/diff-review-findings-fr.md` pour eviter un doublon

## Usage et tokens

| Modele | Prompt tokens | Completion tokens | Total tokens | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1305 | 927 | 2232 | Detecte les 2 regressions reelles mais ajoute un finding redondant, trop bruyant |
| `devstral-latest` | 1305 | 593 | 1898 | Detecte correctement 2 regressions sur 2, meilleure premiere passe |
| `codestral-latest` | 1305 | 350 | 1655 | Detecte la priorite API mais manque la degradation de `checkConfig` |
| `mistral-medium-3.5` | 1305 | 609 | 1914 | Detecte correctement 2 regressions sur 2, bonne premiere passe egalement |
| `mistral-medium-3.5` brouillon reference | 1092 | 727 | 1819 | Brouillon utile pour la reference existante, normalise par Codex |

Tokens Mistral utiles retenus pour ce run:

- `devstral-latest`: `1898`
- `mistral-medium-3.5` revue de diff: `1914`
- `mistral-medium-3.5` brouillon reference: `1819`

Total utile retenu: `5631` tokens.

Sorties exclues du comptage utile:

- `mistral-small-latest`: findings exacts mais payload trop bruyant pour une premiere passe stricte
- `codestral-latest`: second avis utile, mais incomplet car une regression sur deux manque

## Resultat

Validation positive sous routage borne:

- `devstral-latest` et `mistral-medium-3.5` ont detecte correctement les 2 regressions reelles du diff:
  - inversion de priorite dans `getApiKey`, qui ferait passer `fileEnv` avant `process.env`
  - degradation de `checkConfig`, qui ne verrait plus une cle presente uniquement dans le fichier env
- `codestral-latest` a correctement releve la regression de priorite API, mais a manque la perte de detection cote `check`
- `mistral-small-latest` a vu les 2 regressions reelles, mais a ajoute un troisieme finding redondant sur la suppression de `fileEnv`, donc trop bruyant pour une revue stricte

Validations locales executees par Codex:

- avec une cle seulement dans un fichier env temporaire, `check` retourne bien `api_key_configured: true`
- avec une cle dans `process.env` et une autre dans le fichier env, `getApiKey` retourne actuellement la valeur de `process.env`

Sorties Mistral directement utilisees:

- synthese des 2 findings valides pour la revue de diff
- routage `devstral-latest` / `mistral-medium-3.5` comme premieres passes
- base textuelle de la mise a jour de `mistral-subagent/references/diff-review-findings-fr.md`

## Commandes de validation

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs check
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt revue diff>" --context-file "docs/daily-tests/evidence/2026-06-06-diff-review-context.txt" --model devstral-latest --max-tokens 1200 --temperature 0.1 --json
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt revue diff>" --context-file "docs/daily-tests/evidence/2026-06-06-diff-review-context.txt" --model "mistral-medium-3.5" --max-tokens 1200 --temperature 0.1 --json
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt revue diff>" --context-file "docs/daily-tests/evidence/2026-06-06-diff-review-context.txt" --model codestral-latest --max-tokens 1200 --temperature 0.1 --json
npm run validate
npm run check:helper
```

Verification locale supplementaire executee:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs check --env <temp-env>
node <temp-runner.mjs>
```

## Limitations

- La capacite reste fiable surtout sur un diff compact, mono-fichier, et avec comportement attendu explicite
- `codestral-latest` est utile comme second avis, pas comme seule premiere passe ici
- `mistral-small-latest` peut rester exact sur le fond mais trop bruyant pour une revue stricte
- La validation locale reste obligatoire: un bon finding ne remplace pas la verification Codex

## Prochaine action

Tester une capacite voisine sur des retours plus textuels mais encore verifiables, par exemple classification stricte de commentaires GitHub ou extraction d'actions a partir d'un lot de feedback.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour la revue initiale de petits diffs sur des helpers et scripts locaux, avec routage `devstral-latest` ou `mistral-medium-3.5` en premiere passe. Estimation cumulative apres ce run: **37 pourcent** de couverture delegable vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-06-diff-review-candidate.patch`
- `docs/daily-tests/evidence/2026-06-06-diff-review-context.txt`
- `docs/daily-tests/evidence/2026-06-06-diff-review-prompt.txt`
- `docs/daily-tests/evidence/2026-06-06-mistral-small-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-devstral-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-codestral-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-mistral-medium-3.5-diff-review.json`
- `docs/daily-tests/evidence/2026-06-06-diff-review-local-validation.txt`
- `docs/daily-tests/evidence/2026-06-06-diff-review-reference-context.txt`
- `docs/daily-tests/evidence/2026-06-06-mistral-medium-3.5-diff-review-reference-draft.json`
