# Skill Codex Mistral Subagent

## Presentation

Skill Codex Mistral Subagent est presente ici avec son concept, ses fonctions, ses choix de conception et ses informations d'utilisation.

## Demarrage rapide

### Pre-requis

- Git installe localement.
- Node.js 20 ou plus recent.
- Gestionnaire de paquets: npm.

### Installer et lancer

```powershell
git clone https://github.com/RYJITS/codex-mistral-subagent-skill.git
cd codex-mistral-subagent-skill
npm install
```

## Installation locale

### Pre-requis
- Node.js installe localement.
- Gestionnaire detecte: npm.
- Creer un fichier `.env` local a partir de `.env.example` si des variables sont necessaires.

### Commandes
```powershell
git clone https://github.com/RYJITS/codex-mistral-subagent-skill.git
cd codex-mistral-subagent-skill
npm install
```

## Lancement

Aucune commande de lancement n'est fournie dans les fichiers publies.

## Utilisation

Après installation, le skill peut être utilisé via les scripts fournis : 1) `npm run validate` pour vérifier la cohérence du dépôt, 2) `npm run check:helper` pour valider le helper Node.js, 3) `npm run check:models` pour tester la sélection des modèles. Pour déléguer une tâche, utiliser le helper avec un contexte précis (ex : `node mistral-subagent/scripts/mistral-subagent.mjs run --task "<description>" --context-file <fichier> --model <nom_modele> --json`). Les sorties doivent être relues et validées avant toute intégration.

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

## Actualisations et evolution

- Validation des capacités d'extraction JSON stricte pour les briefs de maintenance (2026-06-05)
- Ajout de références techniques pour le routage des modèles (mistral-small, mistral-medium, devstral)
- Mise à jour des scripts de validation et de contrôle (validate, check:helper)
- Audit de nettoyage et d'optimisation confirmant l'absence de modifications nécessaires
- Documentation des limites et des règles de délégation pour éviter les sorties non conformes

## Comment le projet a ete reflechi et construit

Le projet a été conçu pour répondre à un besoin de délégation contrôlée d'IA dans un environnement technique. Les choix clés incluent : une séparation claire entre proposition du sous-agent et action réelle, un schéma JSON strict pour éviter les hallucinations, une validation systématique des commandes et chemins, et une documentation précise des cas d'usage autorisés. L'architecture repose sur un helper Node.js modulaire et des scripts de validation pour garantir la cohérence des sorties.

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

## Captures d'ecran

Aucune capture publique n'est disponible pour ce projet.

## Variables d'environnement

Copier `.env.example` vers `.env` en local puis remplir les valeurs privees.

## Securite

Ne jamais publier `.env`, tokens, sessions, logs sensibles, cles privees ou donnees personnelles.
