# Idees de tests unitaires pour un helper Node.js

Utiliser cette note quand Codex veut deleguer a Mistral une premiere passe d'idees de tests unitaires pour un helper local, sans demander encore du code de test.

## Quand deleguer

Deleguer quand:

- les fonctions cibles sont deja identifiees
- le comportement attendu peut etre decrit depuis le code
- le repo n'a pas encore de suite de tests ou seulement une infra minimale
- Codex veut prioriser quelques cas de regression avant d'implementer

Ne pas deleguer si la demande exige deja:

- la generation complete d'une suite de tests
- des tests E2E, navigateur, reseau ou API distante
- un framework que le repo n'utilise pas ou n'expose pas

## Contexte minimal a envoyer

Envoyer seulement:

- les fonctions cibles et leur comportement observable
- les scripts reellement disponibles dans le repo
- les contraintes de format JSON
- les limites connues: pas de framework impose, pas de commande inventee

Pour un helper Node.js, inclure si utile:

- priorite des branches ou alias a tester
- raisons de skip ou d'erreur attendues
- budgets ou limites a faire respecter

## Schema JSON recommande

```json
{
  "verdict": "valide|partiellement_valide|non_valide",
  "task_category": "string",
  "why_it_matters_fr": "string",
  "test_ideas": [
    {
      "id": "T1",
      "target": "loadEnvFile",
      "priority": "high|medium|low",
      "scenario_fr": "string",
      "setup_fr": "string",
      "assertions_fr": ["string"],
      "regression_risk_fr": "string",
      "needs_extra_harness": false
    }
  ],
  "best_candidates_for_first_tests": ["T1"],
  "validation_notes_fr": ["string"],
  "limitations_fr": ["string"]
}
```

## Routage recommande

- `devstral-latest`: meilleur premier passage pour des idees de tests ancrees dans le code et les risques repo
- `codestral-latest`: bon second avis pour completer la couverture, mais plus generique
- `mistral-small-latest`: a eviter si le schema contient trop de champs ou des sorties longues

## Lecons du test 2026-06-05

- Les meilleures sorties ciblent 5 a 6 cas utiles au lieu d'un catalogue trop large
- Les assertions doivent rester observables et rattachees a une branche reelle du code
- `mistral-small-latest` a vite derive: une premiere sortie a tronque, puis le retry est sorti du schema
- `devstral-latest` a fourni la meilleure base directement exploitable

## Validation Codex obligatoire

Verifier au minimum:

- JSON parseable
- aucune fonction, commande ou framework invente
- chaque idee cible un comportement reel du helper
- les assertions ne melangent pas plusieurs scenarios incompatibles
- les tests proposes restent unitaires et non E2E

Compter la capacite comme validee seulement si Codex reutilise directement une sortie Mistral verifiee pour prioriser ou documenter une future suite de tests.
