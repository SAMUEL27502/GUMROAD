# GUMROAD

This repository hosts a custom **Gumroad profile landing page** ("Hormone Decoded"). The
site is a single, self-contained static HTML file — there is no build system, package
manager, backend, test suite, or dependency manifest.

## Cursor Cloud specific instructions

### What this project is
- The deliverable is a static, single-file HTML page (`profile.html`) that Gumroad
  embeds/injects as a seller's custom profile. It uses **Tailwind via CDN**
  (`https://cdn.tailwindcss.com`) and **Google Fonts**, so rendering styles/fonts requires
  outbound network access. The page is otherwise self-contained (inline CSS + inline JS).
- `profile.html` includes an embedded catalog JSON in `<script id="gumroad-data">`. The
  inline JS reads it to render product cards, powers category filtering, and a
  light/dark theme toggle persisted in `localStorage` (`hd-theme`).
- Note: on `main` the repo may only contain `README.md`. The actual `profile.html` work
  lands on feature branches (e.g. `cursor/hormone-decoded-*`). If `profile.html` is not in
  your working tree, check it out from the relevant feature branch (or use
  `git worktree add <dir> <branch>`).

### Running / developing
- There is nothing to install and no build step. Serve the directory containing
  `profile.html` with any static file server and open it in a browser, e.g.:
  - `python3 -m http.server 8000` then visit `http://localhost:8000/profile.html`.
- There are no lint or automated test commands in this repo. "Testing" a change means
  loading `profile.html` in a browser and visually verifying the hero, the rendered
  product catalog, category filtering, and the light/dark theme toggle.

### Gotchas
- Because Tailwind and fonts load from CDNs, an offline environment will render the page
  unstyled — this is expected, not a regression.
- Gumroad runs the HTML through a sanitizer; several commits exist specifically to keep the
  markup sanitizer-clean (e.g. dropping `<meta>`/`<title>`/`preconnect` tags and certain
  SVG attributes). Keep this in mind before re-adding such tags.
