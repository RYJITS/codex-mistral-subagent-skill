# Contexte borne - triage Lighthouse multi-support

Projet reel: `01_SITE_MA_METHODE`
Type: site WebGL/video scroll-driven public, optimise pour garder le rendu cinematic sans casser la narration.

## Pourquoi cette tache compte
- Sur ce projet, les arbitrages de perf et d'accessibilite reviennent souvent apres des changements visuels.
- Codex a besoin d'une premiere passe Mistral qui transforme des audits Lighthouse bruts en plan d'action priorise et verifiable.
- Le plan ne doit pas inventer de fichiers, de scripts, ni de priorites hors contexte.

## Metriques globales avant passe d'optimisation locale
- Mobile: performance 70, accessibilite 100, SEO 90, LCP 16.2 s, payload 8.85 MiB.
- Desktop: performance 85, accessibilite 100, SEO 90, LCP 2.8 s, payload 20.09 MiB.

## Contraintes produit
- Ne pas casser le fond video cinematic, les masques, ni la narration scroll/video.
- Ne pas supprimer les effets WebGL/contact, seulement optimiser chargement, texture et pause intelligente.
- Prioriser les actions qui reduisent le poids ou le chemin critique sans casser l'apparence.

## Findings Lighthouse utiles

### total-byte-weight
- Desktop total: 20.09 MiB.
- Desktop asset: `http://127.0.0.1:4177/public/generated/videos/storyboard-7-scenes-v4-compress-block/kling-assembled/storyboard-kling-12-clips-1080p-scroll-web.mp4?v=kling-no-watermark-20260606` -> 11.44 MiB.
- Desktop asset: `http://127.0.0.1:4177/public/generated/images/contact/contact-cube-face.png` -> 2.15 MiB.
- Desktop asset: `http://127.0.0.1:4177/public/generated/videos/contact-transition/contact-transition-20260614-1080p.mp4?v=contact-final-20260614` -> 2.14 MiB.
- Mobile total: 8.85 MiB.
- Mobile asset: `http://127.0.0.1:4177/public/generated/videos/storyboard-7-scenes-v4-compress-block/kling-assembled/storyboard-kling-12-clips-720p-mobile-crop.mp4?v=mobile-crop-20260608` -> 3.13 MiB.
- Mobile asset: `http://127.0.0.1:4177/public/generated/images/contact/contact-cube-face.png` -> 2.15 MiB.
- Mobile asset: `http://127.0.0.1:4177/public/generated/images/projects/project-grid-map-20260614.png` -> 1.78 MiB.

### render-blocking-insight
- Desktop render blocking: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700;800&display=swap` -> 249 ms.
- Desktop render blocking: `http://127.0.0.1:4177/src/styles.css?v=contact-glass-calm-20260614` -> 201 ms.
- Mobile render blocking: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700;800&display=swap` -> 802 ms.
- Mobile render blocking: `http://127.0.0.1:4177/src/styles.css?v=method-card-tech-texture-20260614` -> 1202 ms.

### unminified-css
- Desktop CSS savings: 20.0 KiB on `http://127.0.0.1:4177/src/styles.css?v=contact-glass-calm-20260614`.
- Mobile CSS savings: 19.9 KiB on `http://127.0.0.1:4177/src/styles.css?v=method-card-tech-texture-20260614`.

### unminified-javascript
- Desktop JS savings: 19.7 KiB on `http://127.0.0.1:4177/src/main.js?v=contact-glass-calm-20260614` and `http://127.0.0.1:4177/src/contact-scene.js?v=contact-confirm-01`.
- Mobile JS savings: 19.7 KiB on `http://127.0.0.1:4177/src/main.js?v=final-video-pauses-20260614` and `http://127.0.0.1:4177/src/contact-scene.js?v=contact-confirm-01`.

### unused-css-rules
- Desktop unused CSS savings: 91.6 KiB.
- Mobile unused CSS savings: 90.0 KiB.

### unused-javascript
- Desktop unused JS savings: 39.3 KiB.
- Mobile unused JS savings: 39.3 KiB.

### mainthread-work-breakdown
- Mobile main thread total: 5987 ms.
- Mobile top buckets: Other 5061 ms, Script Evaluation 508 ms, Style/Layout 260 ms.

### video-caption
- Desktop informative accessibility finding on selector `body > video#story-video`, impact critical.
- Mobile informative accessibility finding on selector `body > video#story-video`, impact critical.

## Oracle local a ne pas envoyer tel quel au modele
- Un audit humain local du 2026-06-14 a deja retenu comme priorites: videos trop lourdes, medias de fin de page charges trop tot, texture contact + map projet trop lourdes, chemin critique CSS/fonts, puis nettoyage CSS/JS.
- Ce rappel sert seulement a valider localement la sortie Mistral apres coup.

## Sortie attendue
- JSON strict uniquement.
- `5` actions primaires uniques, chacune choisie parmi les `action_key` imposes.
- `1` finding secondaire maximum pour `video-caption` si le modele juge qu'il faut le suivre a part.
- Aucun fichier ou audit hors contexte.
