# Contexte borne - triage de feedback image C2R vers corrections de prompt

Projet reel source: `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`

Flux reel pertinent:

- l'application enregistre des retours post-generation via `POST /api/feedback`
- chaque feedback contient un `status`, une `note`, un `prompt`, et une `versionId`
- la version active `v6-exact-100` impose un `promptLock` strict et une negative list globale deja geree par le generateur

Extraits publics utiles de `versions/v6-exact-100/preset.json` et `notes.md`:

- femme adulte `25` a `38` ans
- visage `three-quarter` ou frontal avec yeux ouverts visibles
- code FACS obligatoire dans le prompt, jamais en texte rendu
- univers ouvert avec profondeur `foreground`, `mid-ground`, `far background`
- femme centree en espace ouvert, jamais collee au decor
- tenue composee uniquement d'impasto oil paint epais, sans logique textile
- variation obligatoire de l'identite, de la pose, du decor et de la palette

Negative list globale deja geree ailleurs:

- `child`
- `teenage`
- `male body`
- `fabric dress`
- `textile dress`
- `normal clothing`
- `pressed against wall`
- `flat wall pose`
- `CGI`
- `cartoon`
- `closed eyes`
- `blank face`
- `black void`
- `studio wall`
- `object in hand`
- `paintbrush`
- `weapon`
- `watermark`
- `text`

Tache demandee a Mistral:

- lire `3` retours de rejet reels-simules mais compatibles avec le flux `POST /api/feedback`
- classifier chaque cas vers un diagnostic borne
- proposer une correction de prompt en anglais, compacte, directement concateneable a un prompt existant
- conserver la compatibilite avec le `promptLock`
- ajouter seulement des `negative_additions` specifiques quand elles apportent quelque chose au-dela de la negative list globale

Diagnostics autorises:

- `depth_pose_drift`
- `textile_prop_drift`
- `expression_enclosure_drift`

Cas a traiter, dans cet ordre:

1. `lagoon_flat_depth`
   - `versionId`: `v6-exact-100`
   - `status`: `rejected`
   - brief cible: heroine seule dans un lagon mineral a l'aube, `AU6+AU12`, palette cuivre / turquoise / ivoire, reflets eau au premier plan, arches minerales au milieu, horizon brumeux au loin, angle frontal
   - feedback note: `La pose donne une impression plaquee au decor sombre. On perd les reflets du lagon et l horizon. Le visage est propre mais l emotion AU6+AU12 ne lit pas assez.`
   - attente locale: renforcer profondeur + espace ouvert + FACS exact, sans reecrire la negative list globale

2. `storm_textile_prop`
   - `versionId`: `v6-exact-100`
   - `status`: `rejected`
   - brief cible: heroine seule dans un jardin orageux apres la pluie, `AU1+AU2+AU5`, palette jade / petrole / argent, feuilles humides au premier plan, allee sculptee au milieu, verriere ouverte au loin, angle three-quarter
   - feedback note: `Le haut ressemble a un manteau textile avec coutures et un parapluie est apparu. Les feuilles humides du premier plan ne se lisent presque pas.`
   - attente locale: corriger la derive textile et l accessoire, garder l univers ouvert et l impasto epais

3. `sun_blank_enclosure`
   - `versionId`: `v6-exact-100`
   - `status`: `rejected`
   - brief cible: heroine seule dans une architecture solaire ouverte, `AU4+AU7+AU23`, palette ambre / craie / bleu pale, poussiere lumineuse au premier plan, passerelles au milieu, ciel perce au loin, angle frontal ou three-quarter
   - feedback note: `Expression trop neutre, yeux presque fermes, sensation d interieur ferme. On ne sent pas assez le ciel perce ni la profondeur.`
   - attente locale: corriger expression + yeux ouverts + ouverture du decor

Sortie JSON attendue:

```json
{
  "task": "c2r_feedback_triage",
  "cases": [
    {
      "id": "lagoon_flat_depth",
      "diagnosis": "depth_pose_drift",
      "severity": "high",
      "keep_prompt_lock": true,
      "prompt_fix_en": "string",
      "negative_additions": ["string"],
      "fit_note_fr": "string"
    }
  ]
}
```

Regles de sortie:

- JSON uniquement
- `task` doit valoir exactement `c2r_feedback_triage`
- `cases` doit contenir exactement `3` objets, dans l ordre des cas ci-dessus
- `diagnosis` doit utiliser un des `3` labels autorises
- `severity` doit valoir `high` pour les `3` cas
- `keep_prompt_lock` doit rester `true`
- `prompt_fix_en` doit etre en anglais, compact, sans Markdown
- `fit_note_fr` doit etre en francais
- chaque `prompt_fix_en` doit contenir le code FACS exact du cas, l angle, la profondeur `foreground` / `mid-ground` / `far background`, et l idee de `thick wet impasto oil paint`
- ne pas inclure dans `prompt_fix_en` les termes bannis suivants: `text`, `watermark`, `child`, `male`, `weapon`, `paintbrush`, `CGI`, `cartoon`
- `negative_additions` doit rester court, max `2` elements par cas
