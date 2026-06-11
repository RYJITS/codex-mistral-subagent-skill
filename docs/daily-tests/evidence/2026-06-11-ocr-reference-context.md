# Contexte de validation OCR 2026-06-11

Capacite testee: extraction OCR/document structuree a partir d'une capture de note projet, avec JSON strict.

Artefact source:
- image PNG locale non sensible
- champs attendus: project, category, priority, status, owner, deadline, commands, risks, decision, next_action
- oracle local exact dans 2026-06-11-ocr-expected.json

Modeles testes:
- mistral-ocr-latest via POST /v1/ocr avec document_annotation_format=json_schema
- mistral-small-latest via chat vision
- mistral-medium-3.5 via chat vision
- mistral-large-latest via chat vision

Resultats verifies localement apres normalisation legere:
- mistral-ocr-latest premier prompt: 9/10, erreur sur commands
- mistral-ocr-latest retry strict: 10/10
- mistral-small-latest premier prompt: 9/10, erreur sur commands
- mistral-medium-3.5 premier prompt: 9/10, erreur sur commands
- mistral-medium-3.5 retry strict: 10/10
- mistral-large-latest premier prompt: 10/10

Normalisations locales autorisees:
- retirer le prefixe "lancer " devant une commande shell
- ignorer la difference de diacritiques lors de la comparaison locale

Observations utiles:
- le prompt doit distinguer explicitement actions et commandes shell
- pour commands, il faut demander seulement les lignes contenant "npm run"
- mistral-ocr-latest garde bien la structure de la note et devient exploitable avec prompt strict
- mistral-large-latest est la meilleure extraction directe sur cette capture

Usage disponible:
- mistral-ocr-latest: usage_info avec pages_processed=1 et doc_size_bytes=50812
- mistral-medium-3.5 retry: prompt_tokens=2353 completion_tokens=136 total_tokens=2489
- mistral-large-latest premier prompt: prompt_tokens=2359 completion_tokens=142 total_tokens=2501
