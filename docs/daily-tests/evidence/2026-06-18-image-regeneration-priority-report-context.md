# Faits verifies - rapport quotidien 2026-06-18

- Date du run: `2026-06-18`
- Capacite testee: triage multi-images C2R vers priorites de regeneration
- Statut final: `Valide`
- Categorie: classification bornee de feedback post-generation et priorisation de regeneration sous oracle local strict
- Projet reel source: `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`
- Pourquoi c'est utile: dans le flux reel `POST /api/feedback`, Codex doit souvent classer plusieurs rejets d'un meme batch pour choisir quoi regenerer immediatement, quoi corriger d'abord, et quoi garder comme controle visuel

Modeles testes:

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`

Resultats de validation:

- les `4` modeles ont retourne le bon ordre de priorite, les bons buckets, les bonnes actions, et des `prompt_action_en` compatibles avec l'oracle
- tous passent le validateur local `docs/daily-tests/evidence/2026-06-18-validate-image-regeneration-priority.mjs`
- le routage automatique `recommend` et `select-model` a conseille `mistral-small-latest`
- pour la reference appliquee du run, conserver `mistral-small-latest` comme option economique et `mistral-medium-3.5` comme option de synthese plus confortable

Usage tokens des sorties de triage validees:

| Modele | Prompt | Completion | Total |
|---|---:|---:|---:|
| `mistral-small-latest` | 2299 | 545 | 2844 |
| `mistral-medium-3.5` | 2299 | 601 | 2900 |
| `mistral-large-latest` | 2299 | 569 | 2868 |
| `devstral-latest` | 2299 | 549 | 2848 |

Total utile minimal deja retenu avant brouillons documentaires: `11460` tokens.

Contexte/prompt resumes:

- contexte public minimal sur `v6-exact-100` et le flux `POST /api/feedback`
- `4` cas de rejet reel-simules: anatomie/cadrage critique, profondeur/emotion, derive textile+accessoire, et image a garder comme controle
- schema JSON strict avec `task`, `batch_id`, `cases`, `rank`, `priority_bucket`, `next_action`, `keep_for_reference`, `prompt_action_en`, `reason_fr`
- ordre attendu des ids par priorite impose mot pour mot

Commandes de validation a mentionner:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Classer quatre feedbacks de generation image C2R en priorites de regeneration bornees et actions prompt-side compactes, en JSON strict, pour choisir quoi regenerer maintenant, quoi corriger d abord, et quoi garder comme controle."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Classer quatre feedbacks de generation image C2R en priorites de regeneration bornees et actions prompt-side compactes, en JSON strict, pour choisir quoi regenerer maintenant, quoi corriger d abord, et quoi garder comme controle."
node docs/daily-tests/evidence/2026-06-18-validate-image-regeneration-priority.mjs docs/daily-tests/evidence/2026-06-18-mistral-small-latest-image-regeneration-priority.json docs/daily-tests/evidence/2026-06-18-mistral-medium-3.5-image-regeneration-priority.json docs/daily-tests/evidence/2026-06-18-mistral-large-latest-image-regeneration-priority.json docs/daily-tests/evidence/2026-06-18-devstral-latest-image-regeneration-priority.json
npm run validate
npm run check:helper
```

Limitations a mentionner:

- l'oracle valide la priorisation, les buckets, et les actions prompt-side, pas la qualite esthetique finale des images
- le workflow reste borne a un batch court de `4` cas et a un preset connu
- Codex garde la verification locale, l'edition des presets, les relances reelles, et le tri final si plusieurs batches se chevauchent

Prochaine action suggeree:

- tester une capacite voisine de QA recurrente, par exemple le triage multi-batches en fenetres de regeneration ou la conversion d'un rejet en patch borne de preset/negative list

Contribution vers l'objectif des `70` pourcent:

- oui, cette capacite compte vers l'objectif, car elle remplace une partie recurrente du QA manuel dans `05_Generateur image C2R`
- estimation cumulative apres ce run: `84 pourcent`

Contraintes de redaction:

- rediger en francais
- produire un rapport Markdown complet pour `docs/daily-tests/2026-06-18-image-regeneration-priority-triage.md`
- inclure explicitement les rubriques: `Valide`, categorie, pourquoi, modeles testes, resume des prompts et du contexte, usage/tokens, resultat, commandes de validation, limitations, prochaine action, contribution vers l'objectif des 70 pourcent, fichiers de preuve
- ne rien inventer hors des faits ci-dessus
