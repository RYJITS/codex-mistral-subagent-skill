# Audit borne d'un repo public

Utiliser cette note quand Codex veut deleguer a Mistral une premiere passe sur un depot public pour trouver une petite amelioration documentaire ou de validation.

## Quand utiliser ce workflow

- Le depot est public ou le contexte peut etre filtre sans risque.
- La tache vise une seule incoherence ou une seule amelioration mineure.
- Codex garde la verification locale, les edits, les tests et le commit.

## Workflow recommande

1. Generer un snapshot borne avec `project-scan`.
2. Limiter le contexte, le manifest et le nombre de fichiers.
3. Demander un JSON strict avec:
   - une seule recommandation;
   - un fichier cible;
   - les risques;
   - des commandes de validation deja visibles dans le repo.
4. Preferer `devstral-latest` pour l'audit de repo.
5. Utiliser `mistral-small-latest` pour une reformulation finale si la sortie doit etre publiee en francais.
6. Rejeter toute commande inventee, tout test absent du repo, et tout patch redondant.
7. Compter la capacite comme validee seulement si Codex applique ou utilise directement une sortie verifiee.

## Commandes de validation sures

- `git status`
- `git diff --stat`
- `npm run validate`
- `npm run check:helper`

## Limites observees

- Les prompts trop ouverts poussent Mistral vers des suggestions secondaires.
- Un modele peut inventer `npm test` ou d'autres commandes absentes si le prompt ne borne pas assez le perimetre.
- Les corrections documentaires proposees peuvent dupliquer une section deja presente.

## Prompt minimal conseille

```text
Analyse uniquement le snapshot fourni.
Retourne un JSON valide avec une seule recommandation exploitable:
task_category, why_it_matters_fr, recommended_change { target_file, reason_fr, proposed_content_fr, validation_commands, risks_fr }.
N'invente aucune commande absente du snapshot.
```
