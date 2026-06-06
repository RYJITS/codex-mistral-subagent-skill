# Triage de delegation de taches multi-projets

Utiliser cette note quand Codex veut demander a Mistral une premiere passe de classification pour savoir si une tache reelle peut etre deleguee, avec quel modele, et avec quel niveau de redaction.

## Quand deleguer

Deleguer le triage lui-meme quand:

- les briefs sont textuels et bornes
- les taches a classer sont decrites sans secret ni contenu prive
- Codex veut separer rapidement `oui`, `partiel`, et `non`
- l'objectif est d'aider le routage, pas de laisser Mistral decider seul

Cas bien reconnus pendant le test du `2026-06-06`:

- reecriture UI/UX a partir de copy public
- idees de tests unitaires a partir de fichiers publics
- prompt storyboard a partir d'un brief public
- refus net des env files, secrets, shell, commit, push, memoire

## Quand ne pas deleguer

Ne pas deleguer le triage si le brief contient deja:

- un secret, une cle API, un fichier `.env` ou une demande d'y acceder
- une action shell, Git, navigateur, deploiement ou memoire
- une decision legale ou securite finale qui engage le projet

Dans ces cas, Codex garde la main et peut seulement demander a Mistral une aide redactionnelle tres borne si tout contenu sensible a deja ete retire.

## Routage recommande

- `mistral-medium-3.5`: meilleure premiere passe pour un JSON strict de triage avec les champs attendus
- `mistral-large-latest`: meilleure seconde opinion quand il faut distinguer `oui` vs `partiel` sur licence, securite, ou cadrage public
- `mistral-small-latest`: acceptable pour reperer les refus evidents, mais trop instable pour un routage modele fin ou des champs arrays stricts
- `devstral-latest` et `codestral-latest`: a utiliser apres le triage, quand Codex a deja confirme que la tache est vraiment code/repo centrique

Le test du `2026-06-06` montre que Mistral sur-route volontiers vers `mistral-medium-3.5` ou `codestral-latest` pour des taches ou Codex prefererait `devstral-latest` ou `mistral-small-latest`.

## Prompt conseille

Demander un schema ferme et refuser explicitement les variantes de structure:

- top-level fixe avec `verdict`, `task_category`, `why_it_matters_fr`, `triage`, `global_rules_fr`, `limitations_fr`
- `triage` en tableau, jamais en objet indexe par `T1`
- valeurs enumerees pour `delegation_mode`, `recommended_model`, `redaction_level`
- regle explicite: si `delegation_mode = non`, alors `recommended_model = none`
- regle explicite: si `delegation_mode = oui`, fixer `must_stay_with_codex_fr` a une formule courte

Exemple:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs run --task "<prompt retry strict>" --context-file D:\path\task-triage-context.md --model "mistral-medium-3.5" --max-tokens 1300 --temperature 0.05 --json
```

## Validation Codex obligatoire

Verifier au minimum:

- JSON externe parseable
- JSON interne parseable
- presence de `8` items `T1` a `T8`
- `global_rules_fr` et `limitations_fr` sous forme de tableaux
- aucun `recommended_model` non `none` pour une tache `non`
- refus net pour secrets, env files, shell, commit, push, memoire
- revue manuelle du routage modele pour les taches code/repo et les decisions partielles

Le triage ne doit compter comme utile que si Codex reutilise directement la sortie pour ecrire une reference, un rapport, ou un cadrage de delegation.

## Limites observees

- Les premiers prompts larges derivent facilement vers un objet par `T1` au lieu du tableau `triage`
- `mistral-small-latest` peut respecter le coeur du schema tout en cassant les types de certains champs
- `mistral-medium-3.5` respecte mieux la structure, mais sur-rend souvent `mistral-medium-3.5` lui-meme pour des taches qui devraient aller vers `devstral-latest` ou `mistral-small-latest`
- `mistral-large-latest` gere mieux les cas `partiel`, mais reste trop prudent sur certaines taches repo/documentation

## Verdict de delegation

Capacite **partiellement validee**.

Mistral est utile pour:

- filtrer les refus evidents
- produire un premier JSON de triage exploitable
- signaler les cas qui doivent rester chez Codex

Mais Codex doit encore:

- corriger ou confirmer le routage modele final
- verifier les cas `partiel`
- garder toute autorite sur secret, shell, Git, memoire, securite et decisions legales
