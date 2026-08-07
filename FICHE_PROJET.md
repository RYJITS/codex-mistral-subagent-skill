# Skill Codex Mistral Subagent

## Liens vers l'application
- Lien public: non detecte
- GitHub: [https://github.com/RYJITS/codex-mistral-subagent-skill](https://github.com/RYJITS/codex-mistral-subagent-skill)

## A quoi sert le projet
Ce skill permet d'intégrer Mistral comme sous-agent dans des workflows automatisés, en limitant ses actions à des tâches non destructives (analyse, synthèse, extraction). Il produit des sorties structurées (JSON ou Markdown) que Codex peut relire, valider ou modifier avant toute intégration. L'objectif est d'accélérer les tâches répétitives tout en maintenant un contrôle strict sur les décisions finales.

## Fonctionnement de l'application ou du projet
Le skill fonctionne en deux phases : 1) Délégation de la tâche à Mistral via un helper Node.js qui transmet un contexte précis (schéma, contraintes, commandes autorisées), 2) Validation et intégration par Codex des sorties produites. Mistral ne peut pas publier, supprimer ou modifier directement le code ou la documentation. Toutes les sorties sont relues et validées avant toute action.

## Comment le projet a ete construit
Le projet a été conçu pour répondre à un besoin de délégation contrôlée d'IA dans un environnement technique. Les choix clés incluent : une séparation claire entre proposition du sous-agent et action réelle, un schéma JSON strict pour éviter les hallucinations, une validation systématique des commandes et chemins, et une documentation précise des cas d'usage autorisés. L'architecture repose sur un helper Node.js modulaire et des scripts de validation pour garantir la cohérence des sorties.

## Installation et utilisation
### Installation
[object Object]

### Utilisation
Après installation, le skill peut être utilisé via les scripts fournis : 1) `npm run validate` pour vérifier la cohérence du dépôt, 2) `npm run check:helper` pour valider le helper Node.js, 3) `npm run check:models` pour tester la sélection des modèles. Pour déléguer une tâche, utiliser le helper avec un contexte précis (ex : `node mistral-subagent/scripts/mistral-subagent.mjs run --task "<description>" --context-file <fichier> --model <nom_modele> --json`). Les sorties doivent être relues et validées avant toute intégration.

## Fonctions disponibles dans l'application
- Extraction structurée d'informations à partir de briefs techniques
- Génération de brouillons de documentation ou de références
- Classification de tâches ou de commentaires
- Production de sorties JSON ou Markdown contrôlées
- Routage dynamique des modèles en fonction de la complexité de la tâche
- Validation automatique des commandes et chemins cibles

## Outils, IA et moteurs en arriere-plan
- Node.js (runtime)
- Mistral AI (modèles : mistral-small, mistral-medium, devstral, codestral)
- npm (gestionnaire de paquets)
- Git (versioning)
- Scripts personnalisés pour la validation et le contrôle

## Automatisations integrees
- Validation automatique du dépôt via `npm run validate`
- Vérification syntaxique du helper via `npm run check:helper`
- Sélection et validation des modèles via `npm run check:models`
- Génération de sorties structurées pour une intégration contrôlée
- Utilisation en mode dry-run pour tester les capacités avant intégration

## Captures d'ecran
- Aucune capture validee pour cette fiche.

## Mises a jour
- [object Object]
- Validation des capacités d'extraction JSON stricte pour les briefs de maintenance (2026-06-05)
- Ajout de références techniques pour le routage des modèles (mistral-small, mistral-medium, devstral)
- Mise à jour des scripts de validation et de contrôle (validate, check:helper)
- Audit de nettoyage et d'optimisation confirmant l'absence de modifications nécessaires
- Documentation des limites et des règles de délégation pour éviter les sorties non conformes
