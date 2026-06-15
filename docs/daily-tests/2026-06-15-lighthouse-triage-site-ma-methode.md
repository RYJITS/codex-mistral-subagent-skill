# Test quotidien 2026-06-15 - triage Lighthouse multi-support pour 01_SITE_MA_METHODE

## Statut

**Partiellement valide**

## Categorie de tache

Triage structure de rapports Lighthouse desktop/mobile en plan d'action frontend borne pour un projet WebGL/video scroll-driven.

## Pourquoi c'est important pour les projets reels

Le projet reel [`D:\00_Cerveau_IA\Projet\01_SITE_MA_METHODE`](D:/00_Cerveau_IA/Projet/01_SITE_MA_METHODE) accumule des arbitrages recurrents entre rendu cinematic, poids media, chemin critique CSS/fonts, et accessibilite video. Si Mistral sait transformer un lot Lighthouse borne en priorites exploitables, Codex peut accelerer les boucles d'optimisation frontend sans lui deleguer le shell, la verification visuelle, ni la decision finale.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `devstral-latest`
- `mistral-large-latest`

Modele hybride retenu:

- `mistral-medium-3.5` pour remplir la redaction FR d'un squelette d'actions deja borne par Codex

## Resume des prompts et du contexte

Contexte envoye:

- metrics et assets reels extraits de `lighthouse-desktop.json` et `lighthouse-mobile.json`
- contraintes produit du site scroll-driven
- top findings: `total-byte-weight`, `render-blocking-insight`, `unminified-css`, `unminified-javascript`, `unused-css-rules`, `unused-javascript`, `mainthread-work-breakdown`, `video-caption`
- aucune clef ni secret; uniquement chemins et URLs locales publiques du projet

Prompts testes:

- passe 1: schema JSON strict libre, avec `5` `action_key` imposes
- passe 2: retry plus contraint avec mapping explicite `action_key` -> audits/fichiers
- passe 3 hybride: squelette complet fourni par Codex; Mistral ne remplit que `global_assessment_fr`, `why_it_matters_fr`, et `local_check_fr`

## Usage et tokens

| Run | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` passe 1 | 1750 | 1048 | 2798 | Non valide |
| `mistral-medium-3.5` passe 1 | 1750 | 841 | 2591 | Non valide |
| `devstral-latest` passe 1 | 1750 | 539 | 2289 | Non valide |
| `mistral-small-latest` retry | 1867 | 1105 | 2972 | Non valide |
| `mistral-medium-3.5` retry | 1867 | 1050 | 2917 | Non valide |
| `devstral-latest` retry | 1867 | 974 | 2841 | Non valide |
| `mistral-large-latest` retry | 1867 | 1136 | 3003 | Non valide, sortie driftee |
| `mistral-small-latest` squelette | 2266 | 957 | 3223 | Non valide |
| `mistral-medium-3.5` squelette | 2266 | 1139 | 3405 | Partiellement valide, sortie appliquee apres normalisation Codex |
| `mistral-large-latest` squelette | 2266 | 1400 | 3666 | Non valide, `finish_reason=length` |

Tokens Mistral utiles retenus:

- `mistral-medium-3.5` squelette: `3405`

Total utile retenu: `3405` tokens.

## Resultat

Validation partielle sous verification Codex.

- Les modeles comprennent bien les priorites metier du lot Lighthouse: videos trop lourdes, medias hors viewport charges trop tot, textures/images trop lourdes, chemin critique CSS/fonts, puis nettoyage CSS/JS.
- En revanche, la delegation brute schema-first n'est pas fiable sur cette capacite: tous les modeles ont derive sur les `action_key`, les champs, ou la structure attendue, meme apres un retry explicite.
- Le meilleur resultat exploitable vient d'un workflow hybride: Codex fixe d'abord le squelette exact des `5` actions et des fichiers/audits; `mistral-medium-3.5` remplit ensuite une redaction FR utile pour `global_assessment_fr`, `why_it_matters_fr`, et `local_check_fr`.
- Cette sortie hybride a ete directement reutilisee pour la reference [`mistral-subagent/references/lighthouse-triage-fr.md`](D:/00_Cerveau_IA/Projet/03_codex-mistral-subagent-skill/mistral-subagent/references/lighthouse-triage-fr.md) apres normalisation Codex du finding secondaire `video-caption`.
- `recommend` a donne un faux negatif (`suitable: false`, confiance `0.43`) sur la tache brute; `select-model` a route par defaut vers `mistral-small-latest`, trop faible ici sans squelette borne.

## Commandes de validation

Configuration et routage:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Trier un lot Lighthouse desktop/mobile pour un site WebGL scroll-driven et produire un plan d'action JSON strict, priorise, sans inventer de fichiers ni de scripts."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Trier un lot Lighthouse desktop/mobile pour un site WebGL scroll-driven et produire un plan d'action JSON strict, priorise, sans inventer de fichiers ni de scripts."
```

Delegation brute:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-context.md" --model mistral-medium-3.5 --max-tokens 1400 --temperature 0.1 --json
```

Delegation hybride retenue:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-skeleton-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-context.md" --model mistral-medium-3.5 --max-tokens 1400 --temperature 0.1 --json
```

Verification locale:

```powershell
node "docs/daily-tests/evidence/2026-06-15-validate-lighthouse-triage.mjs" "docs/daily-tests/evidence/2026-06-15-lighthouse-triage-expected.json" "docs/daily-tests/evidence/2026-06-15-mistral-small-lighthouse-triage-retry.json" "docs/daily-tests/evidence/2026-06-15-mistral-medium35-lighthouse-triage-retry.json" "docs/daily-tests/evidence/2026-06-15-devstral-lighthouse-triage-retry.json" "docs/daily-tests/evidence/2026-06-15-mistral-large-lighthouse-triage-retry.json"
npm run validate
npm run check:helper
git status --short
```

## Limitations

- La capacite n'est pas validee en bout en bout sur un rapport Lighthouse brut: la taxonomie stricte des actions derive encore trop facilement.
- Le workflow utile exige une pre-structuration Codex des buckets d'action avant d'envoyer la redaction a Mistral.
- `mistral-large-latest` a produit une sortie plus longue mais moins stable ici; `finish_reason=length` sur la passe squelette le rend peu rentable sur ce cas borne.
- Le validateur automatise reste volontairement strict; il penalise les bons resumes qui changent les cles, car c'est justement la faiblesse observee sur cette tache.

## Prochaine action

Tester une capacite voisine avec oracle net mais taxonomie plus simple, par exemple classification stricte de findings Lighthouse en `fix_now` / `plan_later` / `monitor` sans imposer `5` buckets nommes, ou triage de commentaires PR front-end avec schema tres court.

## Contribution vers l'objectif 70 pourcent

Oui, mais partiellement. Cette capacite ajoute une brique utile de triage frontend quand Codex pre-borne les actions avant delegation de la redaction. Estimation cumulative apres ce run: **82 pourcent** de couverture des taches recurrentes delegables vers Mistral.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-15-build-lighthouse-triage-context.mjs`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-context.md`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-expected.json`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-check.json`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-prompt.txt`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-recommend.json`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-select-model.json`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-skeleton-prompt.txt`
- `docs/daily-tests/evidence/2026-06-15-mistral-small-lighthouse-triage.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium35-lighthouse-triage.json`
- `docs/daily-tests/evidence/2026-06-15-devstral-lighthouse-triage.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-small-lighthouse-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium35-lighthouse-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-15-devstral-lighthouse-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-large-lighthouse-triage-retry.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-small-lighthouse-triage-skeleton.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-medium35-lighthouse-triage-skeleton.json`
- `docs/daily-tests/evidence/2026-06-15-mistral-large-lighthouse-triage-skeleton.json`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-validation-summary-pass1.json`
- `docs/daily-tests/evidence/2026-06-15-lighthouse-triage-validation-summary.json`
