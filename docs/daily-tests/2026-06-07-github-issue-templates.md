# Test quotidien 2026-06-07 - generation de templates GitHub d'issue

## Statut

**Partiellement valide**

## Categorie de tache

Generation et amelioration bornees de templates GitHub d'issue pour un repo public de skill Codex/Mistral.

## Pourquoi c'est important pour les projets reels

Les repos publics du cerveau central IA demandent souvent des templates d'issue, de PR, de docs, et d'autres artefacts GitHub repetitifs. Si Mistral peut produire une premiere passe directement integrable pour ces formulaires, Codex peut deleguer une partie recurrente de la maintenance communautaire a faible risque.

## Projet et capacite testes

- Projet source:
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - ameliorer `.github/ISSUE_TEMPLATE/bug_report.yml`
  - ameliorer `.github/ISSUE_TEMPLATE/feature_request.yml`
  - proposer un `.github/ISSUE_TEMPLATE/config.yml` minimal

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`
- retries stricts sur `mistral-small-latest` et `mistral-large-latest`

## Resume des prompts et du contexte

- Contexte transmis:
  - contenu actuel des deux issue forms et du template de PR
  - contraintes repo verifiees par Codex:
    - aucun nouveau script, package, workflow, ou URL non prouvee
    - labels `bug` et `enhancement` a conserver
    - sortie publique en francais
    - validation limitee a `npm run validate`, `npm run check:helper`, et verifications locales simples
- Prompt principal:
  - demander un JSON strict avec exactement `3` fichiers
  - forcer les chemins cibles
  - demander du YAML GitHub plausible sous forme de chaines completes
- Prompt de retry:
  - interdire explicitement `contact_links`, URLs, et `issue_templates`
  - imposer `config.yml` minimal
  - rappeler que `content` doit rester une chaine, jamais un objet JSON

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1437 | 1827 | 3264 | Bons champs, mais `config.yml` invente des URLs |
| `mistral-medium-3.5` | 1437 | 1941 | 3378 | Bonne structure, mais `content` rendu comme objet JSON |
| `devstral-latest` | 1437 | 1273 | 2710 | Bon cadrage repo, mais wiki/discussions inventes |
| `mistral-large-latest` | 1437 | 1845 | 3282 | Bonne qualite publique, mais URL non prouvee et `content` en objet |
| `mistral-small-latest` retry | 1319 | 1430 | 2749 | Champs utiles, mais `config.yml` reste hors consigne |
| `mistral-large-latest` retry | 1319 | 1299 | 2618 | Meilleure base appliquee, mais `contact_links` persiste |

Tokens Mistral utiles retenus pour ce run:

- `mistral-small-latest` retry: `2749`
- `mistral-large-latest` retry: `2618`

Total utile retenu: `5367` tokens.

Sorties exclues du comptage utile:

- tous les premiers passages avec URLs inventees ou `content` non conforme
- `devstral-latest`, car `config.yml` suppose des canaux non prouves
- `mistral-medium-3.5`, car le schema rendu n'etait pas directement applicable

## Resultat

Validation partielle.

- Les modeles ont bien aide a franciser les forms et a proposer de meilleurs champs pour:
  - le contexte d'usage
  - les commandes executees
  - le comportement attendu
  - l'impact attendu d'une demande de fonctionnalite
- Aucun modele n'a respecte completement les garde-fous sur `config.yml`:
  - URLs inventees
  - `contact_links` non demandes
  - ou `content` rendu comme objet JSON au lieu d'une chaine
- Codex a tout de meme retenu les sorties `retry` de `mistral-small-latest` et `mistral-large-latest` comme base utile, puis a normalise localement:
  - la syntaxe GitHub issue forms autour de `name`, `description`, et `body`
  - la suppression de tout lien ou canal non prouve
  - le `config.yml` minimal a `blank_issues_enabled: false`

Conclusion de travail:

- oui pour une premiere passe de contenu et de structure
- non pour une integration aveugle du fichier de configuration ou du schema final

## Commandes de validation

Appels Mistral:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-07-issue-template-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-issue-template-context.md" --model mistral-small-latest --max-tokens 2200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-issue-template-context.md" --model mistral-medium-3.5 --max-tokens 2200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-issue-template-context.md" --model devstral-latest --max-tokens 2200 --temperature 0.1 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-issue-template-context.md" --model mistral-large-latest --max-tokens 2200 --temperature 0.1 --json
```

Retry strict:

```powershell
$prompt = Get-Content docs/daily-tests/evidence/2026-06-07-issue-template-retry-prompt.txt -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-issue-template-context.md" --model mistral-small-latest --max-tokens 2200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-07-issue-template-context.md" --model mistral-large-latest --max-tokens 2200 --temperature 0.05 --json
```

Verification locale:

```powershell
npm run validate
npm run check:helper
git diff -- .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/feature_request.yml .github/ISSUE_TEMPLATE/config.yml
```

## Limitations

- Les modeles ont encore tendance a inventer des liens de documentation ou de discussion si le prompt mentionne un `config.yml`.
- Le respect du schema strict reste fragile, surtout sur le type de `content`.
- Le repo impose aussi une discipline supplementaire:
  - JSON de preuve parseable sans BOM
  - ASCII strict dans tout le repo, y compris les artefacts `evidence`
- Cette capacite reste donc utile sous verification Codex, mais pas autonome.

## Prochaine action

Tester une capacite voisine plus mecanique sur du feedback GitHub: triage strict de commentaires/reviews vers actions JSON `apply_now`, `needs_human`, ou `reject`.

## Contribution vers l'objectif 70 pourcent

Oui, partiellement. Cette capacite ajoute une brique utile de redaction GitHub, mais elle ne compte pas encore comme delegation fiable de bout en bout. Estimation cumulative apres ce run: **40 pourcent** de couverture delegable vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-07-project-scan-issue-templates.json`
- `docs/daily-tests/evidence/2026-06-07-issue-template-context.md`
- `docs/daily-tests/evidence/2026-06-07-issue-template-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-issue-template-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-07-mistral-small-issue-templates.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-medium35-issue-templates.json`
- `docs/daily-tests/evidence/2026-06-07-devstral-issue-templates.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-large-issue-templates.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-small-issue-templates-retry.json`
- `docs/daily-tests/evidence/2026-06-07-mistral-large-issue-templates-retry.json`
- `docs/daily-tests/evidence/2026-06-07-issue-template-validation-summary.json`
