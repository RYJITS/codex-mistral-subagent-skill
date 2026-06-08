# Contexte borne - quota reporting 2026-06-08

But du test:

- verifier si Mistral peut transformer des sorties exactes du helper `quota-report` en synthese francaise exploitable pour le lab;
- classer chaque cas selon la sante de la delegation;
- proposer une action suivante concise sans inventer d'autres chiffres.

Regle de lecture:

- si `target_under_49_percent` vaut `true`, la delegation est un `good_signal`;
- si `target_under_49_percent` vaut `false` et `codex_share_percent` reste inferieur ou egal a `55`, la delegation est `borderline`;
- si `target_under_49_percent` vaut `false` et `codex_share_percent` est superieur a `55`, la delegation est `poor_signal`.

Rappel produit:

- dans ce lab, une capacite ne compte vers l'objectif des `70 %` que si la delegation reste utile et assez efficiente pour diminuer la part Codex;
- la formule officielle du helper est `Codex delta / (Codex delta + useful Mistral tokens)`;
- les chiffres ci-dessous viennent deja du helper local, pas d'un calcul manuel.

Cas a analyser:

## `CASE_A`

```json
{
  "codex_baseline": 1200,
  "codex_current": 10800,
  "codex_delta": 9600,
  "mistral_useful_tokens": 18000,
  "combined_tokens": 27600,
  "codex_share": 0.3478,
  "codex_share_percent": 34.78,
  "target_under_49_percent": true
}
```

## `CASE_B`

```json
{
  "codex_baseline": 5000,
  "codex_current": 14700,
  "codex_delta": 9700,
  "mistral_useful_tokens": 9500,
  "combined_tokens": 19200,
  "codex_share": 0.5052,
  "codex_share_percent": 50.52,
  "target_under_49_percent": false
}
```

## `CASE_C`

```json
{
  "codex_baseline": 2000,
  "codex_current": 15200,
  "codex_delta": 13200,
  "mistral_useful_tokens": 4000,
  "combined_tokens": 17200,
  "codex_share": 0.7674,
  "codex_share_percent": 76.74,
  "target_under_49_percent": false
}
```

Contraintes de sortie:

- sortie JSON stricte uniquement;
- garder l'ordre exact `CASE_A`, `CASE_B`, `CASE_C`;
- ne pas inventer de commandes, de fichiers, de ratios, ni de seuils autres que ceux donnes ici;
- toute formulation destinee a l'utilisateur doit etre en francais;
- rester ASCII.
