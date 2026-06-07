# Triage de commentaires de review GitHub en francais

## Quand l'utiliser

Utiliser ce workflow pour une premiere passe sur des commentaires de PR ou de review quand Codex veut transformer un lot de retours en plan d'action borne, sans laisser Mistral inventer des commandes, toucher a des secrets, ou requalifier seul le scope du merge.

Ce cas est utile pour les repos publics, les skills, les helpers, et les petits cycles de maintenance ou il faut classer rapidement ce qui doit etre applique, ce qui est deja couvert, ce qui doit etre refuse, et ce qui demande une clarification avant action.

## Contexte minimal a envoyer

- la liste exacte des commentaires avec un identifiant stable par item;
- les faits repo verifies par Codex: scripts reels, chemins autorises, fichiers deja presents, extraits utiles du README ou du diff;
- les limites de securite explicites, par exemple `D:\00_Cerveau_IA\API\env.Local` hors scope;
- une liste fermee de `target_paths` pour empecher l'invention de fichiers;
- si un commentaire repose sur un fait potentiellement mouvant, la preuve locale ou datee qui tranche, par exemple la sortie `models` du 2026-06-07 pour `mistral-medium-3.5`.

Le contexte doit etre assez compact pour que le modele voie les preuves. Sans extrait explicite, il confondra facilement un point deja couvert avec un changement a appliquer.

## Prompt conseille

Demander un JSON strict avec une entree par commentaire:

- `comment_actions`
- `id`
- `decision` dans `apply`, `reply`, `reject`, ou `clarify`
- `safety_flag`
- `target_paths`
- `reason_fr`

Contraintes recommandees:

- exactement un objet par commentaire;
- utiliser `reply` si le point est deja couvert par le repo, par exemple si `README.md` mentionne deja `MISTRAL.API_KEY`;
- utiliser `reject` pour une commande inventee comme `npm test` si elle n'existe pas dans `package.json`;
- utiliser `reject` pour tout changement sur `env.Local`;
- utiliser `reject` si le commentaire repose sur un fait faux, par exemple dire que `mistral-medium-3.5` n'existe plus alors que l'alias est visible localement;
- utiliser `clarify` si le commentaire pose une vraie question de scope avant merge.

## Routage modele valide

- `mistral-medium-3.5`: meilleure premiere passe observee apres ajout de preuves supplementaires sur README, scripts, et alias modele.
- `devstral-latest`: egalement valide apres preuves supplementaires, utile quand le triage reste tres ancre repo.
- `mistral-large-latest`: bon second avis et bonne synthese, mais pas meilleur que `mistral-medium-3.5` sur ce cas.
- `mistral-small-latest`: insuffisant ici; il sur-applique trop facilement un point deja present ou un commentaire fonde sur un fait faux.

## Limites observees

- Sans extraits verifies, les modeles ont tendance a transformer `reply` en `apply`.
- Les champs de justification des items `apply` varient beaucoup selon le modele; Codex doit normaliser legerement le schema avant integration.
- Ce workflow ne remplace pas la verification locale des scripts, des chemins, ni des faits mouvants sur les modeles.

## Lecons du test 2026-06-07

- Le premier passage etait insuffisant pour tous les modeles testes.
- Apres ajout de preuves supplementaires, `mistral-medium-3.5`, `devstral-latest`, et `mistral-large-latest` ont atteint `8/8` decisions correctes apres normalisation legere.
- Les erreurs critiques a filtrer en priorite sont: commande inventee, demande sur secret, point deja present dans le repo, et commentaire base sur un fait faux.
- Le meilleur compromis pour ce workflow reste une sortie JSON stricte, puis une verification Codex avant toute edition locale.

## Validation Codex

1. verifier localement les scripts, extraits README, chemins autorises, et faits mouvants utilises comme oracle;
2. parser le JSON du modele et normaliser seulement les variantes mineures de schema;
3. confirmer que chaque commentaire recoit bien `apply`, `reply`, `reject`, ou `clarify`;
4. rejeter toute sortie qui invente `npm test`, un fichier hors liste, ou un changement sur `env.Local`;
5. retenir seulement les sorties qui traitent correctement les cas `already_present`, `invented_command`, `secret`, et `factual_error`;
6. lancer ensuite les validations repo visibles, au minimum `npm run validate` et `npm run check:helper`.
