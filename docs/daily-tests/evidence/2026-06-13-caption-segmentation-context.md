## Contexte borne

- Projet source reel: `D:\00_Cerveau_IA\Conpetances\Mantage video\Remotion`
- Artefact cible: generation de captions texte pour une video voix off de `30.0` secondes
- But: transformer un transcript deja valide en `7` captions courtes pour usage Remotion/WebGL
- Langue de sortie: francais rendu en ASCII
- Total de captions attendu: `7`
- Couverture: les `7` captions doivent couvrir tout le transcript sans perte de mots
- Regle de fidelite: conserver exactement l'ordre des mots du transcript
- Regle de style: captions courtes, lisibles a l'ecran, decoupees sur des unites semantiques naturelles
- Regle d'edition: ne pas inventer de mots, ne pas resumer, ne pas reformuler

## Transcript valide

`Je transforme les problemes en systemes. Ce site montre une methode simple, voir avant d'agir, executer sans friction, transformer les donnees en decisions. Cote digital, l'intelligence artificielle devient un moteur concret pour automatiser, connecter et accelerer. Cote supply chain, les flux deviennent lisibles, stables et pilotables. Ici, chaque idee avance vers un resultat utile.`

## Contraintes de segmentation

- produire exactement `7` captions
- garder l'ordre des mots du transcript
- chaque caption doit etre une sous-sequence contigue du transcript
- pas de chevauchement entre captions
- pas de mots manquants une fois les `7` captions concatenees
- preferer des longueurs raisonnables pour lecture ecran court
- autoriser la ponctuation ASCII simple

## Contrainte de sortie

Retour attendu en JSON strict uniquement.
