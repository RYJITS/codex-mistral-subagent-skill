# Test quotidien 2026-06-14 - Planification de prompt image sous promptLock C2R

## Statut

**Valide**

## Categorie de tache

Planification structuree de prompts image sous contraintes fortes de `promptLock` et liste negative existante.

## Pourquoi c'est important pour les projets reels

Le projet reel [`D:\00_Cerveau_IA\Projet\05_Generateur image C2R`](D:/00_Cerveau_IA/Projet/05_Generateur%20image%20C2R) depend de prompts image repetes mais tres contraints. Si Mistral sait preparer la partie variable d'un prompt sans casser le `promptLock` stable, Codex peut deleguer une partie recurrente de cadrage creatif tout en gardant la verification locale avant generation.

## Modeles testes

- `mistral-small-latest`
- `mistral-medium-3.5`
- `mistral-large-latest`

## Resume des prompts et du contexte

Contexte envoye:

- un extrait borne et public du preset `v6-exact-100`
- `3` briefs reels pour le generateur image C2R
- une schema JSON strict pour `task` + `variants`
- l'interdiction de reecrire la negative list globale
- l'obligation de produire un `prompt_variable` concatene au `promptLock`

Prompt retenu:

- retour JSON uniquement
- ordre des briefs impose
- `prompt_variable` en anglais, `fit_note_fr` en francais
- exigence explicite sur FACS exact, palette, profondeur, angle, et termes bannis

## Usage et tokens

| Modele | Prompt | Completion | Total | Verdict |
|---|---:|---:|---:|---|
| `mistral-small-latest` | 1422 | 569 | 1991 | Valide, option economique |
| `mistral-medium-3.5` | 1422 | 495 | 1917 | Valide, meilleur defaut |
| `mistral-large-latest` | 1422 | 585 | 2007 | Non valide, oublie le FACS exact dans `prompt_variable` |

Tokens Mistral utiles retenus:

- `mistral-small-latest`: `1991`
- `mistral-medium-3.5`: `1917`

Total utile retenu: `3908` tokens.

## Resultat

Validation positive sous verification Codex.

- `mistral-medium-3.5` est le meilleur defaut pour ce cas: sortie compacte, champs complets, et bon respect du contrat JSON.
- `mistral-small-latest` reste directement exploitable si Codex garde un validateur local sur FACS, palette, profondeur et termes bannis.
- `mistral-large-latest` n'est pas retenu ici: il produit une prose propre mais omet les codes FACS dans `prompt_variable`, ce qui casse un check important du generateur.
- Le workflow retenu confirme qu'il faut demander a Mistral la partie variable du prompt, pas une reecriture du `promptLock`.
- Une premiere passe de reference FR a aussi ete deleguee a `mistral-medium-3.5`, puis normalisee par Codex dans [`mistral-subagent/references/image-prompt-lock-planning-fr.md`](D:/00_Cerveau_IA/Projet/03_codex-mistral-subagent-skill/mistral-subagent/references/image-prompt-lock-planning-fr.md).

## Commandes de validation

Configuration:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs recommend --task "Generer un brouillon JSON de prompt image borne pour le projet local Generateur image C2R, a partir d'un brief creatif, en respectant un promptLock et une liste negative, sans toucher au code ni aux fichiers."
node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Generer un brouillon JSON de prompt image borne pour le projet local Generateur image C2R, a partir d'un brief creatif, en respectant un promptLock et une liste negative, sans toucher au code ni aux fichiers."
```

Delegation:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-14-image-prompt-lock-prompt.txt" -Raw
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-14-image-prompt-lock-context.md" --model mistral-medium-3.5 --max-tokens 1600 --temperature 0.1 --json
```

Verification locale:

```powershell
node "docs/daily-tests/evidence/2026-06-14-validate-image-prompt-lock.mjs" "docs/daily-tests/evidence/2026-06-14-mistral-small-latest-image-prompt-lock.json" "docs/daily-tests/evidence/2026-06-14-mistral-medium-3.5-image-prompt-lock.json" "docs/daily-tests/evidence/2026-06-14-mistral-large-latest-image-prompt-lock.json"
npm run validate
npm run check:helper
git status --short
```

## Limitations

- Le validateur local prouve surtout la compatibilite structurelle avec le preset; il ne remplace pas une revue artistique finale.
- Les checks sont construits pour ce type de preset image et devront etre ajustes si un autre generateur change la grammaire attendue.
- `mistral-large-latest` pourrait redevenir utile si le prompt force encore plus explicitement l'inclusion du FACS dans `prompt_variable`.

## Prochaine action

Tester une capacite recurrente voisine dans les projets reels, par exemple classification bornee de feedback image ou extraction JSON de corrections post-generation.

## Contribution vers l'objectif 70 pourcent

Oui. Cette capacite compte comme **validee** pour la planification structuree de prompts image sous `promptLock` stable avec verification locale. Estimation cumulative apres ce run: **80 pourcent** de couverture des taches recurrentes delegables vers Mistral.

## Fichiers de preuve

- `docs/daily-tests/evidence/2026-06-14-image-prompt-lock-context.md`
- `docs/daily-tests/evidence/2026-06-14-image-prompt-lock-prompt.txt`
- `docs/daily-tests/evidence/2026-06-14-mistral-small-latest-image-prompt-lock.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium-3.5-image-prompt-lock.json`
- `docs/daily-tests/evidence/2026-06-14-mistral-large-latest-image-prompt-lock.json`
- `docs/daily-tests/evidence/2026-06-14-validate-image-prompt-lock.mjs`
- `docs/daily-tests/evidence/2026-06-14-image-prompt-lock-validation-summary.json`
- `docs/daily-tests/evidence/2026-06-14-image-prompt-reference-context.md`
- `docs/daily-tests/evidence/2026-06-14-image-prompt-reference-prompt.txt`
- `docs/daily-tests/evidence/2026-06-14-mistral-medium-3.5-image-prompt-reference.json`
