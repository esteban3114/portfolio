# AGENTS.md — Portfolio Esteban (este-dls.com)

> Context file read automatically by Codex / OpenAI Codex agents.
> Keep this file updated after each significant session.

---

## Project overview

| Field | Value |
|---|---|
| Owner | Esteban, 18 y/o, France |
| Live site | https://este-dls.com |
| Repo | https://github.com/esteban3114/portfolio |
| Stack | Vanilla HTML + React 18 (CDN) + Babel standalone (no build step) |
| Deploy | GitHub Pages — push to `master` triggers auto-deploy |
| CI | GitHub Actions: `pages.yml` (deploy) + `playwright.yml` (E2E tests) |

---

## File structure

```
portfolio/
├── index.html          ← Entry point: inline CSS + React/Babel CDN scripts
├── app.jsx             ← Main React logic (sections, typewriter, navigation)
├── tweaks-panel.jsx    ← Settings overlay (accent color, scanlines, speed)
├── CNAME               ← "este-dls.com"
├── package.json        ← type: module, scripts: test / serve
├── playwright.config.js← baseURL: https://este-dls.com
├── tests/
│   └── example.spec.js ← Playwright E2E tests
└── .github/workflows/
    ├── pages.yml       ← GitHub Pages deploy workflow
    └── playwright.yml  ← CI test runner
```

---

## Design system (inline CSS in index.html)

```css
--bg: #0a0a0a
--accent: #e8a838      /* primary color — user-configurable via TweaksPanel */
--pos: #00ff9f          /* green / success */
--neg: #ff3b3b          /* red / error */
--blue: #5b8fe6
--dim: #6d6d6d
--label: #c7c7c7
```

Font: **IBM Plex Mono** (Google Fonts). Aesthetic: Bloomberg terminal / retro trading screen.

---

## app.jsx — key structures

### Data constants
```js
PROFILE = { ticker, name, age, location, status, focus, github, email }

SECTIONS = {
  WHO:      { code, title, lines: () => [...segments] }
  PROJECTS: { ... }
  STACK:    { ... }
  CONTACT:  { ... }   // github/email are clickable <a> elements
}

NEWS = [{ n, t, tag, txt }, ...]  // rotating bottom news ticker
```

### Segment helpers
```js
seg(text, cssClass)               // colored text segment
row(num, label, value, vclass)    // table row
head(txt)                         // section header
blank()                           // empty line
note(txt)                         // dimmed note
// Segments with { href } property are rendered as <a> tags in TypedLines
```

### Typewriter system
```js
useTypewriter(lines, speedMs, deps) → { count, done }
TypedLines({ lines, count, done })
// Cursor stays visible and blinking after animation completes (done=true)
// Fix: remaining === 0 at last line when done → force showCursor=true
```

### Navigation
- Tabs: WHO / PROJECTS / STACK / CONTACT
- Keys: `1`-`4` direct jump, `←`/`→` cycle, `T` toggle TweaksPanel
- Persistence: `sessionStorage` (boot), `localStorage` (active section)

---

## Coding conventions

- **No build step** — static files served directly by GitHub Pages
- **CSS stays inline** in `index.html` — do not create separate `.css` files
- **No new npm packages** — React 18.3.1 + Babel loaded via unpkg CDN with SRI
- **`type: "module"`** in package.json for ES import compatibility with Playwright
- **Commits in English** with conventional prefixes: `fix:` `feat:` `chore:`
- **Responsive**: mobile breakpoint at `max-width: 640px` in inline CSS

---

## Current state (updated: 2026-05-29)

### Done
- Full Bloomberg terminal design (boot sequence, tabs, typewriter, ticker, news feed)
- Persistent blinking cursor after typewriter animation finishes
- Clickable GitHub + email links in CONTACT section
- Playwright E2E tests covering the real portfolio (not template)
- GitHub Actions CI/CD operational
- Mobile responsive layout

### Possible improvements
- Add more projects to PROJECTS section
- Migrate from Babel standalone to a build step (Vite/esbuild) for performance
- More detailed SKILLS or EXPERIENCE section
- Extended E2E tests (tweaks panel, localStorage persistence)
