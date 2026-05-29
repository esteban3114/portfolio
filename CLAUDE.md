# CLAUDE.md — Portfolio Esteban (este-dls.com)

> Fichier de contexte lu automatiquement par Claude Code.
> Maintiens ce fichier à jour après chaque session importante.

---

## 🧑 Profil du projet

| Champ | Valeur |
|---|---|
| Propriétaire | Esteban, 18 ans, France |
| Site | https://este-dls.com |
| Repo | https://github.com/esteban3114/portfolio |
| Stack | HTML + JSX (React CDN) + Babel standalone |
| Déploiement | GitHub Pages (push → master déclenche le deploy) |
| CI | GitHub Actions : `pages.yml` (deploy) + `playwright.yml` (tests) |

---

## 🗂️ Architecture des fichiers

```
portfolio/
├── index.html          ← Point d'entrée : styles CSS inline + chargement React/Babel
├── app.jsx             ← Logique principale React (sections, typewriter, boot, navigation)
├── tweaks-panel.jsx    ← Panel de personnalisation (accent, scanlines, vitesse)
├── CNAME               ← "este-dls.com"
├── package.json        ← npm, type: module, scripts: test / serve
├── playwright.config.js← baseURL: https://este-dls.com
├── tests/
│   └── example.spec.js ← Tests Playwright (boot, navigation, contenu, mobile)
└── .github/workflows/
    ├── pages.yml       ← Deploy GitHub Pages sur push master
    └── playwright.yml  ← CI tests Playwright
```

---

## 🎨 Design system

Le CSS est **entièrement inline dans `index.html`**. Variables principales :

```css
--bg: #0a0a0a
--panel: #0d0d0d
--accent: #e8a838      /* couleur principale, modifiable via tweaks */
--accent-deep: #c9871f
--label: #c7c7c7
--dim: #6d6d6d
--pos: #00ff9f          /* vert succès */
--neg: #ff3b3b          /* rouge erreur */
--blue: #5b8fe6
--typespeed: 14ms
```

Typographie : **IBM Plex Mono** (Google Fonts). Thème : terminal Bloomberg/trading.

---

## 🧩 Architecture de `app.jsx`

### Données
```js
const PROFILE = { ticker, name, age, location, status, focus, github, email }

const SECTIONS = { WHO, PROJECTS, STACK, CONTACT }
// Chaque section a : code, title, lines() → tableau de segments

const NEWS = [...]   // Flux d'actualités bas de page (ticker rotatif)
```

### Helpers de contenu
```js
seg(text, class)             // crée un segment coloré
row(num, label, value, vclass) // ligne de tableau terminal
head(txt)                    // titre de section
blank()                      // ligne vide
note(txt)                    // texte dim
```

### Composants principaux
| Composant | Rôle |
|---|---|
| `Boot` | Séquence de démarrage animée (typewriter ligne par ligne) |
| `useTypewriter(lines, speedMs, deps)` | Hook : retourne `{ count, done }` |
| `TypedLines({ lines, count, done })` | Rendu du texte avec curseur clignotant |
| `Screen({ code, speed })` | Zone de contenu principal |
| `FunctionBar` | Barre de touches F (décorative) |
| `CommandBar` | Barre de commandes (décorative) |
| `TickerLines` | Ticker avec horloge live |
| `TitleBand` | Bande titre section active |
| `SubBar` | Sous-barre nom/rôle |
| `Tabs` | Navigation onglets (WHO/PROJECTS/STACK/CONTACT) |
| `NewsBlock` | Flux d'actualités rotatif |
| `HintBar` | Barre de suggestions bas |
| `TweaksPanel` | Panel overlay de personnalisation |

### Navigation clavier
- `1` `2` `3` `4` → sections directes
- `←` `→` → navigation cyclique
- `T` → ouvre/ferme le TweaksPanel

### Persistance
```js
sessionStorage.getItem("estbn_booted")  // boot déjà joué cette session
localStorage.getItem("estbn_section")   // dernière section visitée
```

---

## 🔗 Liens cliquables (CONTACT)

Les segments avec `href` sont rendus en `<a>` dans `TypedLines` :
```js
{ t: PROFILE.github, c: "blueval", href: "https://github.com/esteban3114", target: "_blank" }
{ t: PROFILE.email,  c: "blueval", href: "mailto:este3112008@gmail.com" }
```

---

## 🧪 Tests Playwright

Fichier : `tests/example.spec.js` — cible `https://este-dls.com`

Groupes de tests :
- **Boot screen** : titre, affichage `.boot`, branding, clic `<GO>`
- **Navigation** : 4 onglets, switch par clic, raccourcis `1-4`, flèches
- **Tweaks panel** : ouverture via `T`
- **Contenu** : nom/localisation WHO, github/email CONTACT
- **Mobile** : pas de scroll horizontal (viewport 390px)

---

## ⚙️ Conventions de code

- **Pas de build step** — tout est statique, servi directement par GitHub Pages
- **CSS inline dans index.html** — ne pas créer de fichier `.css` séparé
- **Pas de npm install de libs** — React/Babel chargés via CDN unpkg avec SRI
- **JSX dans `.jsx`** — transpilé par Babel standalone côté client
- **`type: "module"`** dans package.json — pour compatibilité ES imports Playwright
- **Commits en anglais** avec préfixe conventionnel : `fix:` `feat:` `chore:`

---

## 📌 État actuel (mis à jour : 2026-05-29)

### ✅ Fait
- Design terminal Bloomberg complet (boot, tabs, typewriter, ticker, news)
- Curseur clignotant persistant après fin d'animation typewriter
- Liens cliquables GitHub + email dans CONTACT
- Tests Playwright couvrant le vrai portfolio
- CI/CD GitHub Actions opérationnel
- Responsive mobile (640px)

### 🔧 Pistes d'amélioration possibles
- Ajouter plus de projets dans la section PROJECTS
- Réduire le poids de Babel standalone (passer à un build step Vite/esbuild)
- Ajouter une section SKILLS ou EXPERIENCE plus détaillée
- Tests E2E plus exhaustifs (tweaks, persistance localStorage)
