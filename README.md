# CC-Marketing

A very small static marketing tool for generating Consultant Cloud sticker artwork.

## Current Scope

This first version is a sticker creator with:

- three editable sticker templates based on your current designs
- editable headline text
- editable QR destination URL
- live SVG preview
- SVG and PNG download buttons

## Local Use

Because this is a static app, you can open [`index.html`](/Users/ciaranfitzgerald/VSCode/CC-%20MarketingApp/index.html) directly in a browser, but a tiny local server is better for asset loading:

```bash
cd "/Users/ciaranfitzgerald/VSCode/CC- MarketingApp"
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project Files

- `index.html`: UI shell
- `styles.css`: layout and styling
- `app.js`: template logic, QR generation, preview, downloads
- `assets/logo-dark.jpg`: dark-background logo asset extracted from your original stickers
- `assets/logo-transparent.png`: transparent logo asset extracted from your original stickers

## GitHub

This machine currently has `git`, but not `gh`, so you can either:

1. create `CC-Marketing` on GitHub in the browser and push this folder
2. install GitHub CLI and run:

```bash
cd "/Users/ciaranfitzgerald/VSCode/CC- MarketingApp"
git init
git add .
git commit -m "Initial sticker creator"
gh repo create CC-Marketing --public --source=. --remote=origin --push
```

## Vercel

This app is static, so Vercel deployment is straightforward once the repo exists.

### Web Dashboard

- Import the `CC-Marketing` GitHub repo into Vercel
- Framework preset: `Other`
- Build command: leave empty
- Output directory: `.`

### CLI

If you install the Vercel CLI later:

```bash
cd "/Users/ciaranfitzgerald/VSCode/CC- MarketingApp"
vercel
```
