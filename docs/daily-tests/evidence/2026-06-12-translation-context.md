# Contexte borne

Projet source: `D:\00_Cerveau_IA\Projet\codex-mistral-subagent-skill`

Objectif:

- traduire une note repo du francais vers l'anglais;
- conserver des termes verrouilles utilises tels quels dans la base de code et le workflow;
- produire une sortie JSON stricte directement verifiable localement.

Note source a traduire:

```text
Titre: Note publique de release quotidienne
Resume: Mise a jour quotidienne du lab Mistral pour le repo public.
Consignes:
- Ajouter un rapport quotidien sous docs/daily-tests/.
- Garder la documentation publique en francais d'abord.
- Preserver exactement les termes Codex, Mistral, README.md, npm run validate, npm run check:helper, docs/daily-tests/, et main.
- Indiquer que le commit reste sur main.
- Ne pas inventer de dependances, scripts, ou etapes CI.
- Ton bref, factuel, public.
```

Termes verrouilles a preserver exactement:

- `Codex`
- `Mistral`
- `README.md`
- `npm run validate`
- `npm run check:helper`
- `docs/daily-tests/`
- `main`

Contraintes:

- ne pas inventer de nouvelles commandes, dependances, scripts, ou etapes CI;
- ne pas traduire les commandes shell, chemins, ou noms de fichier;
- garder un ton bref et public;
- repondre en JSON strict uniquement.
