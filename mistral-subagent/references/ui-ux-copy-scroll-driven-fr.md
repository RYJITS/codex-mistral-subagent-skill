# Reference delegation UI/UX copy scroll-driven

## Quand deleguer

Deleguer cette tache quand Codex a deja extrait un petit lot de textes UI/UX reels et veut une critique borne ou une reecriture francaise de:

- titres et sous-titres de sections;
- textes courts `body` ou `foot`;
- CTA discret de fin de parcours;
- formulations trop repetitives dans une narration scroll-driven.

Ne pas deleguer la synchronisation scroll/video elle-meme. Mistral ne valide pas le timing, le rythme visuel ou l'integration DOM/WebGL.

## Routage recommande

- `mistral-medium-3.5`: meilleure premiere passe quand il faut respecter un JSON strict, des ids fixes et des contraintes de longueur.
- `mistral-large-latest`: meilleure seconde passe pour la critique qualitative, les risques UI/UX et le CTA, avec verification Codex car il reinterprete plus volontiers la semantique.
- `mistral-small-latest`: a eviter si le nombre de lignes par titre est contractuel. Le test du `2026-06-05` a montre un echec sur `intro` avec `2` lignes retournees au lieu de `5`.

## Prompt conseille

Demander un JSON strict et rappeler chaque contrainte dans le prompt:

- garder exactement les memes `id`;
- conserver le nombre de lignes du `title` pour chaque bloc;
- garder `foot` a `8` mots maximum;
- rester sobre, net, professionnel, sans marketing vague;
- eviter les redites lexicales trop visibles;
- ne rien inventer sur chiffres, clients, promesses ou resultats.

Exemple:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "Critique et reecris ces textes UI/UX en gardant ids, nombre de lignes par title, foot <= 8 mots et JSON strict." --context-file D:\path\ui-copy-context.md --model "mistral-medium-3.5" --max-tokens 2200 --temperature 0.15 --json
```

## Validation locale

Valider chaque reponse avant integration:

1. parser le JSON externe puis le JSON contenu dans `text`;
2. verifier que tous les `id` sources sont presents et inchanges;
3. verifier que chaque `title` garde exactement son nombre de lignes source;
4. verifier que chaque `foot` reste a `8` mots maximum;
5. rejeter toute promesse, tout chiffre ou toute precision non presente dans la source;
6. verifier que le ton reste compatible avec une page sombre, narrative et peu bavarde.

Validation minimale en PowerShell:

```powershell
$outer = Get-Content -Raw result.json | ConvertFrom-Json
$inner = $outer.text | ConvertFrom-Json
@($inner.rewrites | Where-Object { @($_.title).Count -ne <expected> }).Count
@($inner.rewrites | Where-Object { (($_.foot -split '\s+') | Where-Object { $_ }).Count -gt 8 }).Count
```

## Limites observees

- Un modele peut respecter le JSON tout en cassant la structure narrative du texte.
- `mistral-large-latest` peut proposer une meilleure critique mais surspecialiser les titres.
- Les risques UI/UX proposes par Mistral restent des hypotheses de formulation tant qu'aucune verification dans le projet reel n'a ete faite.

## Verdict de delegation

Capacite validee pour des reecritures bornees de textes UI/UX en francais, si:

- le contexte reste petit;
- la forme attendue est explicite;
- Codex valide la structure avant tout usage;
- `mistral-medium-3.5` porte la premiere passe et `mistral-large-latest` sert de seconde opinion.
