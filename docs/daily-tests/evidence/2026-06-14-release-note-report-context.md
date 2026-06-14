Rapport quotidien a rediger en francais pour le lab Mistral.

Capacite testee:

- redaction d'une note de release FR bornee a partir d'un commit public reel du repo `codex-mistral-subagent-skill`

Exigences du rapport:

- statut explicite: `Valide`, `Non valide`, ou `Partiellement valide`
- categorie de tache
- pourquoi c'est important pour les projets reels de l'utilisateur
- modeles testes
- resume des prompts et du contexte
- usage/tokens quand disponibles
- resultat
- commandes de validation
- limitations
- prochaine action
- contribution vers l'objectif `70 %`

Contraintes:

- ASCII uniquement
- ton factuel
- ne compter comme valide que les sorties directement utilisees ou appliquees apres verification Codex

Resultats verifies par Codex pour ce run:

- `recommend` renvoie `suitable: false` avec un risque `commit`, donc heuristique trop conservatrice si le contexte n'est pas deja cadre
- `select-model` choisit `mistral-large-latest`
- les `4` modeles testes rendent un JSON exploitable
- meilleur resultat public retenu: `mistral-large-latest`
- bon contrepoint compact: `devstral-latest`
- `mistral-medium-3.5` reste proche du meilleur resultat
- `mistral-small-latest` reste utile mais plus bavard et moins strict sur l'ASCII natif
- commandes exactes correctement preservees par les `4` modeles: `npm run validate`, `npm run check:helper`
- aucun fichier invente dans `key_files`
