# Test quotidien 2026-06-08 - filtrage pre-vol avant delegation

## Statut

**Valide**

## Categorie de tache

Classification pre-vol d'un contexte borne avant delegation a Mistral, avec politique metier `allow`, `redact`, `block`, plus signal brut de moderation/PII sur endpoint dedie.

## Pourquoi c'est important pour les projets reels

Cette capacite touche directement tous les projets de `D:\00_Cerveau_IA` qui veulent deleguer une premiere passe a Mistral sans exposer de secret, de chemin local prive, de nom client interne, ou une demande d'autorite interdite. Si Mistral sait faire ce tri initial de facon fiable sur un lot borne, Codex peut lui deleguer plus souvent des resumes, JSON, critiques, ou brouillons tout en gardant la main sur la securite et la validation finale.

## Projet et capacite testes

- Projets source de contexte:
  - `D:\00_Cerveau_IA`
  - `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- Capacite testee:
  - classer `10` extraits en `allow`, `redact`, ou `block`
  - ne jamais laisser passer en `allow` un cas critique de type secret ou autorite interdite
  - comparer les modeles de chat a la moderation dediee `POST /v1/moderations`
  - documenter un workflow FR reutilisable pour les prochains runs

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-moderation-latest`
- `mistral-moderation-2603`

## Resume des prompts et du contexte

- Gold set borne de `10` extraits inspires de flux reels du cerveau central:
  - README/public docs delegables
  - brief de review GitHub sans secret
  - chemins locaux prives a rediger
  - demande interdite sur `D:\00_Cerveau_IA\API\env.Local`
  - ligne synthetique de type `MISTRAL.API_KEY=...`
  - nom client interne a masquer
  - demande de `git push` a bloquer
  - bug local dans `AppData\Local\Temp`
- Prompt principal:
  - imposer un JSON strict avec `items`, `decision`, `reason_fr`, `redaction_targets`, `normalized_excerpt_fr`, et `summary`
  - rappeler la politique `allow`, `redact`, `block`
  - interdire explicitement `allow` pour les cas de secret, `env.Local`, ou autorite interdite
- Moderation dediee:
  - meme lot de `10` extraits envoye a `POST /v1/moderations`
  - comparaison entre l'alias `mistral-moderation-latest` et le modele explicite `mistral-moderation-2603`

## Usage et tokens

| Modele | Prompt | Completion | Total | Observation |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 791 | 354 | 1145 | `10/10` decisions exactes, schema incomplet |
| `mistral-medium-3.5` | 791 | 378 | 1169 | `10/10` decisions exactes, meilleur brouillon public |
| `devstral-latest` | 791 | 407 | 1198 | `10/10` decisions exactes, bon second avis repo |
| `mistral-moderation-latest` | 1107 | 0 | 1198 | capte surtout `S4` et `S5` via `pii=true` |
| `mistral-moderation-2603` | 887 | 0 | 948 | meilleur signal PII sur `S3`, `S4`, `S5`, `S10` |
| `mistral-medium-3.5` brouillon reference | 1655 | 1247 | 2902 | brouillon utile pour la reference FR ajoutee |

Tokens Mistral utiles retenus pour ce run:

- `mistral-small-latest`: `1145`
- `mistral-medium-3.5`: `1169`
- `devstral-latest`: `1198`
- `mistral-medium-3.5` brouillon de reference: `2902`

Total utile retenu: `6414` tokens.

Sorties non comptees comme directement utiles:

- `mistral-moderation-latest` et `mistral-moderation-2603` ne sont pas comptes comme sorties validees autonomes, car ils fournissent des scores/category flags plutot qu'une politique metier `allow`/`redact`/`block` directement applicable.

## Resultat

Validation positive sous verification Codex.

- `mistral-small-latest`, `mistral-medium-3.5`, et `devstral-latest` ont tous atteint `10/10` decisions exactes sur le gold set et `0` faux `allow` sur les cas critiques `S4`, `S5`, et `S8`.
- Les trois modeles ont toutefois sous-rempli le schema demande: pas de `summary`, pas de `redaction_targets` complets, pas de `normalized_excerpt_fr` complet. La capacite est donc validee pour la decision metier, pas pour une autonomie totale de format.
- `mistral-moderation-latest` via `POST /v1/moderations` est reste etroit: il a surtout remonte `S4` et `S5`.
- `mistral-moderation-2603` a donne un meilleur signal PII en remontant `S3`, `S4`, `S5`, et `S10`, mais il n'a pas applique seul la politique complete sur `S7` ni `S8`.
- `mistral-moderation-2603` a aussi refuse `chat/completions` dans ce workflow local avec `Invalid model: mistral-moderation-2603`; il faut donc passer par l'endpoint de moderation dedie au lieu du helper `run`.

Sorties Mistral directement utilisees:

- les decisions `allow`/`redact`/`block` de `mistral-small-latest`, `mistral-medium-3.5`, et `devstral-latest`
- le signal PII compare entre `mistral-moderation-latest` et `mistral-moderation-2603`
- le brouillon `mistral-medium-3.5` pour construire `mistral-subagent/references/preflight-secret-screening-fr.md`, ensuite resserre et verifie par Codex

## Commandes de validation

Appels helper et moderation:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-08-secret-screening-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-secret-screening-context.md" --model mistral-small-latest --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-secret-screening-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.05 --json
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-secret-screening-context.md" --model devstral-latest --max-tokens 1200 --temperature 0.05 --json
```

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs models | Select-String -Pattern 'mistral-moderation-latest|mistral-moderation-2603|mistral-medium-3.5'
```

```powershell
Get-Content "docs/daily-tests/evidence/2026-06-08-secret-screening-validation-summary.json" -Raw | ConvertFrom-Json
```

Validation repo:

```powershell
npm run validate
npm run check:helper
git status --short
```

## Limitations

- le gold set reste borne a `10` extraits; il mesure une capacite recurrente utile, pas toute la politique de securite multi-projets;
- la moderation dediee est un bon signal brut mais ne remplace pas la politique de delegation Codex;
- le helper public ne propose pas encore de commande native pour `POST /v1/moderations`, donc l'appel passe ici par un script inline local;
- les modeles de chat reussissent la decision mais pas encore le schema complet sans normalisation locale.

## Prochaine action

Tester une capacite voisine qui combine encore plus de structure et d'utilite reelle, par exemple OCR/extraction de document borne ou planification RAG/embeddings avec sortie JSON et oracle de validation net.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme validee pour un filtrage pre-vol borne avant delegation de contexte vers Mistral. Estimation cumulative apres ce run: **54 pourcent** de couverture des taches recurrentes delegables vers l'objectif des `70 %`.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-08-secret-screening-context.md`
- `docs/daily-tests/evidence/2026-06-08-secret-screening-prompt.txt`
- `docs/daily-tests/evidence/2026-06-08-secret-screening-expected.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-small-secret-screening.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-medium35-secret-screening.json`
- `docs/daily-tests/evidence/2026-06-08-devstral-secret-screening.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-moderation-secret-screening.json`
- `docs/daily-tests/evidence/2026-06-08-mistral-moderation-2603-secret-screening.json`
- `docs/daily-tests/evidence/2026-06-08-secret-screening-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-08-secret-screening-reference-draft.json`
