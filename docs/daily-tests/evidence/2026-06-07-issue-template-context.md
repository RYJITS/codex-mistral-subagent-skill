Projet cible: `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`

Objectif du test:

- evaluer si Mistral peut ameliorer des templates GitHub d'issue de maniere directement integrable
- produire une sortie publique en francais
- rester borne a trois fichiers:
  - `.github/ISSUE_TEMPLATE/bug_report.yml`
  - `.github/ISSUE_TEMPLATE/feature_request.yml`
  - `.github/ISSUE_TEMPLATE/config.yml`

Contraintes repo verifiees par Codex:

- le repo expose seulement `npm run validate` et `npm run check:helper`
- aucun nouveau script, package, workflow, ou dependance ne doit etre invente
- ne pas proposer de lien Discussions GitHub ou de contact externe non prouve
- conserver des labels compatibles avec l'existant:
  - `bug`
  - `enhancement`
- le repo documente un skill `mistral-subagent` pour delegation sure et bornee
- la documentation publique quotidienne de ce lab est redigee en francais

Ameliorations attendues si justifiees:

- franciser le texte visible dans les issue forms
- rendre les questions plus utiles pour un repo de skill/outil Codex
- demander le contexte d'usage, les commandes lancees, et le resultat attendu quand pertinent
- ajouter un `config.yml` minimal pour reduire les issues vides sans inventer de canaux externes

Contenu actuel de `.github/ISSUE_TEMPLATE/bug_report.yml`:

```yml
name: Bug Report
about: Create a report to help us improve
labels: ["bug"]

body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report! Please provide as much detail as possible.

  - type: input
    id: version
    attributes:
      label: Version
      description: What version of our software are you running?
      placeholder: e.g., 1.0.0
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Description
      description: A clear and concise description of what the bug is.
    validations:
      required: true

  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior.
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: textarea
    id: expected-behavior
    attributes:
      label: Expected Behavior
      description: A clear description of what you expected to happen.
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: If applicable, add screenshots to help explain your problem.

  - type: textarea
    id: additional-context
    attributes:
      label: Additional Context
      description: Add any other context about the problem here.
```

Contenu actuel de `.github/ISSUE_TEMPLATE/feature_request.yml`:

```yml
name: Feature Request
about: Suggest an idea for this project
labels: ["enhancement"]

body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a new feature! Please provide as much detail as possible.

  - type: input
    id: summary
    attributes:
      label: Summary
      description: A brief summary of the feature.
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: Is your feature request related to a problem? Please describe.
      placeholder: A clear and concise description of what the problem is.

  - type: textarea
    id: proposed-solution
    attributes:
      label: Proposed Solution
      description: Describe the solution you'd like.
      placeholder: A clear and concise description of what you want to happen.

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Describe any alternative solutions or features you've considered.

  - type: textarea
    id: additional-context
    attributes:
      label: Additional Context
      description: Add any other context or screenshots about the feature request here.
```

Contenu actuel de `.github/PULL_REQUEST_TEMPLATE.md`:

```md
## Description

Please include a summary of the changes and the related issue. List any dependencies that are required for this change.

Fixes # (issue)

## Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce them.
```
