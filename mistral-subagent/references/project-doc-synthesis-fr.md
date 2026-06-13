# Synthese documentaire bornee depuis des docs projet

## Principe

Ce workflow sert a deleguer une note courte de mainteneur a partir de docs publiques bornees d'un projet reel. Le cadre valide ici part de `README.md`, `docs/PROJECT_MAP.md`, `docs/QUICK_DECISION_GUIDE.md`, et `docs/LOCAL_VALIDATION.md`, puis laisse Codex verifier et normaliser la sortie avant publication.

## Modeles recommandes

- `mistral-medium-3.5`: meilleur defaut retenu ici pour une synthese factuelle, concise, et publiable en francais.
- `mistral-small-latest`: utile pour une compression factuelle bon marche quand Codex accepte de restructurer legerement la sortie.
- `devstral-latest`: utile pour une formulation plus repo-aware, mais non retenu comme meilleur defaut sur ce flux.

## Workflow recommande

1. Borner le contexte a quelques docs publiques stables.
2. Fixer un ordre de lecture explicite: `README.md`, `docs/PROJECT_MAP.md`, `docs/QUICK_DECISION_GUIDE.md`, puis `docs/LOCAL_VALIDATION.md`.
3. Verrouiller les litteraux operationnels a conserver, par exemple `Wan`, `LTX`, `WebGL`, `git status --short`, et `python scripts/generate_contact_sheet.py --input frames/ --output contact_sheet.png --rows 4 --cols 3`.
4. Demander d'abord une synthese courte; ne passer au JSON strict que si un parseur local doit vraiment consommer la sortie.
5. Verifier localement les faits retenus, puis appliquer seulement la sortie Mistral effectivement utile.

## Resultat retenu

Workflow partiellement valide pour une synthese documentaire de projet reel.

- `mistral-medium-3.5` a fourni le meilleur brouillon retenu pour la reference finale.
- `mistral-small-latest` et `devstral-latest` ont aussi retenu les bons faits, mais avec plus de derive structurelle.
- Le contrat JSON strict a derive sur cette tache; la redaction directe en Markdown s'est revelee plus fiable.

## Commandes utiles

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file docs/daily-tests/evidence/2026-06-13-project-doc-synthesis-context.md --model mistral-medium-3.5 --max-tokens 1800 --temperature 0.05 --json
git status --short
```

## Limites

- Ne pas etendre ce flux a un audit repo large sans resserrer le contexte.
- Si la structure JSON exacte est critique, prevoir un oracle local et accepter qu'un retry ou un fallback Markdown soit necessaire.
- Codex garde la verification finale des faits, des commandes, des chemins, et de l'absence de secrets.
