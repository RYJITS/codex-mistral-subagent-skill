# Revue bornee de diff en francais

## Quand l'utiliser

Utiliser ce workflow pour une premiere passe de revue sur un diff court et borne, quand Codex veut detecter des regressions evidentes avant integration locale:

- changement sur un helper, une config, un README, ou un petit patch multi-fichiers;
- besoin de classer 1 a 3 findings actionnables en JSON strict;
- contexte repo deja verifie par Codex;
- aucune information sensible dans le diff ou les extraits transmis.

Ce workflow est utile pour les taches recurrentes de revue de PR, de maintenance de skill, et de verification rapide de coherence code/doc multi-projets.

## Contexte minimal a envoyer

- le diff complet en format `git diff` ou patch unifie;
- les extraits source necessaires pour etablir le comportement attendu avant le diff;
- les commandes de validation reelles et prouvees dans le repo;
- une consigne explicite: ne remonter que des problemes reels, a forte confiance, sans hypothese hors contexte.

Pour ce repo, rappeler quand c'est pertinent:

- chemin par defaut attendu: `D:\00_Cerveau_IA\API\env.Local`;
- scripts prouves: `npm run validate`, `npm run check:helper`, `npm run check:models`;
- ne jamais accepter une commande inventee comme `npm test` si elle n'apparait pas dans `package.json`.

## Prompt conseille

Demander un JSON strict avec:

- `verdict`
- `task_category`
- `why_it_matters_fr`
- `findings`
- `best_findings_for_codex`
- `validation_commands`
- `limitations_fr`

Contraintes recommandees:

- maximum 3 findings;
- uniquement des retours ancres dans le diff et le contexte;
- pas de remarques de style;
- pas de commandes, scripts, fichiers, ou comportements inventes;
- reponse en francais.

## Routage modele valide

- `mistral-medium-3.5`: meilleur choix par defaut pour une revue bornee avec restitution francaise exploitable.
- `devstral-latest`: bon second avis quand le diff touche la logique repo ou plusieurs conditions dans un helper.
- `codestral-latest`: utile pour confirmer un probleme code-shape, mais moins fiable ici pour prioriser les incoherences doc/commande.
- `mistral-small-latest`: a reserver aux diffs tres compacts et aux schemas tres serres; sinon il peut produire un faux positif ou mal prioriser.

## Limites observees

- Un modele peut confondre un changement de documentation avec un vrai bug si le prompt ne rappelle pas que la doc du diff peut elle-meme etre fautive.
- `mistral-small-latest` peut rater une commande inventee ou transformer une incoherence en simple mise a jour documentaire.
- `codestral-latest` peut etre trop etroit et confirmer le changement code sans assez contester le contrat repo ou la commande README.
- Le workflow ne remplace pas la verification Codex sur le comportement reel du repo.

## Validation Codex

Ne compter la capacite comme validee que si Codex confirme localement que les findings retenus sont reels et les utilise directement.

Checklist simple:

1. verifier les extraits source de reference avant diff;
2. parser la sortie JSON externe puis le JSON de `text` si necessaire;
3. rejeter tout finding non prouve, vague, ou contradictoire avec le contexte;
4. retenir seulement les findings qui changent vraiment la compatibilite, le comportement, ou les commandes utilisateur;
5. lancer ensuite les commandes repo visibles, au minimum `npm run validate` et `npm run check:helper`.
