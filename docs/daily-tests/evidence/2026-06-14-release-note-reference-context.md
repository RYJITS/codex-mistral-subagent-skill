Capacite a documenter: redaction d'une note de release FR bornee a partir d'un diff ou commit public deja filtre par Codex.

Resultat retenu du test du 2026-06-14:

- sortie utile attendue: JSON strict avec titre, resume, points forts, fichiers clefs, et commandes de validation
- contexte efficace: commit cible, liste exacte des fichiers modifies, quelques faits publics verifies, et commandes litterales a preserver
- modeles les plus utiles sur ce cas:
  - `mistral-large-latest` pour la meilleure note publique finale
  - `devstral-latest` pour un brouillon repo-aware compact
  - `mistral-medium-3.5` pour une contre-verification proche du meilleur resultat
- verification Codex obligatoire: aucun fichier invente, aucun script invente, highlights alignes au commit reel
- limite notable: `recommend` peut sur-declasser la tache a cause du mot `commit`, meme quand Codex a deja filtre un contexte public et borne

La reference finale doit:

- etre en francais
- rester en ASCII
- expliquer quand utiliser cette delegation
- proposer un format de sortie simple et verifiable
- donner une recommandation de routage modele
- rappeler les checks Codex et les limites observees
