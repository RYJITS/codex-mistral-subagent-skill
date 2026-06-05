# Test quotidien 2026-06-05 - extraction JSON stricte de brief de maintenance repo

## Statut

**Valide**

## Categorie de tache

Extraction JSON stricte, normalisation de brief, generation de reference skill, et routage modele verifiable.

## Pourquoi c'est important pour les projets reels

Les automations et projets de `D:\00_Cerveau_IA` manipulent souvent des briefs melanges: demande utilisateur, contraintes repo, commandes autorisees, et cible documentaire. Si Mistral sait convertir ce melange en JSON ferme sans halluciner les commandes, Codex peut deleguer une partie recurrente du cadrage avant integration locale.

## Modeles testes

- `mistral-small-latest`
- `mistral-small-latest` avec retry plus contraint
- `mistral-medium-3.5`
- `devstral-latest`
- `codestral-latest`

## Resume des prompts et du contexte

- Contexte transmis: brief texte borne dans `docs/daily-tests/evidence/2026-06-05-json-extraction-context.txt`, sans secret, avec schema JSON exact, commandes reelles du depot, chemin cible literal, et objectif de reference francaise.
- Prompt principal: demander un plan JSON strict pour une reference de maintenance repo, sans commande inventee, avec `target_file` exact et `reference_markdown_fr` en francais.
- Prompt de retry pour `mistral-small-latest`: meme schema, mais `reference_markdown_fr` compacte, deux limitations maximum, et consigne de concision forte pour eviter une troncature.

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 684 | 1200 | 1884 | `finish_reason=length`, JSON interne tronque, rejete |
| `mistral-small-latest` retry | 709 | 487 | 1196 | JSON valide, schema complet, sortie directement exploitable |
| `mistral-medium-3.5` | 684 | 987 | 1671 | JSON valide, meilleure base pour la reference |
| `devstral-latest` | 684 | 747 | 1431 | JSON valide, bon controle repo, non applique tel quel |
| `codestral-latest` | 684 | 692 | 1376 | JSON valide, plus compact, non applique tel quel |

Tokens Mistral utiles retenus pour ce run:

- `mistral-medium-3.5`: sortie directement utilisee pour la structure et le contenu de la nouvelle reference.
- `mistral-small-latest` retry: sortie directement utilisee pour la version compacte du mini prompt et la contrainte de concision.

Total utile retenu: `2867` tokens totaux interroges sur les sorties appliquees (`1671 + 1196`).

## Resultat

Validation positive.

- Trois modeles sur quatre ont respecte le schema complet au premier essai: `mistral-medium-3.5`, `devstral-latest`, et `codestral-latest`.
- `mistral-small-latest` a echoue sur le payload large, puis a reussi des que le champ `reference_markdown_fr` a ete compacte.
- La capacite est donc delegable si Codex fige le schema, les commandes visibles, le chemin cible, et adapte la taille du payload au modele.
- Sorties Mistral directement integrees:
  - structure de la reference `json-extraction-maintenance-fr.md`
  - routage `small` / `medium-3.5` / `devstral`
  - rappel explicite de rejet des commandes non visibles dans le repo
  - consigne de compaction pour `mistral-small-latest`

## Commandes de validation

Appels Mistral:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt principal>" --context-file "docs/daily-tests/evidence/2026-06-05-json-extraction-context.txt" --model mistral-small-latest --max-tokens 1200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt principal>" --context-file "docs/daily-tests/evidence/2026-06-05-json-extraction-context.txt" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt principal>" --context-file "docs/daily-tests/evidence/2026-06-05-json-extraction-context.txt" --model devstral-latest --max-tokens 1200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt principal>" --context-file "docs/daily-tests/evidence/2026-06-05-json-extraction-context.txt" --model codestral-latest --max-tokens 1200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task "<prompt compact>" --context-file "docs/daily-tests/evidence/2026-06-05-json-extraction-context.txt" --model mistral-small-latest --max-tokens 700 --temperature 0.1 --json
```

Verification locale de format:

```powershell
Get-Content <result.json> -Raw | ConvertFrom-Json
($outer.text | ConvertFrom-Json).validation_commands
```

Verification repo apres integration:

```powershell
npm run validate
npm run check:helper
git status --short
```

## Limitations

- `mistral-small-latest` n'est pas fiable sur un payload trop long avec un gros champ Markdown.
- Une sortie JSON valide ne suffit pas: Codex doit encore verifier les commandes, le chemin cible, et l'usage reel du contenu.
- `devstral-latest` et `codestral-latest` etaient corrects mais pas meilleurs que `mistral-medium-3.5` pour la reference utilisateur en francais.

## Prochaine action

Tester une capacite voisine egalement verifiable: classification/moderation de taches ou extraction d'actions en JSON a partir d'un diff ou d'un lot de commentaires.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour une brique recurrente de normalisation de briefs et de preparation d'artefacts multi-projets. Estimation cumulative apres ce run: **25 pourcent** de couverture des taches recurrentes delegables visees.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-05-json-extraction-context.txt`
- `docs/daily-tests/evidence/2026-06-05-mistral-small-json-extraction.json`
- `docs/daily-tests/evidence/2026-06-05-mistral-small-json-extraction-retry.json`
- `docs/daily-tests/evidence/2026-06-05-mistral-medium-3.5-json-extraction.json`
- `docs/daily-tests/evidence/2026-06-05-devstral-json-extraction.json`
- `docs/daily-tests/evidence/2026-06-05-codestral-json-extraction.json`
