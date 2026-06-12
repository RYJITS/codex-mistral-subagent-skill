# Traduction structuree de doc publique EN vers FR

## Principe

Pour localiser vite une note publique de repo sans casser les commandes ni les identifiants, preferer une traduction bornee ligne par ligne ou section par section avec schema JSON strict. Codex filtre le contexte, force les litteraux a conserver, puis verifie localement avant publication.

## Modeles recommandes

- `mistral-medium-3.5`: meilleur compromis retenu pour une traduction fidele, concise et directement publiable.
- `mistral-large-latest`: bon passage de finition si la qualite de formulation publique compte plus que le cout.
- `mistral-small-latest`: utile pour un brouillon bon marche, mais non retenu ici pour une publication directe car il a reordonne le contenu ligne par ligne.

## Workflow recommande

1. Reduire la note source a un corpus public borne.
2. Enoncer un schema JSON strict avec numeros de ligne ou sections fixes.
3. Forcer la preservation exacte des commandes, model ids, variables d'environnement, chemins et code ids.
4. Valider localement la presence des litteraux et la fidelite du mapping source vers sortie.
5. Ne compter comme valide que la sortie Mistral effectivement appliquee ou reprise telle quelle apres verification Codex.

## Resultat retenu

Workflow valide pour la localisation d'une note quickstart publique.

- `mistral-medium-3.5` a fourni la meilleure version retenue pour [`docs/PUBLIC_REPO_QUICKSTART_FR.md`](D:/00_Cerveau_IA/Projet/codex-mistral-subagent-skill/docs/PUBLIC_REPO_QUICKSTART_FR.md).
- `mistral-large-latest` a aussi passe la verification et reste un bon choix de polissage.
- `mistral-small-latest` a preserve les litteraux, mais a reordonne le sens des lignes; il n'est donc pas compte comme sortie validee pour ce flux.

## Commandes utiles

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file docs/daily-tests/evidence/2026-06-12-translation-lines-context.txt --model mistral-medium-3.5 --max-tokens 1600 --temperature 0.05 --json
```

## Limites

- Une traduction libre de note complete peut recontextualiser trop agressivement le contenu.
- Si la fidelite source est critique, preferer un schema par lignes ou par sections fixes.
- Les accents peuvent varier selon la chaine d'encodage locale; garder une verification basee sur les litteraux et le sens, pas sur une sortie console brute.
