# Test quotidien 2026-06-13 - synthese documentaire bornee de projet reel

## Statut

**Partiellement valide**

## Categorie de tache

Synthese documentaire bornee a partir de docs publiques d'un projet reel, avec tentative JSON stricte puis fallback Markdown verifie localement.

## Pourquoi c'est important pour les projets reels

`D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES` fait partie du flux reel de l'utilisateur pour la video IA, `WebGL`, la QA par contact sheet, et la documentation multi-projets. Si Mistral sait condenser rapidement quelques docs publiques en note de mainteneur exploitable, Codex gagne du temps sur l'orientation avant correction, validation, ou publication.

## Projet et capacite testes

- Projet source:
  - `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES`
- Capacite testee:
  - lire un corpus public borne;
  - retenir l'ordre de lecture et les checks locaux utiles;
  - resumer le routage `Wan` / `LTX` / `WebGL`;
  - produire une note de mainteneur reutilisable pour le skill `mistral-subagent`.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`
- `devstral-latest`
- retries stricts sur `mistral-medium-3.5` et `mistral-large-latest`
- brouillon de reference sur `mistral-medium-3.5` et `mistral-large-latest`
- brouillon de rapport sur `mistral-medium-3.5`

## Resume des prompts et du contexte

- Corpus transmis:
  - `README.md`
  - `docs/PROJECT_MAP.md`
  - `docs/QUICK_DECISION_GUIDE.md`
  - `docs/LOCAL_VALIDATION.md`
- Premier passage:
  - demander un JSON strict avec ordre de lecture, routage techno, checks pre-PR, litteraux exacts, et brouillon Markdown inclus
- Retry:
  - fermer encore plus le schema JSON
  - imposer les tableaux et litteraux exacts
- Passe retenue:
  - demander directement une reference Markdown francaise ASCII pour les futurs runs
  - accepter le Markdown direct comme sortie principale apres constat de derive schema-first

## Usage et tokens

| Sortie retenue ou utilisee | Total tokens | Observation |
|---|---:|---|
| `mistral-small-latest` synthese initiale | 1077 | faits retenus, schema derive |
| `mistral-medium-3.5` synthese initiale | 1010 | meilleure base factuelle concise |
| `devstral-latest` synthese initiale | 1041 | bonne formulation repo-aware |
| `mistral-medium-3.5` reference Markdown | 1285 | brouillon applique apres normalisation Codex |
| `mistral-medium-3.5` rapport quotidien | 2107 | brouillon applique apres normalisation Codex |

Tokens Mistral utiles retenus pour ce run: `6520`.

Sorties non retenues comme valides:

- `mistral-large-latest` synthese initiale
- `mistral-medium-3.5` retry
- `mistral-large-latest` retry
- `mistral-large-latest` reference
- heuristique `recommend`, informative mais non comptee comme sortie Mistral appliquee

## Resultat

Validation partielle.

- Aucun modele n'a respecte le contrat JSON strict de bout en bout.
- `mistral-small-latest`, `mistral-medium-3.5`, et `devstral-latest` ont toutefois bien retenu les faits utiles du corpus.
- Le meilleur flux applique ici est donc:
  - Mistral pour condenser les faits d'un petit corpus public;
  - Codex pour verifier;
  - puis Mistral a nouveau pour rediger la reference Markdown finale.
- `mistral-medium-3.5` devient le meilleur defaut retenu pour cette capacite.
- Sortie appliquee:
  - `mistral-subagent/references/project-doc-synthesis-fr.md`

Conclusion de travail:

- oui pour une note de mainteneur courte et bornee
- non pour un contrat JSON strict considere comme fiable sur cette tache

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Generate a bounded French maintainer note for AI_VIDEO_WEBGL_COMPETENCES from public project docs while preserving exact file names, commands, and validation checks."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Generate a bounded French maintainer note for AI_VIDEO_WEBGL_COMPETENCES from public project docs while preserving exact file names, commands, and validation checks."
```

Verification locale:

```powershell
Get-Content docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-validation-summary.json -Raw | ConvertFrom-Json
npm run validate
npm run check:helper
```

## Limitations

- Le schema JSON a derive meme avec un retry plus ferme.
- `mistral-large-latest` n'a pas apporte un gain suffisant ici pour justifier son cout sur ce flux.
- Ce test valide une note courte basee sur `4` docs publiques, pas une generation documentaire longue ou multi-fichiers.

## Prochaine action

Tester une capacite recurrente differente avec oracle plus net, par exemple une classification bornee ou une planification compacte qui ne depend pas d'une longue structure Markdown.

## Contribution vers l'objectif 70 pourcent

Oui, mais partiellement. Cette capacite ajoute une brique utile pour l'orientation documentaire de projet reel, sans valider un workflow JSON structure complet. Estimation cumulative apres ce run: **76 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-context.md`
- `docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-recommend.json`
- `docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-select-model.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-small-project-doc-synthesis.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium35-project-doc-synthesis.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-project-doc-synthesis.json`
- `docs/daily-tests/evidence/2026-06-13-devstral-project-doc-synthesis.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium35-project-doc-synthesis-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-project-doc-synthesis-retry.json`
- `docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-13-project-doc-reference-context.md`
- `docs/daily-tests/evidence/2026-06-13-project-doc-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium35-project-doc-reference.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-project-doc-reference.json`
- `docs/daily-tests/evidence/2026-06-13-project-doc-report-context.md`
- `docs/daily-tests/evidence/2026-06-13-project-doc-report-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium35-project-doc-report.json`
