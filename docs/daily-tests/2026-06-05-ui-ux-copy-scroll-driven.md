# Test quotidien 2026-06-05

## Statut

Valide

## Capacite testee

Critique et reecriture de textes UI/UX en francais pour une page WebGL/video scroll-driven.

## Categorie de tache

UI/UX text critique, reecriture borne, JSON structure, routage modele, validation locale.

## Pourquoi c'est important pour les projets utilisateur

Les projets actifs dans `D:\00_Cerveau_IA\Projet` contiennent plusieurs experiences WebGL/video avec narration laterale, dont `AI_VIDEO_WEBGL_COMPETENCES_CLEAN`, `CV_WEBGL_SCROLL_VIDEO_SITE` et `CV_WEBGL_STORY_SITE`. La capacite a deleguer une premiere passe de critique copy/UI reduit les aller-retours sur les titres, les blocs de methode et les CTA discrets, tout en gardant Codex sur la verification de ton, de structure et de coherence.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`

## Resume des prompts et du contexte

- Contexte reel envoye: 8 blocs `title/body/foot` extraits de `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES_CLEAN\src\main.js`.
- Cadrage UI/UX ajoute avant delegation via `ui-ux-pro-max`: pattern `Scroll-Triggered Storytelling`, experience sombre, contraste fort, texte rare et lisible.
- Contraintes imposees a Mistral:
  - conserver exactement les `id`;
  - conserver le nombre de lignes du `title` pour chaque bloc;
  - limiter `foot` a 8 mots maximum;
  - eviter les redites autour de `clair`, `rapide`, `solide`;
  - rester sobre, professionnel et sans promesse inventee;
  - retourner un JSON strictement parseable.

## Usage et tokens

| Modele | Prompt tokens | Completion tokens | Total tokens | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1330 | 1193 | 2523 | JSON parseable, mais contrainte structurelle cassee sur `intro` |
| `mistral-medium-3.5` | 1330 | 1430 | 2760 | Premiere passe directement exploitable |
| `mistral-large-latest` | 1330 | 1524 | 2854 | Critique plus riche, mais reecritures plus intrusives |
| `mistral-large-latest` brouillon reference | 326 | 556 | 882 | Brouillon Markdown utile pour la reference finale |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5`: `2760`
- `mistral-large-latest`: `2854`
- `mistral-large-latest` brouillon reference: `882`

Total utile retenu: `6496` tokens.

## Resultat

Validation positive sous conditions claires:

- `mistral-small-latest` a fourni un JSON propre, mais a casse une contrainte essentielle: le titre `intro` devait garder 5 lignes et n'en gardait plus que 2. Sa sortie n'est donc pas comptee comme validee.
- `mistral-medium-3.5` a fourni la meilleure premiere passe exploitable: respect du schema, des ids, des longueurs et du ton attendu.
- `mistral-large-latest` a ajoute une critique plus utile sur les risques UI/UX et le CTA, mais a davantage tendance a reinterpreter la semantique des titres; il est meilleur comme seconde passe qualitative que comme moteur de remplacement direct.
- Sorties Mistral directement utilisees:
  - recommandations de routage `mistral-medium-3.5` puis `mistral-large-latest`;
  - heuristiques de validation locale;
  - brouillon de reference francaise integre dans `mistral-subagent/references/ui-ux-copy-scroll-driven-fr.md`.

## Commandes de validation executees

```powershell
python C:\Users\ysche\.codex\skills\ui-ux-pro-max\scripts\search.py "page WebGL video scroll-driven en francais avec texte lateral et forte lisibilite" --design-system -p "codex-mistral-subagent-skill"
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs check
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs models
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt UI copy>" --context-file "docs/daily-tests/evidence/2026-06-05-ui-ux-copy-context.md" --model mistral-small-latest --max-tokens 2200 --temperature 0.15 --json
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt UI copy>" --context-file "docs/daily-tests/evidence/2026-06-05-ui-ux-copy-context.md" --model "mistral-medium-3.5" --max-tokens 2200 --temperature 0.15 --json
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt UI copy>" --context-file "docs/daily-tests/evidence/2026-06-05-ui-ux-copy-context.md" --model mistral-large-latest --max-tokens 2200 --temperature 0.15 --json
npm run validate
npm run check:helper
```

Verification locale supplementaire executee:

```powershell
$outer = Get-Content -Raw <result.json> | ConvertFrom-Json
$inner = $outer.text | ConvertFrom-Json
@($inner.rewrites).Count
@($inner.rewrites | Where-Object { @($_.title).Count -ne <expected> }).Count
```

## Limitations

- `mistral-small-latest` n'est pas assez fiable si la structure exacte du texte est une contrainte non negociable.
- `mistral-large-latest` peut trop reinterpreter les titres en injectant une semantique plus technique que la source.
- Aucun modele ne comprend seul la synchronisation fine scroll/video; cette partie reste hors delegation et doit etre verifiee dans le projet reel.

## Prochaine action

Tester une capacite voisine non redactionnelle, par exemple OCR/extraction structuree ou classification stricte de documents projet.

## Contribution a l'objectif 70 pour cent

Oui. Cette capacite compte comme validee pour les taches recurrentes de critique et reecriture bornees de textes UI/UX, avec routage `mistral-medium-3.5` en premiere passe et `mistral-large-latest` en seconde passe qualitative. Estimation cumulative apres ce run: environ `23 %` de couverture validee des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-05-ui-ux-copy-context.md`
- `docs/daily-tests/evidence/2026-06-05-small-ui-copy.json`
- `docs/daily-tests/evidence/2026-06-05-medium35-ui-copy.json`
- `docs/daily-tests/evidence/2026-06-05-large-ui-copy.json`
- `docs/daily-tests/evidence/2026-06-05-large-ui-copy-reference-draft.json`
