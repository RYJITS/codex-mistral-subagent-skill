# Skill Codex Mistral Subagent

## Liens vers l'application
- Lien public: non detecte
- GitHub: https://github.com/RYJITS/codex-mistral-subagent-skill

## A quoi sert le projet
Ce projet est un skill Codex qui permet d'utiliser Mistral comme sous-agent encadre. Il sert a confier des taches bornees comme resumer un dossier, classer des informations, extraire des points importants, relire un texte ou proposer un brouillon.

## Fonctionnement de l'application ou du projet
Le skill decrit les cas d'usage autorises, les limites de delegation, les formats attendus et le protocole de securite. Le helper Node peut appeler Mistral pour une tache precise, puis renvoyer une sortie structuree que Codex doit relire avant toute decision ou modification.

## Comment le projet a ete construit
Il a ete concu pour ajouter une aide IA sans perdre le controle principal. Mistral peut accelerer l'analyse ou la redaction, mais il ne publie pas, ne supprime pas, ne pousse pas de code et ne remplace pas les validations de Codex.

## Fonctions disponibles dans l'application
- Deleguer un resume a Mistral
- Demander une classification
- Extraire des informations importantes
- Produire un brouillon de documentation
- Obtenir un second avis
- Retourner des donnees structurees
- Limiter les taches aux actions non destructives

## Outils, IA et moteurs en arriere-plan
- Mistral AI
- Helper local de delegation
- Catalogue de taches autorisees
- Protocole de delegation sure
- Validation du skill
- Controle de modeles
- Sorties JSON ou Markdown relues par Codex

## Automatisations integrees
- Validation du skill par npm run validate
- Verification syntaxique du helper
- Controle de selection des modeles
- Generation de sorties structurees
- Utilisation en dry-run depuis l'orchestrateur
- Separation entre proposition du sous-agent et action reelle

## Captures d'ecran
- Aucune capture validee pour cette fiche.

## Mises a jour
- Fiche actualisee depuis le registre orchestrateur et le catalogue projet.
- Changements locaux detectes: relire la fiche apres validation des modifications.
- Derniere mise a jour registre connue: 2026-06-21T21:46:01.563Z.

## Derniere mise a jour
2026-06-21T21:46:01.567Z

> Fichier genere par l'orchestrateur pour le hub Site Ma Methode.
