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

- `devstral-latest`: meilleure premiere passe observee sur un helper compact quand il faut remonter des regressions reelles avec peu de bruit.
- `mistral-medium-3.5`: premiere passe egalement valide quand il faut une synthese francaise plus propre sans perdre les findings critiques.
- `codestral-latest`: utile comme second avis code-shaped, mais il peut manquer une regression implicite comme une degradation de `checkConfig`.
- `mistral-small-latest`: a reserver aux diffs tres compacts et aux schemas tres serres; sur ce test il a vu le fond mais a ajoute un finding redondant.

## Limites observees

- Un modele peut confondre un changement de documentation avec un vrai bug si le prompt ne rappelle pas que la doc du diff peut elle-meme etre fautive.
- `mistral-small-latest` peut rester exact sur le fond tout en ajoutant un finding redondant ou trop bruyant pour une premiere passe stricte.
- `codestral-latest` peut etre trop etroit et confirmer le changement code sans assez contester un contrat implicite du helper.
- Le workflow ne remplace pas la verification Codex sur le comportement reel du repo.

## Lecons du test 2026-06-06

- `devstral-latest` et `mistral-medium-3.5` ont detecte correctement 2 regressions reelles sur 2.
- `codestral-latest` a confirme l'inversion de priorite API, mais a manque la degradation de `checkConfig`.
- `mistral-small-latest` a vu les 2 regressions reelles, mais a ajoute un troisieme finding redondant.
- La meilleure formulation reste: au maximum 3 findings, uniquement des regressions reelles, user-impacting, et prouvees par le diff.

## Validation Codex

Ne compter la capacite comme validee que si Codex confirme localement que les findings retenus sont reels et les utilise directement.

Checklist simple:

1. verifier les extraits source de reference avant diff;
2. parser la sortie JSON externe puis le JSON de `text` si necessaire;
3. rejeter tout finding non prouve, vague, ou contradictoire avec le contexte;
4. retenir seulement les findings qui changent vraiment la compatibilite, le comportement, ou les commandes utilisateur;
5. verifier en plus, si pertinent, qu'une cle uniquement dans le fichier env reste detectee et que `process.env` garde sa priorite sur le fichier env;
6. lancer ensuite les commandes repo visibles, au minimum `npm run validate` et `npm run check:helper`.
