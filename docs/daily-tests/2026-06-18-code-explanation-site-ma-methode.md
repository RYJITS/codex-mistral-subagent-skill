# Test quotidien 2026-06-18 - explication d architecture bornee pour `01_SITE_MA_METHODE`

## Statut

**Partiellement valide**

## Categorie de tache

Explication de code et onboarding d architecture frontend a partir d un sous-ensemble de fichiers borne, avec sortie JSON stricte et resume FR relu par Codex.

## Pourquoi c est important pour les projets reels

Les projets de `D:\00_Cerveau_IA` demandent souvent une reprise rapide d un module existant avant correction, audit, ou publication. Si Mistral peut expliquer de facon fiable comment un projet demarre, charge ses modules, et branche ses donnees, Codex peut deleguer une partie recurrente de l onboarding technique sans lui laisser l edition locale, les tests, ou Git.

## Projet et capacite testes

- Projet source: `D:\00_Cerveau_IA\Projet\01_SITE_MA_METHODE`
- Sous-ensemble autorise:
  - `index.html`
  - `src/main.js`
  - `src/contact-scene.js`
  - `src/project-registry.js`
- Capacite testee:
  - identifier les points d entree exacts
  - resumer le boot sequence sans inventer
  - reconnaitre les imports dynamiques `contact-scene.js` et `project-registry.js`
  - decrire le role du registre projets et de l API WebGL contact
  - produire un resume FR utile pour un nouvel operateur Codex

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `codestral-latest`
- `devstral-latest`

Routage observe:

- `recommend` juge la tache delegable avec un bon niveau de confiance
- `select-model` propose `devstral-latest` par reflexe repo-aware, mais ce n est pas le meilleur resultat retenu sur ce cas

## Resume des prompts et du contexte

- Contexte transmis:
  - 4 fichiers autorises et rien d autre
  - points d entree `index.html`, `src/styles.css`, `src/main.js`
  - fonctions de boot explicitement listees
  - imports dynamiques et triggers connus
  - API retournee par `initContactScene(...)`
  - role du fichier genere `project-registry.js`
- Prompt:
  - JSON strict impose
  - 5 items de boot maximum choisis dans une liste fermee
  - 2 modules lazy exacts
  - `summary_fr` borne entre `55` et `110` mots
  - interdiction d inventer un framework ou des fichiers hors scope

## Usage et tokens

| Run | Prompt tokens | Completion tokens | Total tokens | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1452 | 368 | 1820 | Retenu |
| `mistral-medium-3.5` | 1452 | 356 | 1808 | Rejete, resume trop court |
| `codestral-latest` | 1452 | 417 | 1869 | Rejete, resume sans litteral `boot` |
| `devstral-latest` | 1452 | 374 | 1826 | Rejete, role/trigger trop derives en anglais |

Tokens Mistral directement retenus pour cette capacite: `368` tokens de completion sur `mistral-small-latest`.

## Resultat

Verdict partiel sous verification Codex.

- `mistral-small-latest` a passe l oracle local du premier coup.
- La sortie retenue donne les bons points d entree, les deux imports dynamiques exacts, la bonne API `contact-scene`, et un resume FR exploitable pour une note de reference.
- `mistral-medium-3.5`, `codestral-latest`, et `devstral-latest` sont restes proches semantiquement mais ont casse au moins une contrainte stricte:
  - resume trop court
  - absence du signal `boot` dans le resume
  - glissement de formulation anglais/francais sur le registre projets
- Cette capacite est donc utile et applicable, mais seulement avec un cadrage schema-first serre et une preference claire pour `mistral-small-latest` sur ce cas.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Expliquer a un nouvel operateur Codex l architecture de 01_SITE_MA_METHODE a partir de 4 fichiers, avec faits exacts, imports dynamiques, role du registre projets, et resume FR borne en JSON strict."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Expliquer a un nouvel operateur Codex l architecture de 01_SITE_MA_METHODE a partir de 4 fichiers, avec faits exacts, imports dynamiques, role du registre projets, et resume FR borne en JSON strict."
```

Validation locale:

```powershell
node docs/daily-tests/evidence/2026-06-18-validate-code-explanation.mjs docs/daily-tests/evidence/2026-06-18-mistral-small-code-explanation.parsed.json docs/daily-tests/evidence/2026-06-18-code-explanation-expected.json
node docs/daily-tests/evidence/2026-06-18-validate-code-explanation.mjs docs/daily-tests/evidence/2026-06-18-mistral-medium35-code-explanation.parsed.json docs/daily-tests/evidence/2026-06-18-code-explanation-expected.json
node docs/daily-tests/evidence/2026-06-18-validate-code-explanation.mjs docs/daily-tests/evidence/2026-06-18-codestral-code-explanation.parsed.json docs/daily-tests/evidence/2026-06-18-code-explanation-expected.json
node docs/daily-tests/evidence/2026-06-18-validate-code-explanation.mjs docs/daily-tests/evidence/2026-06-18-devstral-code-explanation.parsed.json docs/daily-tests/evidence/2026-06-18-code-explanation-expected.json
npm run validate
npm run check:helper
```

## Limitations

- La capacite depend fortement d un schema compact et d un contexte deja pre-filtre par Codex.
- Les modeles plus riches n ont pas ete plus fiables que `mistral-small-latest` sur ce cas.
- Le flux teste ici explique une architecture bornee; il ne faut pas l etendre tel quel a un gros repo multi-dossiers.
- Codex garde la verification finale des faits, des chemins, et de l absence d invention.

## Prochaine action

Retester cette famille sur un second projet borne, puis mesurer si un format en deux temps `facts JSON` puis `resume FR` ameliore la robustesse de `codestral-latest` et `devstral-latest`.

## Contribution vers l objectif 70 pourcent

Oui, partiellement.

Cette capacite compte comme delegation utile seulement dans un sous-cas borne et avec un routage explicite vers `mistral-small-latest`. L estimation cumulative passe donc de `82 %` a **83 %** de couverture utile des taches recurrentes delegables observees dans le lab.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-18-code-explanation-context.md`
- `docs/daily-tests/evidence/2026-06-18-code-explanation-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-code-explanation-expected.json`
- `docs/daily-tests/evidence/2026-06-18-code-explanation-recommend.json`
- `docs/daily-tests/evidence/2026-06-18-code-explanation-select-model.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-code-explanation.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium35-code-explanation.json`
- `docs/daily-tests/evidence/2026-06-18-codestral-code-explanation.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-code-explanation.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-code-explanation.validation.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium35-code-explanation.validation.json`
- `docs/daily-tests/evidence/2026-06-18-codestral-code-explanation.validation.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-code-explanation.validation.json`
- `docs/daily-tests/evidence/2026-06-18-validate-code-explanation.mjs`
