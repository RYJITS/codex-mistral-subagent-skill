# Skill Codex Mistral Subagent

## Rapport complet

Ce depot public presente le concept, les fonctions, les choix de conception, les outils utilises, les commandes locales et les captures d'ecran de l'application. Il est genere par l'orchestrateur uniquement apres validation de publication publique.

## Concept

Un skill Codex pour encadrer l'utilisation sécurisée de Mistral comme sous-agent dans des tâches non destructives.

Permettre à l'orchestrateur Cerveau IA de déléguer des tâches analytiques ou rédactionnelles à Mistral tout en conservant un contrôle strict sur les actions finales, évitant ainsi les risques de modifications non autorisées ou de décisions critiques.

Public vise: Équipe technique interne, développeurs et contributeurs du projet Cerveau IA, ainsi que toute personne souhaitant intégrer une assistance IA contrôlée dans un workflow automatisé.


## Fonctionnement de l'application

Le skill fonctionne en deux phases : 1) Délégation de la tâche à Mistral via un helper Node.js qui transmet un contexte précis (schéma, contraintes, commandes autorisées), 2) Validation et intégration par Codex des sorties produites. Mistral ne peut pas publier, supprimer ou modifier directement le code ou la documentation. Toutes les sorties sont relues et validées avant toute action.

## Fonctions de l'application

- Délégation sécurisée de tâches analytiques à Mistral
- Production de sorties structurées (JSON/Markdown) relues par Codex
- Encadrement des tâches non destructives (résumé, classification, extraction, brouillon)
- Validation des modèles et des commandes avant toute action
- Génération de références techniques ou documentaires contrôlées
- Extraction structurée d'informations à partir de briefs techniques
- Génération de brouillons de documentation ou de références
- Classification de tâches ou de commentaires
- Production de sorties JSON ou Markdown contrôlées
- Routage dynamique des modèles en fonction de la complexité de la tâche
- Validation automatique des commandes et chemins cibles

## Actualisations et evolution

- Validation des capacités d'extraction JSON stricte pour les briefs de maintenance (2026-06-05)
- Ajout de références techniques pour le routage des modèles (mistral-small, mistral-medium, devstral)
- Mise à jour des scripts de validation et de contrôle (validate, check:helper)
- Audit de nettoyage et d'optimisation confirmant l'absence de modifications nécessaires
- Documentation des limites et des règles de délégation pour éviter les sorties non conformes
- Statut courant: PUBLIC_READY.
- Securite: OK_PUBLIC.
- Fonctionnement: FONCTIONNEL.
- [object Object]

## Comment le projet a ete reflechi et construit

Le projet a été conçu pour répondre à un besoin de délégation contrôlée d'IA dans un environnement technique. Les choix clés incluent : une séparation claire entre proposition du sous-agent et action réelle, un schéma JSON strict pour éviter les hallucinations, une validation systématique des commandes et chemins, et une documentation précise des cas d'usage autorisés. L'architecture repose sur un helper Node.js modulaire et des scripts de validation pour garantir la cohérence des sorties.

Cette section doit expliquer les choix qui ont guide le projet: besoin de depart, structure retenue, modules principaux, compromis techniques, interface ou logique metier, et raisons des outils utilises.

### Outils, IA et moteurs utilises

- Node.js (runtime)
- Mistral AI (modèles : mistral-small, mistral-medium, devstral, codestral)
- npm (gestionnaire de paquets)
- Git (versioning)
- Scripts personnalisés pour la validation et le contrôle
- Architecture modulaire avec helper Node.js
- Sorties structurées en JSON/Markdown pour une intégration contrôlée
- Validation systématique des commandes et chemins
- Séparation des responsabilités : proposition du sous-agent vs action réelle
- Documentation des cas d'usage et des limites pour éviter les dérives

### Options techniques detectees

- Type de projet: node
- Gestionnaire: npm
- Nom package: codex-mistral-subagent-skill
- Version: 1.0.0
- Statut securite: OK_PUBLIC

### Stack et dependances principales

- Node.js
- Architecture modulaire avec helper Node.js
- Sorties structurées en JSON/Markdown pour une intégration contrôlée
- Validation systématique des commandes et chemins
- Séparation des responsabilités : proposition du sous-agent vs action réelle
- Documentation des cas d'usage et des limites pour éviter les dérives

### Scripts disponibles

- check:helper: node --check mistral-subagent/scripts/mistral-subagent.mjs
- check:models: node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Audit a GitHub codebase and propose patches"
- validate: node scripts/validate-repo.mjs

### Dependances applicatives

- Aucune dependance applicative detectee.

### Dependances de developpement

- Aucune dependance de developpement detectee.

## Automatisations et comportements internes

- Validation automatique du dépôt via `npm run validate`
- Vérification syntaxique du helper via `npm run check:helper`
- Sélection et validation des modèles via `npm run check:models`
- Génération de sorties structurées pour une intégration contrôlée
- Utilisation en mode dry-run pour tester les capacités avant intégration

## Installation locale

[object Object]

### Pre-requis
- Node.js installe localement.
- Gestionnaire detecte: npm.
- Creer un fichier `.env` local a partir de `.env.example` si des variables sont necessaires.

### Commandes
```powershell
npm install
```

### Scripts utiles
- check:helper: node --check mistral-subagent/scripts/mistral-subagent.mjs
- check:models: node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Audit a GitHub codebase and propose patches"
- validate: node scripts/validate-repo.mjs

## Lancement

Commande de lancement a documenter selon le projet.

## Utilisation

Après installation, le skill peut être utilisé via les scripts fournis : 1) `npm run validate` pour vérifier la cohérence du dépôt, 2) `npm run check:helper` pour valider le helper Node.js, 3) `npm run check:models` pour tester la sélection des modèles. Pour déléguer une tâche, utiliser le helper avec un contexte précis (ex : `node mistral-subagent/scripts/mistral-subagent.mjs run --task "<description>" --context-file <fichier> --model <nom_modele> --json`). Les sorties doivent être relues et validées avant toute intégration.

## Captures d'ecran

Aucune capture d'ecran n'est encore disponible. La publication GitHub doit etre completee avec une capture du projet quand il s'agit d'une application.

## Variables d'environnement

Copier `.env.example` vers `.env` en local puis remplir les valeurs privees.

## Securite

Ne jamais publier `.env`, tokens, sessions, logs sensibles, cles privees ou donnees personnelles.
