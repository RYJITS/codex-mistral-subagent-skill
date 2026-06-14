Contexte de test: redaction d'une note de release FR bornee a partir d'un commit public deja pousse du repo `codex-mistral-subagent-skill`.

Commit cible:

- hash: `f33ea9da5639315b54b424ac970b38ac89dd16e9`
- sujet: `lab mistral: valide doc publique fr bornee`
- branche de reference: `main`

Objectif de la note:

- resumer ce qui a ete livre pour un mainteneur ou lecteur public;
- rester factuel, court, et verifiable;
- ne pas inventer de scripts, fichiers, checks, ou capacites absents du commit.

Faits confirmes a partir du commit:

- le commit ajoute un nouveau catalogue public FR: `docs/TASK_CATALOG_FR.md`
- le commit ajoute un rapport quotidien de validation: `docs/daily-tests/2026-06-13-public-doc-generation-fr.md`
- le commit ajoute des preuves de runs Mistral dans `docs/daily-tests/evidence/2026-06-13-*public-doc-generation*.json`
- le commit ajoute une reference de delegation: `mistral-subagent/references/public-doc-generation-fr.md`
- le commit met a jour `README.md`
- le commit met a jour `mistral-subagent/SKILL.md`

Extrait utile de `README.md` apres ce commit:

- le skill se presente comme un helper Codex pour deleguer a Mistral des taches bornees et textuelles
- la section References pointe vers `docs/TASK_CATALOG_FR.md`
- la section References pointe vers `mistral-subagent/references/public-doc-generation-fr.md`

Extrait utile de `docs/TASK_CATALOG_FR.md` apres ce commit:

- le catalogue FR cadre les taches textuelles et verifiables delegables a Mistral
- il distingue les capacites deja validees et partiellement validees
- il rappelle que Codex garde la main sur secrets, edition locale, shell, tests, Git, et verification finale

Extrait utile de `mistral-subagent/references/public-doc-generation-fr.md` apres ce commit:

- la route validee privilegie un Markdown direct plutot qu'un JSON verbeux
- `devstral-latest` est la meilleure base de brouillon initial
- `mistral-medium-3.5` sert de contre-verification compacte

Fichiers modifies dans le commit:

- `README.md`
- `docs/TASK_CATALOG_FR.md`
- `docs/daily-tests/2026-06-13-public-doc-generation-fr.md`
- `docs/daily-tests/evidence/2026-06-13-devstral-latest-public-doc-generation-markdown.json`
- `docs/daily-tests/evidence/2026-06-13-devstral-latest-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-devstral-latest-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-latest-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-large-latest-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-public-doc-generation-markdown.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-medium-3.5-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-small-latest-public-doc-generation-retry.json`
- `docs/daily-tests/evidence/2026-06-13-mistral-small-latest-public-doc-generation.json`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-context.md`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-markdown-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-retry-prompt.txt`
- `docs/daily-tests/evidence/2026-06-13-public-doc-generation-validation-summary.json`
- `mistral-subagent/SKILL.md`
- `mistral-subagent/references/public-doc-generation-fr.md`

Commandes exactes a preserver si mentionnees:

- `npm run validate`
- `npm run check:helper`

Contraintes:

- sortie en francais
- ASCII uniquement
- pas de Markdown fence
- pas de tableau
- pas d'invention de numerique hors ce qui est confirme ici
- si un point n'est pas prouve par ce contexte, le signaler dans `invented_items` au lieu de l'inventer
