# Test quotidien 2026-06-09 - planification RAG/embeddings multi-projets

## Statut

**Valide**

## Categorie de tache

Planification RAG/embeddings multi-projets avec sortie JSON stricte pour definir collections, exclusions, chunking, metadonnees, triggers de refresh et validation locale.

## Pourquoi c'est important pour les projets reels

Le cerveau central `D:\00_Cerveau_IA` repose sur `Conpetances`, `Instructions`, `Memoire` et plusieurs projets publics/prives. Une grande partie des taches recurrentes de Codex consiste a retrouver vite le bon contexte, separer le global du projet, et preparer une indexation compatible multi-projets sans exposer `API\env.Local`. Si Mistral peut produire ce plan de preparation de facon fiable, Codex gagne du temps sur tous les futurs travaux de retrieval, memoire et routage.

## Projet et capacite testes

- Projets source:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - proposer un plan JSON FR de preparation RAG/embeddings
  - couvrir `Conpetances`, `Instructions`, `Memoire`, et le repo `codex-mistral-subagent-skill`
  - exclure explicitement `D:\00_Cerveau_IA\API\env.Local`
  - rester compatible multi-projets
  - mentionner `npm run memoire:update` comme trigger de refresh

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`

Note de routage observee:

- `select-model` du helper a recommande `mistral-embed` pour une tache contenant `RAG` et `embeddings`
- pour la planification elle-meme, les sorties utiles ont ete obtenues via des modeles de chat, pas via l'endpoint embeddings

## Resume des prompts et du contexte

- Contexte borne transmis:
  - structure obligatoire `Conpetances`, `Instructions`, `Memoire`, `API\env.Local`
  - regles AGENTS sur memoire user/projet et regeneration des index
  - commandes reelles depuis `D:\00_Cerveau_IA\Conpetances`, surtout `npm run memoire:update`
  - contenu utile du repo public `codex-mistral-subagent-skill`
- Prompt principal:
  - schema JSON strict avec `collections`, `exclusions`, `chunking_policy`, `metadata_schema`, `refresh_triggers`, `validation_checks`
  - interdiction d'inventer scripts, chemins, commandes ou infra
- Retry compact:
  - meme schema
  - nombre d'elements reduit pour eviter la troncature

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1582 | 1800 | 3382 | troncature, JSON interne non parseable |
| `mistral-medium-3.5` | 1582 | 1800 | 3382 | troncature, JSON interne non parseable |
| `devstral-latest` | 1582 | 1400 | 2982 | JSON complet et directement exploitable |
| `mistral-large-latest` | 1582 | 1800 | 3382 | troncature, JSON interne non parseable |
| `mistral-medium-3.5` retry compact | 1487 | 861 | 2348 | JSON complet, utile apres compression |
| `mistral-large-latest` retry compact | 1487 | 1150 | 2637 | JSON complet, utile comme seconde opinion |
| `mistral-large-latest` brouillon reference | 1315 | 1000 | 2315 | troncature, non retenu |
| `mistral-medium-3.5` reference compacte | 1254 | 148 | 1402 | brouillon direct utilise pour la reference FR |

Tokens Mistral utiles retenus pour ce run:

- `devstral-latest`: `2982`
- `mistral-medium-3.5` retry compact: `2348`
- `mistral-large-latest` retry compact: `2637`
- `mistral-medium-3.5` reference compacte: `1402`

Total utile retenu: `9369` tokens.

Sorties non comptees comme directement utiles:

- les premieres sorties `mistral-small-latest`, `mistral-medium-3.5`, `mistral-large-latest`, tronquees et non parseables
- le premier brouillon de reference `mistral-large-latest`, egalement tronque

## Resultat

Validation positive sous verification Codex.

- `devstral-latest` a fourni des le premier essai un JSON complet, exact sur les chemins obligatoires et exploitable pour une integration locale.
- `mistral-medium-3.5` et `mistral-large-latest` ont echoue sur le prompt verbeux mais ont reussi sur une version compacte du meme schema.
- les sorties utiles convergent sur les points critiques: collections minimales, exclusion de `env.Local`, metadonnees multi-projets, et refresh via `npm run memoire:update`.
- `mistral-small-latest` n'a pas passe ce test de schema verbeux et n'est pas retenu comme modele fiable pour cette capacite sans forte compression.

Sorties Mistral directement utilisees:

- le plan `devstral-latest` comme base technique
- les plans retry `mistral-medium-3.5` et `mistral-large-latest` comme seconde verification compacte
- le brouillon court `mistral-medium-3.5` pour rediger `mistral-subagent/references/rag-embeddings-planning-fr.md`, ensuite resserre et verifie par Codex

## Commandes de validation

Selection/routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Planification RAG et embeddings multi-projets pour indexer D:\00_Cerveau_IA sans exposer de secret, avec collections, exclusions, chunking, metadata et validation"
```

Prompt principal:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-context.md" --model devstral-latest --max-tokens 1800 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-context.md" --model mistral-small-latest --max-tokens 1800 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-context.md" --model mistral-medium-3.5 --max-tokens 1800 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-context.md" --model mistral-large-latest --max-tokens 1800 --temperature 0.1 --json
```

Retry compact:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-retry-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-context.md" --model mistral-medium-3.5 --max-tokens 1400 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-context.md" --model mistral-large-latest --max-tokens 1400 --temperature 0.05 --json
```

Synthese locale:

```powershell
Get-Content "docs/daily-tests/evidence/2026-06-09-rag-embeddings-validation-summary.json" -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
git status --short
```

## Limitations

- cette validation couvre la planification RAG/embeddings, pas l'execution reelle d'un pipeline d'embeddings
- `mistral-embed` a ete recommande par routage mais non execute ici, car le test porte sur la planification JSON via le helper chat public
- les prompts trop verbeux depassent vite la limite de sortie, surtout sur `mistral-small-latest`
- la qualite est bonne si Codex impose un schema ferme puis un retry compacte si necessaire

## Prochaine action

Tester une capacite voisine plus operationnelle, par exemple OCR/document extraction structuree ou classification/moderation sur lot reel avec oracle de validation net.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour la planification RAG/embeddings multi-projets bornee avant implementation locale par Codex. Estimation cumulative apres ce run: **62 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-context.md`
- `docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-prompt.txt`
- `docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-09-rag-embeddings-planning-expected.json`
- `docs/daily-tests/evidence/2026-06-09-mistral-small-rag-embeddings-planning.json`
- `docs/daily-tests/evidence/2026-06-09-mistral-medium35-rag-embeddings-planning.json`
- `docs/daily-tests/evidence/2026-06-09-devstral-rag-embeddings-planning.json`
- `docs/daily-tests/evidence/2026-06-09-mistral-large-rag-embeddings-planning.json`
- `docs/daily-tests/evidence/2026-06-09-mistral-medium35-rag-embeddings-planning-retry.json`
- `docs/daily-tests/evidence/2026-06-09-mistral-large-rag-embeddings-planning-retry.json`
- `docs/daily-tests/evidence/2026-06-09-rag-embeddings-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-09-rag-embeddings-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-09-rag-embeddings-reference-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-09-mistral-large-rag-embeddings-reference.json`
- `docs/daily-tests/evidence/2026-06-09-mistral-medium35-rag-embeddings-reference-retry.json`
