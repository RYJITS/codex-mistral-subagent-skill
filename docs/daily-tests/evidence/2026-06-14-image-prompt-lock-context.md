# Contexte borne - planification de prompt image C2R sous `promptLock`

Projet reel source: `D:\00_Cerveau_IA\Projet\05_Generateur image C2R`

Version cible:

- `id`: `v6-exact-100`
- objectif: image valide realiste sans clonage d'une reference
- format: `832x1216`

Contraintes publiques utiles extraites de `versions/v6-exact-100/notes.md` et `preset.json`:

- identite humaine, pose, decor et palette doivent varier a chaque generation
- femme adulte `25` a `38` ans
- visage `three-quarter` ou frontal avec yeux ouverts visibles
- emotion lisible avec code FACS present dans le prompt, jamais en texte rendu
- visage hyperrealiste et anatomie lisible
- univers ouvert avec profondeur foreground / mid-ground / far background
- femme centree dans un espace ouvert, jamais collee a un mur
- tenue composee uniquement d'impasto oil paint epais, pas de logique textile
- continuite peinture -> sol / eau / air / vegetation / architecture / reflets

Liste negative globale deja geree par le preset:

- `child`
- `teenage`
- `male body`
- `nude`
- `topless`
- `body paint only`
- `fabric dress`
- `textile dress`
- `normal clothing`
- `pressed against wall`
- `flat wall pose`
- `second woman`
- `multiple women`
- `CGI`
- `cartoon`
- `closed eyes`
- `blank face`
- `black void`
- `studio wall`
- `missing feet`
- `cropped limbs`
- `object in hand`
- `paintbrush`
- `weapon`
- `watermark`
- `text`

Tache demandee a Mistral:

- produire un JSON strict pour `3` briefs image reels et bornes
- ne pas reecrire la liste negative globale
- proposer seulement la partie variable du prompt, plus une courte note de controle
- garder les instructions compatibles avec le `promptLock` existant
- signaler explicitement tout risque de collision avec les contraintes

Briefs a couvrir:

1. `lagoon_reflection`
   - scene: heroine seule dans un lagon mineral a l'aube
   - emotion FACS obligatoire: `AU6+AU12`
   - palette dominante: cuivre, turquoise, ivoire
   - profondeur obligatoire: reflets eau premier plan, arches minerales milieu, horizon brumeux lointain
   - angle prefere: frontal
   - interdit specifique: aucune ville, aucun objet tenu en main

2. `storm_garden`
   - scene: heroine seule dans un jardin orageux apres la pluie
   - emotion FACS obligatoire: `AU1+AU2+AU5`
   - palette dominante: jade, petrole, argent
   - profondeur obligatoire: feuilles humides premier plan, allee sculptee milieu, verriere ouverte lointain
   - angle prefere: three-quarter
   - interdit specifique: aucun parapluie, aucun manteau textile

3. `sun_architecture`
   - scene: heroine seule dans une architecture solaire ouverte
   - emotion FACS obligatoire: `AU4+AU7+AU23`
   - palette dominante: ambre, craie, bleu pale
   - profondeur obligatoire: poussiere lumineuse premier plan, passerelles milieu, ciel perce lointain
   - angle prefere: frontal ou three-quarter
   - interdit specifique: aucun interieur ferme, aucune pose plaquee au decor

Sortie JSON attendue:

```json
{
  "task": "c2r_prompt_pack",
  "variants": [
    {
      "id": "lagoon_reflection",
      "prompt_variable": "string",
      "facs_code": "string",
      "palette": ["string", "string", "string"],
      "depth_cues": ["string", "string", "string"],
      "negative_additions": ["string"],
      "risk_flags": ["string"],
      "fit_note_fr": "string"
    }
  ]
}
```

Regles de sortie:

- JSON uniquement
- `variants` doit contenir exactement `3` objets, un par brief
- `prompt_variable` doit etre en anglais simple, sans Markdown, directement concatenable au `promptLock`
- `fit_note_fr` doit etre en francais
- chaque `prompt_variable` doit mentionner la scene, la palette, la profondeur, l'angle, l'idee d'impasto oil paint, et le code FACS exact
- ne pas inclure les termes bannis suivants dans `prompt_variable`: `text`, `watermark`, `child`, `male`, `wall`, `weapon`, `paintbrush`, `CGI`, `cartoon`
