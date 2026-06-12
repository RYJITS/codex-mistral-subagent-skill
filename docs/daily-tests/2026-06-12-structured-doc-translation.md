# Test quotidien 2026-06-12 - Traduction structuree de doc publique EN vers FR

## Statut

**Valide**

## Categorie de tache

Traduction structuree de note quickstart publique pour repo GitHub, avec preservation stricte des commandes, model ids, variables d'environnement et code ids.

## Pourquoi c'est important pour les projets reels

Dans `D:\00_Cerveau_IA` et ses repos publics, une partie recurrente du travail consiste a transformer des notes, README sections, rapports ou instructions initialement rediges en anglais vers une doc publique en francais. Si Mistral peut faire cette localisation sans casser les chaines operationnelles exactes, Codex gagne du temps sur la publication, la maintenance multi-projets et la documentation utilisateur en francais.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`

## Resume des prompts et du contexte

Premier essai non retenu:

- traduction libre d'une note publique en quatre sections JSON
- contrainte de preservation sur `mistral-subagent`, `MISTRAL_API_KEY`, les trois model ids et deux commandes helper
- resultat: les modeles preservent les litteraux mais recontextualisent trop librement la note

Workflow retenu:

- reduction du corpus a `7` lignes publiques bornees
- schema JSON strict avec `title_fr`, `summary_fr`, `lines[]`, `preserved_literals`
- conservation obligatoire des `7` litteraux operationnels
- verification locale de la presence des litteraux et revue humaine de la fidelite ligne par ligne

## Usage et tokens

Essai libre initial:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 717 | 512 | 1229 | Non retenu, recontextualisation |
| `mistral-medium-3.5` | 717 | 401 | 1118 | Non retenu, note trop libre |
| `mistral-large-latest` | 717 | 607 | 1324 | Non retenu, ajoute du contexte repo |

Essai structure ligne par ligne:

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 519 | 352 | 871 | Non valide, lignes reordonnees |
| `mistral-medium-3.5` | 519 | 394 | 913 | Valide, sortie appliquee |
| `mistral-large-latest` | 519 | 412 | 931 | Valide, bonne alternative |

Tokens Mistral utiles retenus:

- `mistral-medium-3.5`: `913`
- `mistral-large-latest`: `931`

Total utile retenu: `1844` tokens.

## Resultat

Validation positive sous verification Codex.

- Le prompt libre n'est pas assez borne pour une localisation fiable: les modeles gardent les chaines critiques mais inventent du contexte repo annexe.
- Le schema ligne par ligne corrige ce probleme.
- `mistral-medium-3.5` devient le meilleur defaut pour cette capacite: fidelite correcte, cout modere, sortie directement reutilisable.
- `mistral-large-latest` passe aussi la verification et reste utile comme passe de polissage public.
- `mistral-small-latest` n'est pas retenu ici pour une publication directe, car il reordonne le sens du corpus meme en preservant les litteraux.
- La sortie validee a ete appliquee dans [`docs/PUBLIC_REPO_QUICKSTART_FR.md`](D:/00_Cerveau_IA/Projet/codex-mistral-subagent-skill/docs/PUBLIC_REPO_QUICKSTART_FR.md).

## Commandes de validation

Configuration:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Translate a bounded public repo quickstart note from English to French while preserving commands, model ids, and env vars."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Translate a bounded public repo quickstart note from English to French while preserving commands, model ids, and env vars."
```

Delegation retenue:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-12-translation-lines-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-12-translation-lines-context.txt" --model mistral-medium-3.5 --max-tokens 1600 --temperature 0.05 --json
```

Verification locale:

```powershell
Get-Content "docs/daily-tests/evidence/2026-06-12-translation-lines-validation-summary.json" -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
git status --short
```

## Limitations

- La traduction libre d'une note complete reste trop ouverte pour une publication directe sans normalisation supplementaire.
- La verification automatique ne prouve pas seule la fidelite semantique; une revue Codex reste necessaire.
- L'encodage console local peut afficher un texte accentue degrade; les fichiers de repo et les checks litteraux restent la source de verite.

## Prochaine action

Tester une capacite recurrente voisine encore non couverte, par exemple moderation/classification multi-etiquettes sur lot reel ou planification borne de transcription/audio.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme **validee** pour la localisation structuree d'une note publique en francais avec preservation des chaines operationnelles. Estimation cumulative apres ce run: **70 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-12-translation-context.md`
- `docs/daily-tests/evidence/2026-06-12-translation-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-translation-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-translation-lines-context.txt`
- `docs/daily-tests/evidence/2026-06-12-translation-lines-prompt.txt`
- `docs/daily-tests/evidence/2026-06-12-translation-recommend.json`
- `docs/daily-tests/evidence/2026-06-12-translation-select-model.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-small-latest-translation.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-medium-3.5-translation.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-large-latest-translation.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-small-latest-translation-retry.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-medium-3.5-translation-retry.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-large-latest-translation-retry.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-small-latest-translation-lines.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-medium-3.5-translation-lines.json`
- `docs/daily-tests/evidence/2026-06-12-mistral-large-latest-translation-lines.json`
- `docs/daily-tests/evidence/2026-06-12-translation-lines-validation-summary.json`
