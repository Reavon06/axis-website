# AXIS-3D — Static HTML/CSS Website

Open and use **without npm, Node, or any terminal command**.

## How to view the site

1. Open the folder **`axis-3d-website-html`**
2. **Double-click `index.html`** (or right-click → Open with → Chrome / Edge / Firefox)

That’s it. All pages work from the filesystem:

| Page | File |
|------|------|
| Home | `index.html` |
| Works | `works/index.html` |
| About | `about/index.html` |
| Contact | `contact/index.html` |

Use the navigation links on the site to move between pages (do not rely on the browser address bar alone when opened as a local file).

## What’s in the folder

```
axis-3d-website-html/
├── index.html              ← start here
├── works/index.html
├── about/index.html
├── contact/index.html
├── assets/
│   ├── css/main.css        ← all styles (ready to use)
│   ├── css/animations.css
│   ├── js/site.js          ← all interactions (no modules)
│   ├── js/vendor/three.min.js   ← 3D hero (home only)
│   └── images/             ← photos & graphics
├── favicon.svg
└── docs/                   ← optional editing notes
```

## Internet

- **Fonts** load from Fontshare (needs internet the first time).
- Everything else (CSS, JS, images, 3D) is **local** in this folder.

## Editing the site later

You can change:

- **Text** → `scripts/lib/content.mjs` (then ask a developer to regenerate HTML, or edit the `.html` files directly)
- **Styles** → `assets/css/main.css` and `assets/css/animations.css`
- **Behavior** → `assets/js/site.js`
- **Images** → replace files in `assets/images/` (keep the same filenames)

The `package.json` / `npm` files are **only for developers** who want to rebuild Tailwind or regenerate HTML. **You do not need them to view the site.**

## Optional: Windows shortcut

You can pin `index.html` to the taskbar or create a desktop shortcut to open the home page in your default browser.
