# Test quotidien 2026-06-04 - planification de patch simple

Statut: Partiellement valide

Categorie: Planification et redaction de patch simple sur une incoherence bornee entre code et documentation.

Pourquoi c'est important pour les projets reels:

- Les depots publics et skills internes accumulent souvent des ecarts entre comportement reel, README et references.
- C'est une tache recurrente ou un sous-agent moins couteux peut preparer une premiere passe utile.
- Si Mistral gere ce type de correctif borne avec verification Codex, cela augmente directement la couverture des taches de maintenance repetitives.

Modeles testes:

- `devstral-latest`
  - audit large: prompt 8617, completion 1553, total 10170
  - patch cible: prompt 6147, completion 764, total 6911
- `codestral-latest`
  - audit large: prompt 8617, completion 1800, total 10417, sortie tronquee
  - patch cible: prompt 6147, completion 739, total 6886
- `mistral-small-latest`
  - audit large: prompt 8617, completion 564, total 9181

Resume des prompts et du contexte:

- Audit large: demander une seule incoherence reelle a fort impact entre code, documentation et configuration, puis proposer le plus petit patch utile.
- Patch cible: demander explicitement d'aligner le comportement par defaut du helper avec `D:\00_Cerveau_IA\API\env.Local` et de garder la documentation coherente.
- Contexte transmis: snapshot filtre du depot via `project-action`, sans secrets, avec fenetre de fichiers et budget de contexte limites.

Usage retenu pour validation:

- Retenu comme directement utile:
  - `devstral-latest` patch cible: direction correcte sur le helper et la coherence code/doc.
  - `codestral-latest` patch cible: confirmation de la meme direction de patch.
- Exclu du comptage utile:
  - `codestral-latest` audit large: JSON tronque, non exploitable tel quel.
  - `mistral-small-latest` audit large: incoherence detectee non prioritaire pour ce run.
  - `devstral-latest` audit large: suggestion utile mais moins critique que l'ecart reel de chemin par defaut.
- Tokens Mistral utiles comptes pour ce test: 1503 tokens de completion.
- Ratio Codex/Mistral non calcule: l'environnement de run n'expose pas ici une mesure stable du delta tokens Codex.

Resultat:

- L'incoherence verifiee localement et corrigee est la suivante:
  - le helper utilisait `process.cwd()/.env.local` comme chemin par defaut;
  - la documentation du skill et les references annoncaient `D:\00_Cerveau_IA\API\env.Local`.
- Sorties Mistral utiles:
  - les modeles cibles ont converge vers un patch sur le helper et un ajustement documentaire;
  - les deux sorties restaient imparfaites, avec diffs approximatifs ou fichiers de doc partiellement mal cibles;
  - Codex a du normaliser le patch exact et choisir les fichiers finaux a modifier.
- Correctifs appliques:
  - `mistral-subagent/scripts/mistral-subagent.mjs`
  - `README.md`
  - `mistral-subagent/references/delegation-playbook.md`

Commandes de validation:

```powershell
node mistral-subagent/scripts/mistral-subagent.mjs check
npm run validate
npm run check:helper
```

Critere de validation observe:

- `check` doit maintenant retourner `D:\00_Cerveau_IA\API\env.Local` comme `env_path` par defaut.
- `npm run validate` doit passer.
- `npm run check:helper` doit passer.

Limitations:

- Les audits trop ouverts restent bruyants: un modele peut choisir une incoherence secondaire au lieu de la plus importante.
- Les diffs proposes peuvent contenir des placeholders, des lignes inventees, ou viser un fichier de doc non minimal.
- Cette capacite n'est pas encore autonome: elle depend d'un cadrage fort et d'une verification Codex stricte.

Prochaine action:

- Rejouer cette capacite sur un autre depot avec une incoherence bornee differente.
- Mesurer ensuite si un prompt encore plus contraint reduit les hallucinations de diff et le besoin de normalisation locale.

Contribution vers l'objectif des 70 pourcent:

- Oui, mais seulement pour des incoherences bornees avec verification Codex.
- Cette journee compte comme une preuve partielle, pas comme une delegation autonome de maintenance repo.
