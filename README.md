# 🌸 Cute Photo Booth

A **vanilla HTML/CSS/JavaScript** photo booth: layout → theme → capture → review & export.

## What’s included

- **Step 1 — Layout**: Classic strip, wide strip, grids, single, triptych (same definitions as v2).
- **Step 2 — Theme**: All classic + animal themes from v2; optional caption (30 chars).
- **Step 3 — Capture**: Mirror camera, quick filters (Normal / B&W / Warm / Cool), corner stickers (flower / star / heart), timer **3s / 5s / 10s**, countdown, flash, “Cheese!”, multi-shot sequence, **Web Audio** shutter (toggle mute).
- **Step 4 — Review**: Reorder shots (drag), **8 export filters**, place emoji/text stickers on the composite, optional decorative QR, **Download PNG / Print-PDF / GIF** (GIF loads `gif.js` from CDN).

## Files

| File | Role |
|------|------|
| `index.html` | App shell + screens |
| `css/style.css` | Styles |
| `js/photobooth-data.js` | Layouts, themes, filters, stickers (data from v2) |
| `js/canvas-stickers.js` | Corner flower/star/heart drawing |
| `js/canvas-composite.js` | Final strip/grid composite + decorations + QR |
| `js/sound-effects.js` | Shutter + export chime (Web Audio API) |
| `js/app.js` | Navigation, camera, capture, review |

## Run locally

Use a **local HTTP server** (camera + modules need a secure context or localhost):

```bash
npx serve .
# open http://localhost:3000
```

## Deploy (Netlify)

Publish the **repo root** (where `index.html` lives). No build step.

## Technologies

- HTML5, CSS3, JavaScript (ES5-friendly patterns, no TypeScript)
- `getUserMedia`, Canvas 2D, Web Audio API
- Optional: [gif.js](https://github.com/jnordberg/gif.js) via jsDelivr for GIF export
