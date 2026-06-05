# Extraction JSON stricte pour un brief de maintenance repo

## Quand deleguer cette tache

Utilisez cette capacite quand Codex doit transformer un brief texte melange en plan stable et verifiable avant toute integration locale. C'est utile pour les automations, les suivis multi-projets, les rapports de maintenance et les references de skill.

## Routage modele recommande

- `mistral-small-latest`: pour un brief court et un schema compact. Garder les champs texte longs tres limites.
- `mistral-medium-3.5`: pour un brief plus riche, plusieurs contraintes, ou une sortie utilisateur en francais.
- `devstral-latest`: pour une verification repo plus technique quand la fidelite des commandes et des chemins compte davantage.

## Schema JSON a figer

Demander un schema ferme avec noms de champs exacts. Exemple:

```json
{
  "capability_name_fr": "string",
  "task_category": "string",
  "target_file": "mistral-subagent/references/json-extraction-maintenance-fr.md",
  "reference_markdown_fr": "string",
  "validation_commands": ["string"],
  "limitations_fr": ["string"],
  "counts_toward_70": true,
  "model_routing": [
    {
      "model": "mistral-small-latest",
      "when_to_use_fr": "string"
    }
  ]
}
```

## Regles de delegation

- Exiger du JSON valide uniquement, sans Markdown externe.
- Geler le `target_file` exact si le but est de produire une reference precise.
- Limiter `validation_commands` aux commandes visibles dans le repo.
- Rejeter toute commande inventee comme `npm test` si elle n'apparait pas dans le contexte fourni.
- Pour `mistral-small-latest`, reduire le schema utile et plafonner les champs texte longs si une premiere reponse tronque.

## Mini prompt reutilisable

```text
A partir du brief fourni, extrais un plan JSON strict pour une reference de maintenance repo.
Respecte exactement le schema fourni dans le contexte.
Garde target_file exact.
N'invente aucune commande.
Redige reference_markdown_fr en francais.
Si tu utilises mistral-small-latest, reste concis pour eviter une sortie tronquee.
```

## Validation Codex

Commandes reelles du depot:

- `npm run validate`
- `npm run check:helper`
- `git status --short`

Checklist:

1. Parser le JSON externe renvoye par le helper.
2. Parser le JSON interne contenu dans `text`.
3. Verifier le chemin cible, les commandes, et la presence des champs obligatoires.
4. N'appliquer que le contenu directement utile apres normalisation locale.

## Limites connues

- Un schema trop riche fait vite tronquer `mistral-small-latest`.
- Une sortie JSON valide peut quand meme contenir une commande hors scope; la verification locale reste obligatoire.
