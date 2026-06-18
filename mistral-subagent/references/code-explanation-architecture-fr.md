# Explication d architecture bornee depuis un petit sous-ensemble de code

## Principe

Ce workflow sert a deleguer a Mistral une explication de boot et d architecture sur un petit lot de fichiers deja filtres par Codex. Le cas valide ici porte sur `01_SITE_MA_METHODE` avec `index.html`, `src/main.js`, `src/contact-scene.js`, et `src/project-registry.js`.

## Modele recommande

- `mistral-small-latest`: meilleur defaut retenu sur ce cas pour un schema JSON strict avec resume FR borne.
- `codestral-latest`: proche sur les faits, mais pas retenu sans retry literal.
- `devstral-latest`: bon instinct repo-aware, mais trop libre sur les labels et la langue.
- `mistral-medium-3.5`: correct sur les faits, mais resume trop court au premier passage.

## Workflow recommande

1. Limiter le scope a `3` ou `4` fichiers maximum.
2. Donner les points d entree exacts, les imports dynamiques autorises, et les APIs retournees.
3. Imposer un schema JSON compact avec un petit nombre de champs fermes.
4. Verrouiller les listes de valeurs autorisees quand une fonction ou un module doit etre cite mot pour mot.
5. Utiliser un oracle local qui valide les faits, la longueur du resume, et l absence de frameworks inventes.
6. N appliquer que la sortie effectivement passee au validateur.

## Resultat retenu

Workflow partiellement valide pour une explication d architecture bornee.

- `mistral-small-latest` a passe l oracle local sur le premier essai.
- Les autres modeles testes sont restes proches semantiquement mais ont derive sur une contrainte de format ou de formulation.
- La bonne forme n est pas un long commentaire libre, mais un duo `facts JSON + summary_fr` strictement borne.

Resume retenu depuis la sortie utile du lab:

> Le site `01_SITE_MA_METHODE` demarre via `index.html` qui charge `main.js` en module. Au boot, `main.js` initialise les fonctions de base puis declenche les imports dynamiques de `contact-scene.js` et `project-registry.js`. Le premier gere une scene WebGL interactive via une API dediee, tandis que le second alimente la grille projets avec des metadonnees structurees pour l affichage.

## Commandes utiles

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file docs/daily-tests/evidence/2026-06-18-code-explanation-context.md --model mistral-small-latest --max-tokens 950 --temperature 0 --json
node docs/daily-tests/evidence/2026-06-18-validate-code-explanation.mjs docs/daily-tests/evidence/2026-06-18-mistral-small-code-explanation.parsed.json docs/daily-tests/evidence/2026-06-18-code-explanation-expected.json
```

## Limites

- Ne pas utiliser ce flux sur un repo large sans resserrer d abord le contexte.
- Ne pas laisser Mistral inventer une architecture globale a partir d un extrait partiel.
- Si le resume public doit etre plus long, faire d abord valider les faits JSON puis laisser Codex reformuler.
