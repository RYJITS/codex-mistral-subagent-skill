# Skill Codex Mistral Subagent

## Rapport complet

Ce depot public presente le concept, les fonctions, les choix de conception, les outils utilises, les commandes locales et les captures d'ecran de l'application. Il est genere par l'orchestrateur uniquement apres validation de publication publique.

## Concept

Skill Codex qui encadre l'utilisation de Mistral comme sous-agent pour resumer, classer, extraire, relire ou produire des brouillons sous controle.

Ajouter un assistant secondaire utile sans lui laisser prendre des decisions risquee ou destructives.

Public vise: Usage interne: automatisation, documentation, revue et ideation assistee.


## Fonctionnement de l'application

Le skill decrit les cas d'usage autorises, les limites de delegation, les formats attendus et le protocole de securite. Le helper Node peut appeler Mistral pour une tache precise, puis renvoyer une sortie structuree que Codex doit relire avant toute decision ou modification.

## Fonctions de l'application

- Decrit quand utiliser Mistral comme sous-agent.
- Encadre les taches non destructives.
- Produit des sorties structurees et controlables.
- Deleguer un resume a Mistral
- Demander une classification
- Extraire des informations importantes
- Produire un brouillon de documentation
- Obtenir un second avis
- Retourner des donnees structurees
- Limiter les taches aux actions non destructives

## Actualisations et evolution

- Statut courant: PUBLIC_READY.
- Securite: OK_PUBLIC.
- Fonctionnement: FONCTIONNEL.

## Options et conception

Il a ete concu pour ajouter une aide IA sans perdre le controle principal. Mistral peut accelerer l'analyse ou la redaction, mais il ne publie pas, ne supprime pas, ne pousse pas de code et ne remplace pas les validations de Codex.

### Outils, IA et moteurs utilises

- Mistral AI
- Helper local de delegation
- Catalogue de taches autorisees
- Protocole de delegation sure
- Validation du skill
- Controle de modeles
- Sorties JSON ou Markdown relues par Codex
- Format SKILL.md Codex
- Scripts Node.js
- Consignes Markdown
- Catalogue de taches
- Validation npm
- Controle des modeles disponibles

### Options techniques detectees

- Type de projet: node
- Gestionnaire: npm
- Nom package: codex-mistral-subagent-skill
- Version: 1.0.0
- Statut securite: OK_PUBLIC

### Stack et dependances principales

- Node.js
- Format SKILL.md Codex
- Scripts Node.js
- Consignes Markdown
- Catalogue de taches
- Protocole de delegation sure
- Validation npm
- Controle des modeles disponibles

### Scripts disponibles

- check:helper: node --check mistral-subagent/scripts/mistral-subagent.mjs
- check:models: node mistral-subagent/scripts/mistral-subagent.mjs select-model --task "Audit a GitHub codebase and propose patches"
- validate: node scripts/validate-repo.mjs

### Dependances applicatives

- Aucune dependance applicative detectee.

### Dependances de developpement

- Aucune dependance de developpement detectee.

## Automatisations et comportements internes

- Validation du skill par npm run validate
- Verification syntaxique du helper
- Controle de selection des modeles
- Generation de sorties structurees
- Utilisation en dry-run depuis l'orchestrateur
- Separation entre proposition du sous-agent et action reelle

## Installation locale

```powershell
npm install
```

## Lancement

Commande de lancement a documenter selon le projet.

## Captures d'ecran

Aucune capture d'ecran publique n'est encore disponible. La publication GitHub publique doit etre completee avec une capture du projet.

## Variables d'environnement

Copier `.env.example` vers `.env` en local puis remplir les valeurs privees.

## Securite

Ne jamais publier `.env`, tokens, sessions, logs sensibles, cles privees ou donnees personnelles.
