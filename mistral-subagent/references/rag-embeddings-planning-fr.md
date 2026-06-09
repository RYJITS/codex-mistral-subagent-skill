# Planification RAG/embeddings multi-projets

Utiliser cette note quand Codex veut demander a Mistral un premier plan JSON pour indexer un cerveau central multi-projets ou un petit ensemble de repos relies, sans lui donner l'autorite sur l'implementation ni l'acces a des secrets.

## Quand deleguer

Deleguer cette premiere passe quand:

- le besoin est de definir des collections, exclusions, metadonnees et triggers de refresh
- les chemins et commandes reelles sont deja connus par Codex
- le contexte peut etre resume en texte borne sans envoyer de contenu sensible
- le resultat attendu est un JSON exploitable et verifiable localement

Le test du `2026-06-09` a valide ce workflow pour `D:\00_Cerveau_IA` et `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`.

## Contexte minimal a fournir

Donner seulement:

- les chemins racine utiles: `D:\00_Cerveau_IA\Conpetances`, `D:\00_Cerveau_IA\Instructions`, `D:\00_Cerveau_IA\Memoire`, `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`
- les regles AGENTS qui imposent memoire user/projet, regeneration des index, et compatibilite multi-projets
- les commandes reelles visibles dans `D:\00_Cerveau_IA\Conpetances\package.json`, surtout `npm run memoire:update`
- les exclusions obligatoires, en premier `D:\00_Cerveau_IA\API\env.Local`

Ne pas envoyer le contenu de `env.Local`, ni un snapshot massif du disque.

## Routage modele recommande

- `devstral-latest`: meilleur premier choix pour un plan complet et directement exploitable
- `mistral-medium-3.5`: bon second choix si le prompt est compacte et le schema strict
- `mistral-large-latest`: bon brouillon public ou seconde opinion compacte
- `mistral-small-latest`: utile pour une premiere passe peu couteuse, mais pas assez fiable ici sur un schema JSON verbeux
- `mistral-embed`: a reserver a la generation d'embeddings elle-meme; pour la planification, passer par un modele de chat

## Prompt conseille

Demander un JSON ferme avec:

- `collections` pour `Conpetances`, `Instructions`, `Memoire`, et le repo cible
- `exclusions` avec `env.Local`, secrets, caches, binaires, et dependances generees
- `chunking_policy` separe pour documents, scripts, et memoire
- `metadata_schema` avec au minimum projet, type de source, chemin, date de mise a jour, portee
- `refresh_triggers` qui mentionnent `npm run memoire:update`
- `validation_checks` bornes et faisables localement

Si le modele coupe la sortie pour longueur, reduire le nombre d'elements et imposer une version compacte du meme schema.

## Validation Codex obligatoire

Verifier au minimum:

- le JSON externe puis interne se parse correctement
- les chemins cites existent vraiment
- `D:\00_Cerveau_IA\API\env.Local` est exclu explicitement
- aucun script ou workflow non observe n'est invente
- la sortie reste compatible multi-projets
- les commandes de validation restent locales et simples

## Limites observees

- les prompts trop verbeux ont fait tronquer `mistral-small-latest`, `mistral-medium-3.5`, et `mistral-large-latest` au premier essai
- une relance compacte a corrige le probleme pour `mistral-medium-3.5` et `mistral-large-latest`
- cette capacite valide la planification, pas encore l'execution directe d'un pipeline d'embeddings

## Verdict de delegation

Capacite **validee** pour produire un plan RAG/embeddings multi-projets borne et exploitable, a condition que Codex garde:

- le filtrage de secrets
- la verification des chemins et commandes
- l'implementation reelle du pipeline d'indexation
