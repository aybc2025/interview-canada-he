# CLAUDE.md

Context for working in this repo. Read before making changes.

## On opening this repo, run automatically

```bash
npm install && npm run build
```

No need to ask first.

**Important:** this project was authored in an environment with no network
access, so `npm install` has never actually run and the build has never been
executed end to end. Treat the first build as a real verification step – fix
whatever errors appear and re-run until it is clean before doing anything else
you are asked to do.

Likely first-build failure points, in rough order of probability:

1. **`vite-plugin-pwa` version drift.** The manifest/workbox option shape
   changes between majors. If the build complains about unknown options, check
   the installed version against `vite.config.js`.
2. **Tailwind logical utilities.** The UI relies on `ps-*`, `pe-*`, `ms-*`,
   `me-*`, `start-*`, `end-*`, `border-s-*`, `rounded-e-*`. These need
   Tailwind **3.3+**. On an older version they compile to nothing and the RTL
   layout silently breaks – verify the version before debugging layout.
3. **`src/generated/` missing.** It is gitignored and produced by
   `npm run content`, which `prebuild` invokes. If an editor or a bare
   `vite build` skips the prebuild step, the JSON imports fail. Run
   `npm run content` manually and retry.

After the first successful build, run `npm run preview` and check a chapter
page on a narrow viewport – tables switch to a stacked card layout below the
`sm` breakpoint, and that is the layout most likely to have gone wrong.

## What you can NOT do here, even if asked

- **Create the GitHub repository or connect Pages.** Enabling Pages
  (Settings → Pages → Source: GitHub Actions) is a one-time manual step for
  the owner. Name it rather than trying to work around it.
- **Push to `main` casually.** Any push to `main` triggers a live deploy.
- **Add the font files.** They are not committed (see
  `public/fonts/README.txt`). The site is designed to work without them.
- **Add the downloadable Word/PDF.** The owner supplies those, using the exact
  filenames in `public/downloads/README.txt`. Do not generate substitutes and
  do not build a PDF-generation feature – this was decided explicitly.

## Architecture

```
content/            Markdown source of the guide – the editable content
scripts/            build-content.mjs: markdown -> JSON, runs on prebuild
src/generated/      Build output. Gitignored. Never edit by hand.
src/config/         parts.js (the four parts), constants.js (storage, downloads)
src/lib/            content.js (chapter queries), hebrew.js (search normalising),
                    Bidi.jsx (RTL/Latin isolation)
src/hooks/          One concern each; components never touch localStorage directly
src/components/     shared/ toc/ chapter/ chapter/blocks/ search/
src/pages/          One per route
```

**Content flow:** `content/*.md` → `scripts/build-content.mjs` →
`src/generated/content.json` + `search-index.json` → `lib/content.js` →
`ChapterView` → the six block components.

To change the text of the guide, edit the markdown in `content/`. Never edit
`src/generated/`.

### Non-obvious choices – do not "clean up"

- **`scripts/build-content.mjs` has a hand-written markdown parser and no
  dependencies.** This is deliberate. The guide uses exactly six block types,
  so a purpose-built parser is more predictable than a general markdown
  toolchain that would need constraining anyway, and it removes a whole class
  of version-drift risk from the build. Do not replace it with remark/unified
  without a specific reason.
- **`src/lib/Bidi.jsx` captures multi-word Latin runs as a single unit.**
  Isolating each word separately renders phrases like "Land acknowledgement"
  back-to-front in RTL. The regex looks over-complicated; it is not. There is a
  test case list in the file's comments – keep them passing.
- **Heading anchors are positional (`h-0`, `h-1`, …), not slugified.** Hebrew
  does not transliterate usefully. The trade-off is that inserting a heading
  mid-chapter shifts the anchors below it and breaks previously shared deep
  links. Accepted knowingly; prefer appending headings where practical.

## Intentional decisions – do not revert without asking

- **No backend, no accounts, no Firebase, no Netlify.** There is no API key,
  no user data and no login, so GitHub Pages is the correct target. Adding a
  backend is a Phase 2 decision, not a cleanup.
- **`HashRouter`, not `BrowserRouter`.** Pages serves static files; a deep
  link would 404 on refresh under BrowserRouter. Deep links matter here
  because every heading is shareable.
- **Only one localStorage key** (`ic:lastRead:v1`). Everything else on the site
  is static by design. Do not add tracking, progress state or saved notes to
  Phase 1.
- **No analytics, no third-party requests, self-hosted fonts.** A privacy
  decision, and what makes full offline support possible.
- **`registerType: 'autoUpdate'`** rather than a prompt banner. The spec
  originally called for an update banner, which needs the
  `virtual:pwa-register/react` module; since the build could not be tested
  here, the safer option was chosen. Switching to a banner later is fine.
- **No PDF generation.** The owner supplies the Word and PDF files directly.
  Explicitly decided – do not build an export feature.
- **The appendix is outside the numbered sequence.** It has no chapter number
  and `ArcRail` deliberately renders nothing for it. This is not a bug.
- **No META copy.** The site never describes its own structure ("14 chapters,
  ordered by…"). Page copy starts with content. See the copy rules in the
  spec.

## Commands

| Command | What it does |
|---|---|
| `npm run content` | Rebuilds `src/generated/` from `content/*.md` |
| `npm run dev` | Content build, then Vite dev server |
| `npm run build` | Prebuild (content) then production build to `dist/` |
| `npm run preview` | Serves the built `dist/` locally |

## Deployment

Push to `main` → `.github/workflows/deploy.yml` → build → GitHub Pages.

Automatic on push. Two things are manual and happen outside this repo:

1. Enabling Pages with **Source: GitHub Actions** (once, by the owner).
2. Committing `package-lock.json` – CI uses `npm ci`, which fails without it.
   Run `npm install` locally and commit the lockfile before the first push.

`vite.config.js` sets `base: '/interview-canada-he/'` to match the Pages path.
If the site moves to a custom domain, change it to `'/'`.
