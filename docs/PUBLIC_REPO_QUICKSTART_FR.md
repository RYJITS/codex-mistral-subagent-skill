# Quickstart FR pour localiser une doc publique

Cette note aide a localiser une documentation de repo public tout en preservant les chaines operationnelles exactes.

1. `mistral-subagent` est utilise uniquement comme assistant subordonne.
2. Codex conserve le controle des fichiers locaux, des secrets, de Git, des tests et de la verification finale.
3. Gardez `MISTRAL_API_KEY` prive et chargez-le localement.
4. Utilisez `mistral-small-latest` pour une premiere traduction economique.
5. Utilisez `mistral-medium-3.5` lorsque la note en francais doit rester precise et publique.
6. Utilisez `mistral-large-latest` lorsque la qualite de formulation prime sur le cout.
7. Executez `node mistral-subagent/scripts/mistral-subagent.mjs check` avant `node mistral-subagent/scripts/mistral-subagent.mjs run`.
