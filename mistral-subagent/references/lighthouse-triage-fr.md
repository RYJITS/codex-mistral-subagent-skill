# Delegation Mistral pour triage Lighthouse frontend

Reference pratique pour deleguer a Mistral une premiere passe de redaction frontend a partir d'un lot Lighthouse borne sur desktop/mobile.

## Statut actuel dans le lab

Validation `Partiellement valide` sur le run du `2026-06-15`.

- Non valide en schema-first brut a partir des findings Lighthouse seuls: les modeles derivent encore sur les `action_key` et la structure imposee.
- Utile en workflow hybride: Codex extrait d'abord les buckets d'action, puis `mistral-medium-3.5` remplit la justification FR et les checks locaux.

## Quand utiliser cette route

Utiliser cette route si:

- le projet est un frontend public ou local avec audits Lighthouse deja produits;
- Codex peut filtrer un contexte compact avec seulement les findings et fichiers utiles;
- la sortie attendue est une note FR de priorites, pas une modification directe du code;
- un validateur local peut verifier les cles, audits et chemins.

Ne pas utiliser cette route si:

- tu attends de Mistral qu'il invente seul une taxonomie d'actions stricte a partir du JSON brut;
- le contexte melange trop de pages, trop de parcours, ou des findings contradictoires;
- le projet demande deja une verification perf visuelle fine que seul Codex peut faire.

## Modele recommande

- Defaut hybride: `mistral-medium-3.5`
- Fallback economique: `mistral-small-latest` seulement si Codex fournit deja un squelette tres borne
- A eviter ici: `mistral-large-latest` si la reponse risque de depasser la longueur utile; le run du `2026-06-15` a fini en `length` sur la passe squelette
- `devstral-latest` comprend bien le probleme repo/front, mais a derive lui aussi sur les noms de buckets en schema-first brut

## Workflow recommande

1. Codex extrait un contexte compact depuis Lighthouse:
   - metrics globales utiles
   - audits cibles
   - assets ou fragments de chemins lourds
   - contraintes produit
2. Codex construit le squelette exact des actions:
   - `action_key`
   - `priority_rank`
   - `scope`
   - `audit_ids`
   - `files`
3. Mistral remplit seulement:
   - `global_assessment_fr`
   - `why_it_matters_fr`
   - `local_check_fr`
   - eventuellement `secondary_findings[0].why_it_matters_fr`
4. Codex valide localement:
   - pas de drift sur les cles
   - pas de fichiers inventes
   - pas de scripts inventes
   - texte FR utile et borne
5. Codex integre ensuite le plan dans le rapport ou la note projet.

## Prompt conseille

Donner a Mistral un template complet et dire explicitement:

- ne change pas les cles ni les tableaux;
- remplis seulement les champs texte;
- n'ajoute aucun autre champ;
- n'invente ni commande ni fichier absent du contexte.

## Validation locale minimale

- validateur JSON des cles et chemins
- relecture Codex des phrases FR
- rerun Lighthouse ou checks locaux si le plan sert ensuite a une vraie passe d'optimisation

## Signal de non-validation

Si Mistral:

- renomme les `action_key`;
- remplace les tableaux par des objets libres;
- tronque la sortie;
- change les selecteurs ou les fichiers imposes;

alors la capacite ne doit pas etre comptee comme validee en brut. Revenir au workflow hybride.
