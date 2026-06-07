# Preuves supplementaires pour retry strict

Ces extraits sont verifies localement le 2026-06-07.

## `README.md`

```text
README.md:36 export MISTRAL_API_KEY="your_api_key_here"
README.md:40 MISTRAL_API_KEY=your_api_key_here
README.md:43 The helper script also accepts `MISTRAL_AI_API_KEY`, `MISTRALAI_API_KEY`, and `MISTRAL.API_KEY`.
```

Interpretation imposee:

- si un commentaire demande d'ajouter `MISTRAL.API_KEY` au README, la bonne decision est `reply` avec `already_present`

## `package.json`

```json
{
  "scripts": {
    "validate": "node scripts/validate-repo.mjs",
    "check:helper": "node --check mistral-subagent/scripts/mistral-subagent.mjs",
    "check:models": "node mistral-subagent/scripts/mistral-subagent.mjs select-model --task \"Audit a GitHub codebase and propose patches\""
  }
}
```

Interpretation imposee:

- si un commentaire demande `npm test`, la bonne decision est `reject` avec `invented_command`

## `models`

```text
id: mistral-medium-3.5
name: mistral-medium-3-5
aliases: mistral-medium-3-5-0, mistral-medium-3-5, mistral-medium-3.5, mistral-medium-3, mistral-medium-2604
```

Interpretation imposee:

- si un commentaire affirme que `mistral-medium-3.5` n'existe plus, la bonne decision est `reject` avec `factual_error`
