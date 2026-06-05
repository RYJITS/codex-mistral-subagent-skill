Contexte de test:

- Projet source reel: `D:\00_Cerveau_IA\Projet\AI_VIDEO_WEBGL_COMPETENCES_CLEAN`
- Type de page: experience WebGL/video scroll-driven avec texte lateral en francais
- Objectif de la page: presenter une methode d'optimisation, de clarte et d'impact sans tomber dans le marketing vague
- Direction UI/UX issue de `ui-ux-pro-max`:
  - pattern: `Scroll-Triggered Storytelling`
  - style: experience sombre, contraste fort, lisibilite elevee
  - contrainte: peu de texte, signal fort, CTA discret, respiration narrative

Regles de reecriture:

- Repondre en francais.
- Garder exactement les memes `id`.
- Conserver le nombre de lignes du `title` pour chaque bloc.
- Garder un ton sobre, net, professionnel, jamais grandiloquent.
- Eviter la repetition trop evidente de `clair`, `rapide`, `solide` d'un bloc a l'autre.
- Chaque `body` doit rester court, concret et orienter une action ou un benefice lisible.
- Chaque `foot` doit tenir en 8 mots maximum.
- Ne rien inventer sur des clients, chiffres, promesses ou resultats non presents.
- Le JSON doit etre strictement parseable.

Blocs source:

```json
[
  {
    "id": "intro",
    "meta": "Systeme ? Design ? Impact",
    "title": ["J'OPTIMISE", "L'EXISTANT", "PLUS CLAIR,", "PLUS RAPIDE,", "PLUS SOLIDE."],
    "body": "Mon principe est simple: clarifier, accelerer, solidifier. Chaque optimisation doit produire un gain reel et mesurable.",
    "foot": "Clair ? Rapide ? Solide"
  },
  {
    "id": "methodologie",
    "meta": "Methodologie",
    "title": ["Ma maniere", "de fonctionner"],
    "body": "J'optimise ce qui existe deja pour obtenir un systeme plus clair, plus rapide et plus solide.",
    "foot": ""
  },
  {
    "id": "methode-01",
    "meta": "Methode 01",
    "title": ["Clarifier", "avant d'agir"],
    "body": "Je rends une situation lisible en structurant les informations qui comptent.",
    "foot": "Un probleme complexe devient clair."
  },
  {
    "id": "methode-02",
    "meta": "Methode 02",
    "title": ["Accelerer", "sans friction"],
    "body": "J'elimine les etapes inutiles pour que les actions s'enchainent naturellement.",
    "foot": "Moins de gestes, plus de vitesse."
  },
  {
    "id": "methode-03",
    "meta": "Methode 03",
    "title": ["Solidifier le", "systeme en amont"],
    "body": "Je mets des garde-fous directement dans le flux pour eviter les erreurs avant production.",
    "foot": "Un fonctionnement plus fiable dans le temps."
  },
  {
    "id": "methode-04",
    "meta": "Methode 04",
    "title": ["Donnees utiles,", "decisions nettes"],
    "body": "Je transforme les donnees en signaux d'action exploitables.",
    "foot": "Chaque indicateur guide une decision."
  },
  {
    "id": "methode-05",
    "meta": "Methode 05",
    "title": ["Design au service", "de la clarte"],
    "body": "Le design rend le systeme lisible, intuitif et naturel a utiliser.",
    "foot": "Une idee devient un usage concret."
  },
  {
    "id": "methode-06",
    "meta": "Methode 06",
    "title": ["Ameliorer", "en continu"],
    "body": "Chaque iteration sert a optimiser davantage ce qui existe deja.",
    "foot": "Le systeme progresse en permanence."
  }
]
```

JSON attendu:

```json
{
  "global_assessment": {
    "status": "valide|partiel|non_valide",
    "summary": "..."
  },
  "issues": [
    {
      "id": "intro",
      "problem": "...",
      "severity": "low|medium|high"
    }
  ],
  "rewrites": [
    {
      "id": "intro",
      "title": ["..."],
      "body": "...",
      "foot": "...",
      "why": "..."
    }
  ],
  "ui_risks": ["..."],
  "cta_recommendation": "...",
  "best_blocks": ["..."],
  "weak_blocks": ["..."]
}
```
