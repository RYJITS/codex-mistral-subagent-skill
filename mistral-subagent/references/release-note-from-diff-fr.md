# Note de release FR a partir d un diff public borne

Utiliser ce workflow quand Codex veut deleguer a Mistral la premiere passe d une note de release ou note de mainteneur a partir d un commit ou diff public deja filtre.

## Quand c est utile

- recap public de changements dans un repo de skill ou d automatisation
- note courte de livraison a partir d un commit deja pousse
- synthese mainteneur pour verifier rapidement ce qui a ete ajoute dans un lot borne

## Route validee dans le lab

- `mistral-large-latest`: meilleur brouillon final pour une note publique courte et propre
- `devstral-latest`: bon brouillon repo-aware compact pour verifier les highlights
- `mistral-medium-3.5`: bonne contre-verification proche du meilleur resultat
- `mistral-small-latest`: utile pour un premier passage, mais moins fiable sur l ASCII natif et la compacite

## Recommandation pratique

Pour cette tache, fournir a Mistral:

1. le hash du commit ou un diff public deja borne
2. la liste exacte des fichiers modifies
3. `2` a `4` faits publics verifies
4. les commandes litterales a preserver

La sortie la plus fiable dans le lab est un JSON strict avec:

- `title_fr`
- `summary_fr`
- `highlights_fr`
- `key_files`
- `validation_commands`
- `invented_items`

Ne pas demander a Mistral de deduire des PR, des tickets, des dependances, ou des checks non visibles dans le contexte.

## Validation Codex

Verifier localement:

- que `key_files` ne contient aucun chemin invente
- que les `highlights_fr` correspondent au commit reel
- que `validation_commands` garde les litteraux exacts
- que `invented_items` reste vide ou documente explicitement les zones non prouvees
- que la note reste dans le perimetre public borne

## Limites observees

- `recommend` peut sur-declasser la tache si le mot `commit` apparait sans assez de contexte borne
- une verification Codex reste obligatoire avant publication
- les modeles plus petits peuvent produire une sortie valide mais moins compacte ou moins propre pour un usage public direct
