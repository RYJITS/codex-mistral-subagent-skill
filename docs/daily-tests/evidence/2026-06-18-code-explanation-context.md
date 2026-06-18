## Contexte borne

Objectif: expliquer a un nouvel operateur Codex comment `01_SITE_MA_METHODE` demarre, charge ses modules, et alimente la grille projets, sans inventer au-dela des fichiers fournis.

Projet cible: `D:\00_Cerveau_IA\Projet\01_SITE_MA_METHODE`

Fichiers autorises:

1. `index.html`
2. `src/main.js`
3. `src/contact-scene.js`
4. `src/project-registry.js`

## Faits source a respecter

### `index.html`

- charge `src/styles.css?v=mobile-project-page-20260618`
- charge `src/main.js?v=mobile-project-page-20260618` avec `<script type="module">`
- declare les noeuds DOM `story-video`, `boot-loader`, `project-grid-track`, `contact-form`, `contact-webgl`

### `src/main.js`

- definit `CONTACT_SCENE_MODULE = "./contact-scene.js?v=contact-lazy-20260616"`
- definit `PROJECT_REGISTRY_MODULE = "./project-registry.js?v=project-grid-fixes-20260618"`
- initialise au boot:
  - `buildStory()`
  - `bindContactForm()`
  - `bindHolographicTile()`
  - `bindProjectGrid()`
  - `prepareVideoForScroll()`
  - `initMobileDebug()`
  - `scheduleProgressiveWarmup()`
  - `registerSiteWorker()`
  - `initBootLoader()`
- charge `project-registry.js` par import dynamique dans la logique de grille projets
- charge `contact-scene.js` par import dynamique dans `ensureContactScene(reason = "")`
- peut declencher `ensureContactScene(...)` par warmup idle, plage scroll contact, ou demande contact

### `src/contact-scene.js`

- exporte `initContactScene({ canvas, trigger, panel, received })`
- ouvre un contexte `webgl`
- charge une texture de cube avec `loadCubeTexture(...)`
- maintient une boucle `requestAnimationFrame(render)`
- retourne une API avec:
  - `setScrollProgress`
  - `setPhase`
  - `setHover`
  - `explodeToForm`
  - `showReceivedMessage`

### `src/project-registry.js`

- fichier genere par l'orchestrateur
- exporte `orchestratorProjectCards`
- contient pour chaque projet des metadonnees comme:
  - `id`
  - `category`
  - `name`
  - `comment`
  - `details`
  - `status`
  - `hostingerUrl` ou `githubUrl` selon les cas

## Ce qu'on veut mesurer

Capacite Mistral testee: explication d'architecture/codex onboarding sur un sous-ensemble de code borne, avec faits exacts + resume FR utile.

## Interdictions

- ne pas parler d'autres fichiers
- ne pas inventer de framework absent
- ne pas dire que `project-registry.js` est statique dans `index.html`
- ne pas dire que `contact-scene.js` est charge au premier parse HTML
