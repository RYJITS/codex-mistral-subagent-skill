# Brouillon contenu fiche - Skill Codex Mistral Subagent

## Resume
Un skill Codex pour encadrer l'utilisation sécurisée de Mistral comme sous-agent dans des tâches non destructives.

## A quoi sert le projet
Permettre à l'orchestrateur Cerveau IA de déléguer des tâches analytiques ou rédactionnelles à Mistral tout en conservant un contrôle strict sur les actions finales, évitant ainsi les risques de modifications non autorisées ou de décisions critiques.

## Fonctionnement
Le skill fonctionne en deux phases : 1) Délégation de la tâche à Mistral via un helper Node.js qui transmet un contexte précis (schéma, contraintes, commandes autorisées), 2) Validation et intégration par Codex des sorties produites. Mistral ne peut pas publier, supprimer ou modifier directement le code ou la documentation. Toutes les sorties sont relues et validées avant toute action.

## Construction
Le projet a été conçu pour répondre à un besoin de délégation contrôlée d'IA dans un environnement technique. Les choix clés incluent : une séparation claire entre proposition du sous-agent et action réelle, un schéma JSON strict pour éviter les hallucinations, une validation systématique des commandes et chemins, et une documentation précise des cas d'usage autorisés. L'architecture repose sur un helper Node.js modulaire et des scripts de validation pour garantir la cohérence des sorties.

## Installation
[object Object]

## Utilisation
Après installation, le skill peut être utilisé via les scripts fournis : 1) `npm run validate` pour vérifier la cohérence du dépôt, 2) `npm run check:helper` pour valider le helper Node.js, 3) `npm run check:models` pour tester la sélection des modèles. Pour déléguer une tâche, utiliser le helper avec un contexte précis (ex : `node mistral-subagent/scripts/mistral-subagent.mjs run --task "<description>" --context-file <fichier> --model <nom_modele> --json`). Les sorties doivent être relues et validées avant toute intégration.

## Fonctions
- Délégation sécurisée de tâches analytiques à Mistral
- Production de sorties structurées (JSON/Markdown) relues par Codex
- Encadrement des tâches non destructives (résumé, classification, extraction, brouillon)
- Validation des modèles et des commandes avant toute action
- Génération de références techniques ou documentaires contrôlées
