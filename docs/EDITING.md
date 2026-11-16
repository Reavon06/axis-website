# Editing guide

## Copy (text only)

Edit **`scripts/lib/content.mjs`**, then:

```bash
npm run build:pages
```

This updates all four HTML files. Do not hand-edit `index.html` if you plan to regenerate — changes will be overwritten.

## Page sections & markup

Section HTML lives in **`scripts/lib/pages.mjs`**:

- `renderHomeBody` — hero, metrics, capabilities, featured works, standards, inquiry CTA
- `renderWorksBody` — hero + 6 content sections + final CTA
- `renderAboutBody` — hero through final CTA
- `renderContactBody` — intake column + studio card

Shared chrome: **`scripts/lib/partials.mjs`** (nav, footer, WhatsApp float, `<head>`).

## Styles

| Layer | File |
|-------|------|
| Colors, spacing tokens | `src-css/tokens.css` |
| Tailwind base + glass nav utilities | `src-css/input.css` |
| Motion (reveal, shimmer, nav drawer) | `assets/css/animations.css` |
| Compiled utilities | `assets/css/main.css` (generated) |

After token or `input.css` changes:

```bash
npm run build:css
```

`tailwind.config.js` must list any new class names if you add arbitrary markup outside the scanned files.

## JavaScript behavior

| File | Role |
|------|------|
| `assets/js/main.js` | Boots nav, reveal, WhatsApp links |
| `assets/js/nav.js` | Scroll glass, mobile menu, contact pulse trigger |
| `assets/js/reveal.js` | `.reveal` / `.reveal--stagger` on scroll |
| `assets/js/parallax.js` | Hero + section parallax, journey spine |
| `assets/js/hero-3d.js` | Home hero Three.js scene |
| `assets/js/dust.js` | Ambient particles in `[data-dust-container]` |
| `assets/js/whatsapp.js` | Consumer WhatsApp URLs (Android intent) |
| `assets/js/contact-pulse.js` | Email/WhatsApp wiggle on contact page |
| `assets/js/motion-prefs.js` | `prefers-reduced-motion` → `.reduce-motion` |

## Images

Paths are relative to **`assets/images/`**:

- Home: `logo-placeholder.png`, `service-*.png`, `work-*.png`
- Works: `works/diatone/samphero.png`, `works/incubator/hero.png`, etc.
- About: `about/story-visual.png`, `about/workspace-a.png`, `about/workspace-b.png`

Replace PNGs in place (same filename) or update paths in `pages.mjs` via `asset(depth, '…')`.

To refresh PNGs from SVG sources in the React repo:

```bash
cd ../axis-3d-website
npm run assets:png
# copy src/assets → axis-3d-website-html/assets/images
```

## Full rebuild

```bash
npm run build
```
