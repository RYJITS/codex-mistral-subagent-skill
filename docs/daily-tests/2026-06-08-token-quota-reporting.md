# Test quotidien 2026-06-08 - quota reporting de delegation

## Statut

**Valide**

## Categorie de tache

Reporting quota/token et synthese FR de delegation a partir du helper local `quota-report`.

## Pourquoi c'est important pour les projets reels

Le lab Mistral lui-meme demande un bilan recurrent sur la part Codex vs Mistral utile. Cette capacite sert aussi aux autres projets du cerveau central IA des qu'un run doit etre resume rapidement pour savoir si la delegation reste rentable, comptable, et assez fiable pour avancer vers l'objectif des `70 %`.

## Projet et capacite testes

- Projets source de contexte:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - lire des sorties exactes du helper `quota-report`
  - classer trois cas en `good_signal`, `borderline`, ou `poor_signal`
  - proposer une action FR courte par cas
  - produire un brouillon de reference FR reutilisable pour les futurs runs

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`
- retry strict sur `mistral-medium-3.5`, `devstral-latest`, et `mistral-large-latest`
- brouillon de reference sur `mistral-medium-3.5` et `mistral-large-latest`

## Resume des prompts et du contexte

- Contexte transmis:
  - trois sorties JSON exactes du helper `quota-report`
  - regle produit officielle: `Codex delta / (Codex delta + useful Mistral tokens)`
  - seuils fermes:
    - `good_signal` si `codex_share_percent < 49`
    - `borderline` si `codex_share_percent <= 55` sans passer sous `49`
    - `poor_signal` si `codex_share_percent > 55`
- Prompt principal:
  - demander un JSON strict avec `cases` en tableau ordonne
  - imposer les pourcentages exacts par cas
  - demander des resumes et actions utilisateur en francais
- Prompt de retry:
  - exiger ASCII uniquement
  - forcer les pourcentages en notation litterale a point decimal
  - imposer des intentions exactes `reuse workflow`, `tighten prompt`, `reduce Codex share`
- Prompt de reference:
  - demander une note Markdown courte en francais ASCII
  - imposer des sections fixes et une commande type

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1127 | 417 | 1544 | `3/3` cas bien classes, mais sortie non retenue comme base finale |
| `mistral-medium-3.5` | 1127 | 433 | 1560 | Meilleure base semantique pour les trois cas |
| `devstral-latest` | 1127 | 397 | 1524 | Bonne confirmation secondaire |
| `mistral-large-latest` | 1127 | 416 | 1543 | Bonne formulation publique, utile comme seconde opinion |
| `mistral-medium-3.5` retry | 1020 | 335 | 1355 | Lit bien les cas, mais casse le schema strict |
| `devstral-latest` retry | 1020 | 359 | 1379 | Meme faiblesse: `cases` en objet et tableaux remplaces |
| `mistral-large-latest` retry | 1020 | 397 | 1417 | Meme faiblesse sur le schema serre |
| `mistral-medium-3.5` reference | 1041 | 207 | 1248 | Brouillon retenu pour la nouvelle reference FR |
| `mistral-large-latest` reference | 1029 | 319 | 1348 | Brouillon redondant, non retenu |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5`: `1560`
- `devstral-latest`: `1524`
- `mistral-large-latest`: `1543`
- `mistral-medium-3.5` reference: `1248`

Total utile retenu: `5875` tokens.

Sorties exclues du comptage utile:

- `mistral-small-latest`, car la lecture etait correcte mais moins utile apres comparaison;
- les trois retries stricts, car le schema a derive vers `cases` en objet et tableaux remplaces par des chaines;
- `mistral-large-latest` reference, car le brouillon etait redondant par rapport au draft medium retenu.

## Resultat

Validation positive sous verification Codex.

- Les quatre modeles du premier passage ont correctement interprete les trois cas quota et les bons signaux.
- `mistral-medium-3.5` a fourni la meilleure base semantique pour le rapport et la lecture des seuils.
- `devstral-latest` et `mistral-large-latest` ont confirme la meme interpretation utile.
- Le retry plus contraint montre la limite principale:
  - le raisonnement quota tient;
  - la discipline de schema se degrade quand le prompt devient trop serre.
- `mistral-medium-3.5` a aussi produit un brouillon Markdown exploitable pour documenter ce workflow dans `mistral-subagent/references/quota-reporting-fr.md`.

Changements repo appliques a partir des sorties retenues:

- ajout de `mistral-subagent/references/quota-reporting-fr.md`
- ajout du lien de reference dans `README.md`
- ajout de la reference dans `mistral-subagent/SKILL.md`

## Commandes de validation

Sorties helper:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs quota-report --codex-baseline 1200 --codex-current 10800 --mistral-useful 18000
node mistral-subagent/scripts/mistral-subagent.mjs quota-report --codex-baseline 5000 --codex-current 14700 --mistral-useful 9500
node mistral-subagent/scripts/mistral-subagent.mjs quota-report --codex-baseline 2000 --codex-current 15200 --mistral-useful 4000
```

Appels Mistral:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-08-quota-reporting-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model mistral-small-latest --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model devstral-latest --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model mistral-large-latest --max-tokens 1200 --temperature 0.05 --json
```

Retry strict:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-08-quota-reporting-retry-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model mistral-medium-3.5 --max-tokens 1000 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model devstral-latest --max-tokens 1000 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model mistral-large-latest --max-tokens 1000 --temperature 0.05 --json
```

Reference FR:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-08-quota-reporting-reference-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model mistral-medium-3.5 --max-tokens 900 --temperature 0.1
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md" --model mistral-large-latest --max-tokens 900 --temperature 0.1
```

Verification locale:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-08-quota-reporting-validation-summary.json -Raw | ConvertFrom-Json
Select-String -Path README.md,mistral-subagent/SKILL.md,mistral-subagent/references/quota-reporting-fr.md -Pattern 'quota-reporting-fr|quota-report|good_signal'
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Le raisonnement quota est solide, mais la sortie strictement schema-first devient fragile si le prompt est trop serre.
- Ce test valide la synthese sur des sorties helper bornees, pas la mesure live du delta tokens Codex de cette conversation.
- La capacite reste subordonnee a Codex pour la verification finale et l'integration repo.

## Prochaine action

Tester une capacite recurrente voisine orientee operations de contenu structure: moderation/classification bornees, traduction FR/EN de notes repo, ou extraction OCR/document sur un artefact non sensible.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour les bilans quota/token et les syntheses de delegation a faible risque. Estimation cumulative apres ce run: **50 pourcent** de couverture des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-08-quota-reporting-context.md`
- `docs/daily-tests/evidence/2026-06-08-quota-reporting-prompt.txt`
- `docs/daily-tests/evidence/2026-06-08-quota-reporting-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-08-quota-reporting-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-08-quota-reporting-expected.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-small-quota-reporting.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-medium35-quota-reporting.json`
- `docs/daily-tests/evidence/2026-06-08-devstral-quota-reporting.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-large-quota-reporting.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-medium35-quota-reporting-retry.json`
- `docs/daily-tests/evidence/2026-06-08-devstral-quota-reporting-retry.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-large-quota-reporting-retry.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-medium35-quota-reference.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-large-quota-reference.json`
- `docs/daily-tests/evidence/2026-06-08-quota-reporting-validation-summary.json`
