# Test quotidien 2026-06-13 - segmentation de captions FR pour Remotion a partir d'un transcript valide

## Statut

**Non valide**

## Categorie de tache

Segmentation texte d'un transcript FR deja valide en `7` captions courtes pour un rendu Remotion/WebGL, avec verification locale contre un oracle captions existant.

## Pourquoi c'est important pour les projets reels

Les projets video de `D:\00_Cerveau_IA` utilisent deja des voix off, des captions, et des rendus courts dans Remotion, WebGL, et LTX. Si Mistral sait decouper un transcript en captions lisibles sans casser le rythme de lecture, Codex peut lui deleguer une premiere passe recurrente de sous-titrage avant l'integration locale dans les jobs video.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - prendre un transcript FR deja valide;
  - produire exactement `7` captions texte en JSON strict;
  - conserver exactement l'ordre des mots;
  - rester lisible pour l'ecran court;
  - approcher le style de segmentation du job Remotion oracle.
- Artefacts reels:
  - oracle captions: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion\jobs\job-site-presentation-30s-v4-tiktok-captions.json`
  - transcript valide source: `docs/daily-tests/evidence/2026-06-12-voxtral-mini-transcription-fr-bias-retry.json`

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`

Modele de brouillon documentaire utilise puis verifie par Codex:

- `mistral-medium-3.5` pour structurer le rapport d'echec FR

## Resume des prompts et du contexte

Workflow principal:

- transcript borne d'une voix off FR de projet deja valide le `2026-06-12`
- demande de JSON strict avec `7` captions, sans reformulation, en gardant l'ordre exact des mots
- comparaison locale contre l'oracle captions du job Remotion

Retry cible:

- meme transcript et meme schema JSON
- ajout de contraintes de lisibilite (`25` a `80` caracteres, eviter les micro-captions et une derniere caption trop longue)

Observation utile:

- le helper `recommend` et `select-model` ont route cette tache vers `voxtral-mini-latest`, signe que l'heuristique actuelle sur-pondere les mots-clefs audio meme quand l'audio a deja ete transcrit et que la tache restante est purement textuelle

## Usage et tokens

Runs de segmentation:

| Run | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 530 | 185 | 715 | Non valide |
| `mistral-medium-3.5` | 530 | 188 | 718 | Non valide |
| `mistral-large-latest` | 530 | 232 | 762 | Non valide |
| `mistral-medium-3.5` retry | 530 | 188 | 718 | Non valide |
| `mistral-large-latest` retry | 530 | 232 | 762 | Non valide |

Brouillon de rapport retenu:

| Run | Prompt | Completion | Total | Usage |
|---|---:|---:|---:|---|
| `mistral-medium-3.5` brouillon rapport | 1046 | 662 | 1708 | Brouillon FR utile, verifie puis resserre par Codex |

Tokens Mistral utiles retenus pour la capacite testee aujourd'hui: `0`.

Tokens Mistral utiles retenus pour la documentation du run: `1708`.

## Resultat

Validation negative sous verification Codex.

- `mistral-small-latest` ne preserve pas correctement la sequence normalisee du transcript et degrade aussi la lisibilite avec une derniere caption tres longue.
- `mistral-medium-3.5` et `mistral-large-latest` preservent bien le transcript complet, mais ratent le style de segmentation attendu:
  - `1/7` caption seulement correspond exactement a l'oracle;
  - `1` frontiere de caption sur `6` correspond a l'oracle;
  - la derniere caption reste trop longue (`119` caracteres) sur les deux runs;
  - le retry de prompt ne modifie pas la sortie, ce qui suggere un comportement tres stable mais mal calibre pour cette tache.

Sorties Mistral directement utilisees:

- les sorties JSON de segmentation comme preuves negatives verifiees localement;
- le brouillon FR `mistral-medium-3.5` pour structurer le rapport quotidien, ensuite normalise par Codex.

Sorties non retenues comme validees pour la capacite:

- tous les runs de segmentation, car aucun ne produit un decoupage suffisamment proche et lisible pour etre applique directement dans le job Remotion.

## Commandes de validation

Configuration et routage:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs check
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs recommend --task "Transformer un transcript valide de voix off FR en 7 captions texte courtes pour Remotion, en JSON strict, sans reformulation et en conservant exactement l ordre des mots."
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs select-model --task "Transformer un transcript valide de voix off FR en 7 captions texte courtes pour Remotion, en JSON strict, sans reformulation et en conservant exactement l ordre des mots."
```

Delegation:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-13-caption-segmentation-prompt.txt" -Raw
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-13-caption-segmentation-context.md" --model mistral-medium-3.5 --max-tokens 1400 --temperature 0.05 --json
```

Verification locale:

```powershell
node docs/daily-tests/evidence/2026-06-13-validate-caption-segmentation.mjs "docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-caption-segmentation.json" "docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-caption-segmentation-validation.json"
Get-Content "docs/daily-tests/evidence/2026-06-13-caption-segmentation-validation-summary.json" -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
```

## Limitations

- plusieurs segmentations textuelles peuvent etre raisonnables; l'oracle projet reste ici volontairement strict pour mesurer une reutilisation directe
- le helper public route mal cette tache vers l'audio si le libelle mentionne trop fortement la voix off
- le retry de prompt n'a pas change la structure des sorties medium et large, ce qui limite la capacite de rattrapage par simple prompt tuning
- ce test ne couvre pas un workflow hybride ou Codex reapplique ensuite un reflow deterministe des captions

## Prochaine action

Tester un workflow hybride plus robuste: demander a Mistral un marquage de frontieres candidates ou de groupes semantiques, puis laisser Codex reequilibrer localement les longueurs et la derniere caption avec une passe deterministe.

## Contribution vers l'objectif 70 pourcent

Non. Cette capacite ne compte pas comme **validee** pour l'instant. Estimation cumulative apres ce run: **74 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-13-caption-segmentation-context.md`
- `docs/daily-tests/evidence/2026-06-13-caption-segmentation-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-caption-segmentation-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-caption-segmentation-recommend.json`
- `docs/daily-tests/evidence/2026-06-13-caption-segmentation-select-model.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-small-caption-segmentation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-small-caption-segmentation-validation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-caption-segmentation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-caption-segmentation-validation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-caption-segmentation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-caption-segmentation-validation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-caption-segmentation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-caption-segmentation-retry-validation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-caption-segmentation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-caption-segmentation-retry-validation.json`
- `docs/daily-tests/evidence/2026-06-13-caption-segmentation-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-13-caption-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-caption-report-draft.json`
- `docs/daily-tests/evidence/2026-06-13-validate-caption-segmentation.mjs`
