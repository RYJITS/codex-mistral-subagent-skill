Artefact source non sensible a extraire en JSON:

- PDF: `D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h.pdf`
- PNG preview: `D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h_preview_full.png`
- Source oracle locale: `D:\00_Cerveau_IA\Conpetances\Exports\Pedagogie\problemes_fractions_9h.html`

But de l'extraction:

- reconstruire une fiche pedagogique en JSON exploitable pour indexation, memoire projet, et futur catalogage d'exercices;
- rester borne a des champs simples et verifiables;
- ne pas inventer de champs absents du document.

Schema attendu:

```json
{
  "title": "string",
  "subtitle": "string",
  "level": "string",
  "student_fields": ["string"],
  "sections": [
    {
      "id": 1,
      "title": "string",
      "statement": "string",
      "question_count": 3,
      "questions": ["string"],
      "key_values": ["string"]
    }
  ],
  "hint": "string|null",
  "footer": "string"
}
```
