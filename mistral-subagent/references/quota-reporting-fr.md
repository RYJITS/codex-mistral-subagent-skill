# Quota reporting avec Mistral

Utiliser cette note quand Codex veut deleguer a Mistral une synthese courte sur l'efficacite d'un run deja mesure avec le helper `quota-report`.

## Quand l'utiliser

- bilan de fin de run du lab de delegation;
- synthese FR pour README, rapport quotidien, ou commentaire de suivi;
- comparaison rapide entre plusieurs cas deja mesures par le helper.

## Entrees minimales

Donner a Mistral uniquement:

- la sortie JSON exacte de `quota-report`;
- la regle produit: `Codex delta / (Codex delta + useful Mistral tokens)`;
- les seuils de lecture:
  - `good_signal` si `codex_share_percent < 49`
  - `borderline` si `codex_share_percent <= 55` sans passer sous `49`
  - `poor_signal` si `codex_share_percent > 55`

Ne pas demander a Mistral de recalculer des tokens si le helper a deja produit le ratio.

## Lecture des signaux

- `good_signal`: la delegation compte vers l'objectif des `70 %`.
- `borderline`: la delegation reste utile, mais ne compte pas encore vers l'objectif; resserrer le prompt ou reduire la part Codex.
- `poor_signal`: la delegation ne compte pas; revoir le workflow ou le perimetre delegue.

## Limites

- Codex garde la verification finale et le comptage officiel des sorties utiles.
- Les sorties Mistral doivent rester bornees au JSON du helper; rejeter toute extrapolation non demandee.
- Pour un repo ASCII strict, demander explicitement `ASCII uniquement` dans le prompt final.

## Commande type

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs quota-report --codex-baseline 1200 --codex-current 10800 --mistral-useful 18000
```

## Mini prompt reutilisable

```text
Transforme cette sortie `quota-report` en JSON strict ou en synthese FR concise.
Classe le cas en `good_signal`, `borderline`, ou `poor_signal`.
Seul `good_signal` compte vers l'objectif des 70 %.
N'invente aucun chiffre, aucune commande, et aucun seuil supplementaire.
Codex garde la verification finale.
```
