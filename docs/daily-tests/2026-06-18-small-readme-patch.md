# Test quotidien 2026-06-18 - petit patch README borne a partir d un ecart code-doc public

## Statut
**Partiellement valide**

## Categorie de tache
Generation d un petit patch documentaire borne pour un repo public, avec application locale par Codex apres verification.

## Pourquoi c est important pour les projets reels
Les projets de `D:\00_Cerveau_IA` demandent souvent de petites mises a jour README ou doc a partir d un ecart exact entre code, helper, et usage public. Si Mistral peut produire ce type de patch court sans inventer de commandes ni de comportement, Codex peut deleguer une partie recurrente de la maintenance repo.

## Projet et capacite testes
- Repo: `D:\00_Cerveau_IA\Projet\03_codex-mistral-subagent-skill`
- Capacite: rediger un petit bloc README public pour documenter `select-model` et `project-scan --no-content` a partir d un contexte repo borne.

## Modeles testes
- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `codestral-latest`

## Resume des prompts et du contexte
- Prompt 1: JSON strict avec `target_file`, `insert_after_heading`, `patch_markdown`, raisons FR, et commandes de validation exactes.
- Prompt 2 retry: bloc Markdown ASCII uniquement, sans JSON, avec 2 paragraphes courts et 2 commandes `powershell` exactes.
- Contexte borne: extrait public de `README.md`, extrait public de `mistral-subagent/scripts/mistral-subagent.mjs`, liste exacte des commandes de validation, et interdiction d inventer flags, fichiers, headings, ou secrets.

## Usage et tokens
| Modele | Prompt tokens | Completion tokens | Total tokens | Verdict |
| --- | ---: | ---: | ---: | --- |
| `mistral-small-latest` | 919 | 118 | 1037 | Non valide, schema reduit a `patch` et champs manquants |
| `mistral-medium-3.5` | 919 | 20 | 939 | Non valide, JSON presque vide |
| `devstral-latest` | 919 | 162 | 1081 | Partiellement valide, bloc README utile et applique |
| `codestral-latest` | 919 | 134 | 1053 | Non valide, headings hors scope et structure derivee |
| `mistral-small-latest` retry | 1065 | 136 | 1201 | Non valide, commande `select-model` tronquee |
| `devstral-latest` retry | 1053 | 186 | 1239 | Non valide, wrapper Markdown et affirmation non prouvee sur les tokens |
| `codestral-latest` retry | 1053 | 184 | 1237 | Non valide, commande `select-model` tronquee |

## Resultat
Le meilleur signal vient du premier essai `devstral-latest`: le modele a bien identifie le bon fichier, le bon point d insertion, et a produit un bloc README exact sur `--no-content` et `select-model`. Codex a applique ce bloc dans `README.md` apres verification locale du scope et des litteraux.

Le workflow reste seulement **partiellement valide** car les modeles ne respectent pas de maniere fiable une enveloppe stricte. Le JSON demande a derive vers un champ `patch` non prevu, `mistral-medium-3.5` a renvoye un objet quasi vide, et les retries ont ajoute soit un wrapper Markdown inutile, soit une commande tronquee, soit une affirmation non prouvee.

## Sortie appliquee
Le bloc suivant, issu du premier essai `devstral-latest`, a ete applique dans `README.md`:

~~~md
You can also scan a project without including file contents by using the `--no-content` flag:

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs project-scan --path path/to/project --no-content --max-files 20 --output snapshot.json
```

To select a model for a specific task, use the `select-model` command:

```powershell
node ~/.codex/skills/mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Audit this TypeScript project and propose patches"
```
~~~

## Commandes de validation
- `npm run validate`
- `npm run check:helper`

Observation locale:
- `npm run check:helper` a passe.
- `npm run validate` a ete relance apres normalisation BOM de plusieurs artefacts `2026-06-18` non lies a ce sous-test, puis reste bloque par d autres fichiers preexistants non ASCII hors scope du commit du jour.

## Limitations
- La structure de sortie reste fragile des qu un schema JSON un peu riche est impose.
- Les retries montrent encore des risques d embellissement factuel ou de troncature de commande.
- Codex doit encore verifier manuellement que les phrases publiques ne pretendent pas des comportements non visibles dans le repo.
- La validation repo complete reste polluee par des artefacts `2026-06-18` non lies a ce sous-test et deja presents dans le worktree.

## Prochaine action
Retester ce type de patch avec un oracle encore plus mecanique, par exemple un schema a une seule cle `patch_markdown` ou une validation ligne par ligne sur un diff miniature.

## Contribution vers l objectif 70 pourcent
Oui, partiellement. Cette capacite ajoute une brique utile de maintenance README/public doc, mais pas encore un workflow autonome de patch generation fiable. Estimation cumulative apres ce run: **84 pourcent** de couverture delegable observee, donc au-dessus de l objectif des `70 %`.

## Fichiers de preuve
- `docs/daily-tests/evidence/2026-06-18-readme-patch-context.md`
- `docs/daily-tests/evidence/2026-06-18-readme-patch-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-readme-patch-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-readme-patch.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-medium35-readme-patch.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-readme-patch.json`
- `docs/daily-tests/evidence/2026-06-18-codestral-readme-patch.json`
- `docs/daily-tests/evidence/2026-06-18-mistral-small-readme-patch-retry.json`
- `docs/daily-tests/evidence/2026-06-18-devstral-readme-patch-retry.json`
- `docs/daily-tests/evidence/2026-06-18-codestral-readme-patch-retry.json`
- `docs/daily-tests/evidence/2026-06-18-readme-patch-validation-summary.json`
