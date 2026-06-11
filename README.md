# 信笺生成器 · Letter Generator

A web app for composing decorative letters — pick stationery and a font, type or
paste the content, preview a live WYSIWYG render, and export the result as one or
more PNG images. Long letters are **automatically split across multiple pages**.

Built with Next.js (App Router) + TypeScript + Tailwind. Everything — including
PNG rendering — runs **client-side**, so it deploys to Vercel with zero config.

## Features

- 🎨 **Stationery presets** (classic lined yellow paper like the sample, cream,
  white, blue, kraft) **or upload your own background image**.
- ✍️ **6 CJK-capable fonts** (serif, sans, brush, handwriting, running script…).
- 📝 Type / paste / edit the salutation and body directly in the app.
- 📄 **Auto-pagination** — text is measured and flowed onto as many pages as needed,
  aligned to the ruled-line grid.
- 🔧 Adjustable font size, line height, margin, page size (A4 / US Letter / Square),
  and ruled-lines toggle.
- 👁️ Live preview = exactly what gets exported.
- 🖼️ **Export** each page as a retina (2×) PNG, or bundle all pages into a `.zip`.
- 💾 Draft auto-saved to `localStorage`.

## Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js (App Router) + TypeScript                  |
| Styling        | Tailwind CSS v4                                     |
| State          | Zustand (with `persist`)                            |
| DOM → PNG      | `html-to-image` (fonts embedded for determinism)   |
| Multi-file zip | `jszip`                                             |
| Downloads      | `file-saver`                                        |
| Fonts          | Google Fonts (CJK), loaded via `<link>` in layout  |

## Project structure

```
src/
  app/
    layout.tsx          # fonts <link>, metadata
    page.tsx            # two-pane editor + preview shell
    globals.css         # Tailwind + measurer/scrollbar styles
  components/
    Editor/             # TextEditor, FontPicker, BackgroundPicker, SettingsControls
    Preview/            # LetterPreview (pagination host) + LetterPage (export node)
    ExportBar.tsx       # Export PNG(s) / Download .zip
  lib/
    paginate.ts         # height-measurement pagination
    layout.ts           # derives geometry/styles from store (shared, DRY)
    exportImage.ts      # html-to-image capture → PNG / zip
    fonts.ts            # font registry
    backgrounds.ts      # stationery presets
    sample.ts           # default sample letter
  store/
    useLetterStore.ts   # Zustand state
```

## How pagination works

`lib/paginate.ts` renders text into a hidden off-screen `.measure-host` div with
the **same width, font, size and line-height** as the preview, then greedily packs
paragraphs until `scrollHeight` exceeds the content box — at which point a new page
starts. A single oversized paragraph is split via binary search (per-character for
CJK, backing off to word boundaries for Latin). Page 1 reserves one line row for the
salutation so the body stays aligned to the ruled grid.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build (verify exports here too)
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Framework preset auto-detects **Next.js** — no env vars or build config needed.
4. Deploy.

> Note: web fonts load from Google Fonts at runtime and are embedded into exports
> via CORS-enabled `fontEmbedCSS`, so PNGs render identically across machines.
