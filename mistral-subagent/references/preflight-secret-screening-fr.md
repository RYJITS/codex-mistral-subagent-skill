# Filtrage pre-vol avant delegation

Utiliser cette note quand Codex veut verifier qu'un contexte peut partir vers Mistral sans exposer de secret, de donnees privees inutiles, ou une demande d'autorite interdite.

## Quand l'utiliser

Ce workflow est utile avant toute delegation sur des extraits de logs, prompts utilisateur, commentaires de review, briefs multi-projets, ou notes de maintenance qui peuvent contenir:

- un secret ou une demande d'acces a secret;
- un chemin local prive ou un identifiant interne a masquer;
- une demande d'action interdite comme `git push`, shell, memoire, ou lecture de `env.Local`.

## Choix de modele

Pour une politique metier `allow`, `redact`, `block`:

- `mistral-small-latest`: premiere passe rapide et peu couteuse;
- `mistral-medium-3.5`: meilleur choix si le contexte est plus ambigu ou melange plusieurs signaux;
- `devstral-latest`: second avis acceptable si le contexte ressemble a une tache repo ou code.

Pour un signal brut PII/moderation:

- utiliser `mistral-moderation-2603` sur `POST /v1/moderations`;
- garder `mistral-moderation-latest` seulement comme alias historique si necessaire.

Le 2026-06-08, sur un gold set borne de `10` extraits:

- `mistral-small-latest`, `mistral-medium-3.5`, et `devstral-latest` ont donne `10/10` decisions exactes sur `allow`, `redact`, `block`;
- leurs sorties restaient incomplites par rapport au schema demande, donc Codex doit encore normaliser `summary`, `redaction_targets`, et `normalized_excerpt_fr`;
- `mistral-moderation-latest` a surtout remonte les cas PII evidents `S4` et `S5`;
- `mistral-moderation-2603` a mieux remonte `S3`, `S4`, `S5`, et `S10`, mais ne couvre pas seul la politique complete, notamment `S7` et `S8`.

Conclusion pratique:

- utiliser un modele de chat pour la decision finale `allow`, `redact`, `block`;
- utiliser `mistral-moderation-2603` comme signal complementaire, pas comme arbitre unique;
- ne jamais compter une sortie comme validee si un cas critique de type secret ou autorite interdite est classe `allow`.

## Workflow court

1. isoler un contexte borne et supprimer tout secret evident avant meme l'appel;
2. demander a `mistral-small-latest` ou `mistral-medium-3.5` une classification stricte en `allow`, `redact`, `block`;
3. si le risque porte sur PII, secrets, logs locaux, ou prompts sensibles, appeler aussi `POST /v1/moderations` avec `mistral-moderation-2603`;
4. croiser les signaux et bloquer tout cas qui implique secret, `env.Local`, shell, Git, memoire, ou publication;
5. normaliser la sortie localement avant toute integration ou delegation reelle.

## Prompt conseille

Demander un JSON strict avec au minimum:

- `decision`
- `reason_fr`
- `redaction_targets`
- `normalized_excerpt_fr`

Rappeler explicitement:

- `allow`: delegable tel quel;
- `redact`: delegable apres masquage;
- `block`: ne doit pas etre envoye a Mistral;
- aucun cas de secret, `env.Local`, ou autorite interdite ne doit finir en `allow`.

## Commandes utiles

Classification metier via le helper:

```powershell
$prompt = Get-Content "docs/daily-tests/evidence/2026-06-08-secret-screening-prompt.txt" -Raw
node mistral-subagent/scripts/mistral-subagent.mjs run --task $prompt --context-file "docs/daily-tests/evidence/2026-06-08-secret-screening-context.md" --model mistral-medium-3.5 --max-tokens 1200 --temperature 0.05 --json
```

Signal brut PII/moderation via l'API:

```powershell
$apiKeyLine = Get-Content "D:\00_Cerveau_IA\API\env.Local" | Where-Object { $_ -match '^(MISTRAL_API_KEY|MISTRAL_AI_API_KEY|MISTRALAI_API_KEY|MISTRAL\.API_KEY)=' } | Select-Object -First 1
$apiKey = ($apiKeyLine -split '=', 2)[1]
$body = @{ model = 'mistral-moderation-2603'; input = @('Extrait a verifier') } | ConvertTo-Json -Depth 4
Invoke-RestMethod -Method Post -Uri 'https://api.mistral.ai/v1/moderations' -Headers @{ Authorization = "Bearer $apiKey" } -ContentType 'application/json' -Body $body
```

## Limites a retenir

- le modele de chat peut avoir juste sur la decision mais rater le schema exact;
- la moderation detecte mieux le PII que la politique de delegation;
- les chemins locaux, noms clients, et demandes de `git push` doivent encore etre verifies par Codex meme si les scores de moderation sont bas.
