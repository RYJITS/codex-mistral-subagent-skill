# Generation de documentation publique FR bornee

Utiliser ce workflow quand Codex veut deleguer a Mistral la premiere passe d'une note publique courte pour un repo, un skill, une note operateur, ou un mini catalogue de taches, sans exposer de secrets ni laisser Mistral inventer la structure du depot.

## Quand c'est utile

- README ou doc FR a completer a partir d'un contexte filtre;
- note de routage par modele pour plusieurs projets reels;
- recap public de capacites deja validees dans `docs/daily-tests/`;
- documentation courte ou moyenne, avec titres imposes et commandes exactes.

## Route validee dans le lab

- `devstral-latest`: meilleur brouillon initial sur un contexte repo borne, avec un Markdown directement exploitable.
- `mistral-medium-3.5`: bon second brouillon compact pour verifier la structure et reduire les oublis.
- `mistral-small-latest` et `mistral-large-latest`: utiles pour tester les limites, mais les sorties JSON longues ont tendance a etre tronquees sur ce cas.

## Recommandation pratique

Pour ce type de documentation, ne pas commencer par un JSON volumineux contenant le Markdown complet. Preferer:

1. un contexte borne en Markdown;
2. un prompt qui impose les titres exacts;
3. une sortie Markdown directe, compacte, sans tableau ni code fence;
4. un plafond de taille clair, par exemple `max 850 mots`.

Le JSON strict reste utile pour des champs courts, mais il degrade vite quand le document lui-meme devient la charge utile principale.

## Prompt type

Demander:

- un seul document Markdown complet;
- les titres exacts et dans le bon ordre;
- ASCII uniquement si le repo l'exige;
- aucune invention de commande, modele, pourcentage global, ou rapport absent;
- rappel explicite que Codex garde secrets, edition locale, shell, tests, Git, et verification finale.

## Validation Codex

Verifier localement:

- presence des titres demandes;
- exactitude des model ids et commandes;
- distinction correcte entre `Valide` et `Partiellement valide`;
- absence d'inventions par rapport aux rapports `docs/daily-tests/`;
- compatibilite ASCII si necessaire.

## Limites observees

- les schemas JSON verbeux provoquent souvent une troncature ou une sous-reponse;
- certains modeles remplacent `mistral-medium-3.5` par `mistral-medium-latest` si le prompt ne force pas assez les litteraux;
- une verification Codex reste obligatoire avant publication.
