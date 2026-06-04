# Test quotidien 2026-06-04

## Statut

Valide

## Capacite testee

Planification de prompts et storyboard video pour experiences WebGL scroll-driven.

## Categorie de tache

Prompt drafting, storyboard planning, synthese creative structuree, critique de risques visuels.

## Pourquoi c'est important pour les projets utilisateur

Les projets actifs dans `D:\00_Cerveau_IA\Projet` contiennent plusieurs experiences video/WebGL et storyboardees. Cette capacite est recurrente pour preparer des sequences video generatives, clarifier les transitions, cadrer les overlays texte et reduire les aller-retours de direction artistique avant integration web.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-latest`
- `mistral-large-latest`
- `mistral-small-latest` avec second prompt plus contraint

## Resume des prompts et du contexte

Contexte envoye: projet reel `AI_VIDEO_WEBGL_COMPETENCES_CLEAN`, storyboard source en 9 etapes, contraintes de narration francaise, video 16:9 scroll-driven, texte lateral, ambiance orange/bleue cinematic, exigence JSON stricte, aucune information sensible.

Premier prompt:

- demander un objet JSON complet avec direction globale, `scene_plan`, checklist et verdict
- demander 9 scenes exactes, une par etape
- demander des champs courts et actionnables

Prompt de retry pour `mistral-small-latest`:

- schema JSON reduit
- forte contrainte de concision par champ
- aucune explication hors JSON

## Usage et tokens

| Modele | Prompt tokens | Completion tokens | Total tokens | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 699 | 1800 | 2499 | Tronque, `finish_reason=length`, rejete |
| `mistral-medium-latest` | 699 | 1116 | 1815 | JSON valide, 9 scenes, ids conformes |
| `mistral-large-latest` | 699 | 1707 | 2406 | JSON valide, 9 scenes, ids a normaliser |
| `mistral-small-latest` retry | 581 | 665 | 1246 | JSON valide, 9 scenes, concis et directement exploitable |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-latest`: 1815 total
- `mistral-large-latest`: 2406 total
- `mistral-small-latest` retry: 1246 total

Total utile retenu: `5467` tokens.

## Resultat

Validation positive sous condition de cadrage:

- `mistral-medium-latest` a fourni le meilleur equilibre qualite/coherence/cout pour une premiere passe exploitable.
- `mistral-large-latest` a enrichi la narration et les risques, mais a derive sur le format des ids (`0..8` au lieu de `01..09`).
- `mistral-small-latest` a echoue sur un prompt trop large, puis a reussi nettement apres reduction du schema et contrainte de longueur.

Sorties Mistral directement utilisees:

- structure du `scene_plan`
- formulations de prompts video courtes et actionnables
- liste des risques de lisibilite et surcharge visuelle
- heuristique de routage: `small` pour shot list compacte, `medium` pour plan complet, `large` pour passe de qualite narrative

## Commandes de validation executees

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs models
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt long>" --context-file "<temp-context>" --model mistral-small-latest --max-tokens 1800 --temperature 0.2 --json
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt long>" --context-file "<temp-context>" --model mistral-medium-latest --max-tokens 1800 --temperature 0.2 --json
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt long>" --context-file "<temp-context>" --model mistral-large-latest --max-tokens 1800 --temperature 0.2 --json
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt compact>" --context-file "<temp-context>" --model mistral-small-latest --max-tokens 900 --temperature 0.1 --json
```

Verification locale executee:

```powershell
Get-Content <result.json> -Raw | ConvertFrom-Json
($raw.text | ConvertFrom-Json).scene_plan.Count
```

Verification repo executee apres integration:

```powershell
npm run validate
npm run check:helper
```

## Limitations

- `mistral-small-latest` n'est pas fiable sur un schema trop riche; il faut compacter la sortie attendue.
- `mistral-large-latest` peut produire une meilleure prose mais derive plus facilement sur les contraintes strictes de format.
- aucune validation video/render n'a ete lancee dans le projet source; ce test porte sur la planification textuelle delegable, pas sur le rendu visuel final.

## Prochaine action

Tester la capacite voisine: critique et reecriture de textes UI/UX pour pages video/WebGL en francais, avec comparaison `small` vs `medium`.

## Contribution a l'objectif 70 pour cent

Oui. Cette capacite compte comme validee pour les taches recurrentes de preparation video/storyboard. Estimation apres ce jour: environ `8 %` de couverture validee des taches recurrentes ciblees, soit `62 points` restant pour atteindre l'objectif de `70 %`.
