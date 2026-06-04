# Delegation Mistral pour storyboard video scroll-driven

Reference pratique pour deleguer a Mistral la planification de prompts video/storyboard sur des experiences WebGL video-first, en particulier quand le projet a une narration synchronisee au scroll et des overlays texte.

## Quand deleguer

Deleguer quand Codex a deja:

- le storyboard source ou le resume narratif
- les contraintes de format de sortie
- les contraintes produit: langue, duree, support mobile, ambiance, integration scroll

Ne pas deleguer si la demande exige deja:

- des edits de code ou de shaders
- un rendu video final
- des decisions techniques non bornees
- des secrets ou des assets non autorises

## Routage recommande

- `mistral-small-latest`: meilleur pour une shot list compacte, avec schema tres court et limites de mots strictes
- `mistral-medium-latest`: meilleur equilibre pour un `scene_plan` complet avec transitions, overlays, notes WebGL et risques
- `mistral-large-latest`: utile pour une passe narrative plus premium, mais a normaliser plus souvent

## Prompt conseille

Utiliser un contexte borne et public-safe:

- nom du projet ou type d'experience
- objectif narratif
- liste des scenes source
- contraintes visuelles et d'integration
- schema JSON cible

Exemple de consigne:

```text
Tu aides Codex a planifier un storyboard video WebGL scroll-driven.
Retourne uniquement un JSON.
9 scenes exactement, ids 01 a 09.
Francais uniquement.
Champs courts, concrets, exploitables pour storyboard/video generatif.
Mentionne les risques de lisibilite ou surcharge visuelle.
```

## Schema conseille

Pour un plan complet:

```json
{
  "capability_label": "string",
  "global_direction": {
    "visual_axis": "string",
    "camera_language": "string",
    "scroll_integration": "string"
  },
  "scene_plan": [
    {
      "id": "01",
      "intent": "string",
      "video_prompt": "string",
      "transition": "string",
      "overlay_copy": "string",
      "webgl_note": "string",
      "risk": "string"
    }
  ],
  "validation_checklist": ["string"],
  "verdict": {
    "usable_as_is": true,
    "strengths": ["string"],
    "limits": ["string"]
  }
}
```

Pour un mode low-cost `small`, reduire a:

```json
{
  "capability_label": "string",
  "scene_plan": [
    {
      "id": "01",
      "video_prompt": "string",
      "transition": "string",
      "risk": "string"
    }
  ],
  "verdict": {
    "usable_as_is": true,
    "strengths": ["string"],
    "limits": ["string"]
  }
}
```

## Lecons du test 2026-06-04

- `small` peut echouer par troncature si le schema est trop riche
- `small` redevient utile si le prompt force la concision
- `medium` suit le mieux les contraintes globales sur ce type de tache
- `large` apporte une meilleure matiere narrative mais peut sortir du format exact

## Validation Codex obligatoire

Verifier au minimum:

- JSON parseable
- nombre de scenes exact
- ids conformes
- pas de promesse technique inventee
- risques visuels identifies
- compatibilite avec le workflow reel: storyboard, video generative ou briefing motion

## Heuristique d'application

- utiliser la sortie `small` comme premiere shot list
- utiliser la sortie `medium` comme base par defaut
- utiliser `large` seulement pour enrichir la direction artistique ou reformuler pour un livrable public
