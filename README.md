<div align="center">

# MySQL2PG Web

**High-Performance MySQL → PostgreSQL Migration Tool · Product Website**

[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Go](https://img.shields.io/badge/Go-1.24+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)](LICENSE)

English | [中文](README_CN.md)

</div>

---

## 📋 Overview

MySQL2PG Web is the official product website for [MySQL2PG](https://github.com/xfg0218/MySQL2PG) — a high-performance database migration tool.

The site is built with **Vue 3 + Vite** on the frontend and **Golang** on the backend, featuring **Vue Router** multi-page navigation, **dark/light theme switching**, and **Chinese/English bilingual support**.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🧭 Vue Router | Multi-page navigation (`/`, `/services`, `/contact`, `/faq`) with lazy-loaded route chunks |
| 🌓 Theme Toggle | One-click dark/light mode switch, driven by CSS custom properties, preference persisted to localStorage |
| 🌐 Bilingual Support | Full Chinese/English translation with real-time content switching across all sections, preference saved to localStorage |
| 🎞 Scroll Animations | IntersectionObserver + MutationObserver-powered fade-in animations with 2s fallback for reliability |
| 📊 Number Counters | Scroll-triggered counter animations in the metrics section |
| 📱 Responsive Layout | Adaptive grid layouts for desktop, tablet, and mobile |
| 🍔 Mobile Navigation | Hamburger menu with slide-down panel, route-aware auto-close, overlay dismiss |
| 🔗 Social Sharing | Open Graph + Twitter Card meta tags with branded 1200×630 share image |
| 🔍 FAQ Search & Filter | Real-time keyword search + 5-category tab filtering across 15 questions |
| 💨 Cache Strategy | `no-cache` for index.html, `immutable` for hashed assets — zero stale-page issues |

### Website Sections

| Section | Route | Description |
|---------|-------|-------------|
| Hero | `/` | Product positioning + core stats (100% type mapping / 100% index mapping / 100% user mapping / 100% privilege mapping) |
| Pain Points | `/` | 8 cards showcasing the limitations of traditional DTS tools |
| Competitive Landscape | `/` | 4-column comparison table (MySQL2PG vs pgloader vs AWS DMS vs EDB MTK), 9 feature dimensions with ✓ / ~ / — three-state indicators |
| Core Features | `/` | 8 feature cards (schema/data/views/indexes/functions/privileges/validation/MPP) |
| Architecture | `/` | 5-stage pipeline visualization: MySQL Source → SQL Parser → Type Mapping Engine → Compatibility Validator → PG Generator |
| SQL Conversion Demo | `/` | 6 Before/After code comparisons (table/index/function/view/user/privilege) with tab switching + syntax highlighting |
| Report Preview | `/` | Simulated browser window showing report content (stats summary + risk alerts + validation results) |
| Pre-migration Assessment | `/` | 4 risk category cards (schema/functions/data volume/privileges) with green/amber severity indicators |
| Security & Data Safety | `/` | 3 security guarantee cards (credential security / transport encryption / zero source modification) |
| Metrics | `/` | 4 animated counters (sync speed / accuracy / full-auto conversion rate / concurrency boost) |
| Migration Flow | `/` | 8-step card-based pipeline + summary statistics |
| Compatibility | `/` | MySQL 5.7~9.0+ / PostgreSQL 12~18 version matrix |
| Quick Start | `/` | 3-step setup with syntax-highlighted command examples |
| Editions & Services | `/services` | Standalone page — open source vs commercial edition comparison with feature matrix |
| Contact | `/contact` | Standalone page — GitHub Issues / email / WeChat / documentation channels |
| FAQ | `/faq` | Standalone page — 15 questions across 5 categories (General / Type Conversion / Performance / Security & Ops / Advanced), with real-time search and category tab filtering |

---

## 🏗 Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend Framework | Vue 3 | Composition API + `<script setup>` |
| Build Tool | Vite 8 | Lightning-fast HMR development experience |
| Router | Vue Router 4 | HTML5 history mode, lazy-loaded page chunks |
| Backend Server | Go 1.24+ | Static file serving + SPA fallback routing |
| Styling | Vanilla CSS | CSS custom properties + `color-mix()` + theme variables |
| State Management | Vue Composables | `useTheme` / `useLang`, zero third-party dependencies |
| Fonts | Inter + JetBrains Mono | Google Fonts |

---

## 📁 Project Structure

```
MySQL2PGWeb/
├── frontend/                      # Vue 3 + Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   │   ├── logo.svg           # App icon (stylized "2" with cyan→purple gradient)
│   │   │   ├── logo-full.svg      # Full logo with text + subtitle
│   │   │   └── style.css          # Global styles (dark/light themes + responsive)
│   │   ├── components/
│   │   │   ├── NavBar.vue         # Top navigation bar (logo + route links + toggles)
│   │   │   ├── HeroSection.vue    # Hero section
│   │   │   ├── PainPoints.vue     # Industry pain point cards
│   │   │   ├── Competitors.vue    # Competitive landscape table (4 columns, 3-state)
│   │   │   ├── Features.vue       # Core feature cards
│   │   │   ├── Architecture.vue   # Architecture pipeline diagram (5 stages)
│   │   │   ├── SqlDemo.vue        # SQL before/after conversion demo (tab switching)
│   │   │   ├── ReportPreview.vue  # Migration report preview (simulated browser window)
│   │   │   ├── Assessment.vue     # Pre-migration risk assessment cards
│   │   │   ├── Security.vue       # Security & data safety cards
│   │   │   ├── Metrics.vue        # Performance metrics (counter animation)
│   │   │   ├── FlowSteps.vue      # 8-step migration flow cards
│   │   │   ├── Versions.vue       # Version compatibility
│   │   │   ├── QuickStart.vue     # Quick start guide
│   │   │   ├── FAQ.vue            # FAQ accordion (native <details>/<summary>)
│   │   │   ├── Services.vue       # Open source vs commercial editions
│   │   │   ├── Contact.vue        # Contact channels
│   │   │   └── FooterBar.vue      # Footer
│   │   ├── composables/
│   │   │   ├── useTheme.js        # Theme toggle composable (dark/light + localStorage)
│   │   │   └── useLang.js         # i18n composable (zh/en + full translation dictionaries)
│   │   ├── router/
│   │   │   └── index.js           # Vue Router config (/, /services, /contact, /faq)
│   │   ├── views/
│   │   │   ├── HomePage.vue       # Home page (all main sections)
│   │   │   ├── ServicesPage.vue   # Services standalone page
│   │   │   ├── ContactPage.vue    # Contact standalone page
│   │   │   └── FAQPage.vue        # FAQ standalone page
│   │   ├── App.vue                # Root app (router-view + scroll animations + MutationObserver)
│   │   └── main.js                # Entry point
│   ├── dist/                      # Build output (generated by npm run build)
│   ├── public/
│   │   ├── favicon.svg            # Browser tab icon (same as logo.svg)
│   │   └── og-image.svg           # 1200×630 social sharing image (OG / Twitter Card)
│   ├── index.html                 # HTML template (with OG + Twitter Card meta tags)
│   ├── package.json
│   └── vite.config.js             # Vite configuration
├── server/                        # Golang backend
│   ├── main.go                    # HTTP server + SPA fallback + cache-control headers
│   └── go.mod
├── start.sh                       # Startup script (start/stop/restart/status + daemon mode)
├── Makefile                       # Build commands
├── mysql2pg-web                   # Go binary (generated by make build)
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Go** 1.24+

### One-Click Start (Recommended)

```bash
bash start.sh
```

The script automatically: checks environment → installs dependencies → builds frontend → compiles Go → starts server (default port 80).

Specify a custom port via environment variable:

```bash
PORT=8080 bash start.sh
```

### Background Daemon Mode

```bash
bash start.sh start     # Start in background (nohup)
bash start.sh stop      # Stop the running process
bash start.sh restart   # Restart
bash start.sh status    # Check running status
```

### Development Mode

```bash
# Install frontend dependencies (first time only)
cd frontend && npm install

# Start Vite dev server with HMR
make dev
# or
cd frontend && npm run dev
```

Visit `http://localhost:5173` to preview.

### Production Build

```bash
# Build frontend + compile Go server
make build
```

Build output:
- `frontend/dist/` — Static files built by Vite
- `mysql2pg-web` — Go binary

### Serve in Production

```bash
# Build and start (default port 80)
make serve

# Or start manually with a custom port
PORT=8080 ./mysql2pg-web
```

Visit `http://localhost` (or your custom port) to view the site.

### Cleanup

```bash
make clean    # Remove dist/, node_modules/, and the binary
```

---

## 🎨 Design Specifications

### Dark Theme (Default)

| Property | Value |
|----------|-------|
| Background | `#09090b` |
| Card Background | `#18181b` / `#1c1c20` |
| Accent (Amber Gold) | `#f59e0b` / `#fbbf24` |
| Success | `#22c55e` |
| Error | `#ef4444` |
| Navbar Background | `rgba(9, 9, 11, 0.8)` + backdrop blur |

### Light Theme

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Card Background | `#ffffff` (section-alt: `#f4f4f5`) |
| Accent (Amber Gold) | `#f59e0b` / `#fbbf24` (unchanged) |
| Border | `#e4e4e7` |
| Navbar Background | `rgba(255, 255, 255, 0.85)` + backdrop blur |

### Logo

| Property | Value |
|----------|-------|
| Icon | Rounded square with stylized "2" using cyan→purple gradient (`#06B6D4` → `#8B5CF6` → `#A855F7`) |
| Text | "MySQL**2**PG" with gradient "2" via `background-clip: text` |
| Full Version | `logo-full.svg` includes subtitle "MySQL to PostgreSQL Migration Tool" |

### Common

| Property | Value |
|----------|-------|
| Body Font | Inter 400/600/700/800 |
| Monospace Font | JetBrains Mono 400/700 |
| Border Radius | 12px (cards) / 8px (buttons/code blocks) |

---

## 🧩 Architecture

### Routing (Vue Router)

- `createWebHistory` HTML5 history mode with 4 routes: `/`, `/services`, `/contact`, `/faq`
- Standalone pages are lazy-loaded for code-splitting
- Go backend provides SPA fallback — all non-file routes serve `index.html`

### Theme Switching (useTheme)

- Toggles the `html.light` class via `document.documentElement.classList.toggle('light')`
- CSS variables are defined under `:root` for dark mode, overridden by `html.light` for light mode
- Preference is saved to `localStorage` and persists across page reloads

### Internationalization (useLang)

- Lightweight i18n built on Vue Composition API — no third-party library required
- `useLang()` returns a reactive `t` (current language translation object) and `lang` (current locale identifier)
- All components reference translations via `t.xxx` and update reactively on language switch

### Scroll Animations

- `App.vue` uses `IntersectionObserver` + `MutationObserver` to detect and animate `.reveal` elements
- MutationObserver watches for dynamically added DOM nodes (e.g., route transitions)
- 2-second fallback ensures all `.reveal` elements become visible even if observers fail

### Cache Strategy (Go Server)

- `index.html` → `Cache-Control: no-cache, no-store, must-revalidate` — always fetches the latest HTML
- `/assets/*` (hashed JS/CSS) → `Cache-Control: public, max-age=31536000, immutable` — permanent cache since Vite content-hashes filenames
- Other static files (favicon, og-image) → `Cache-Control: public, max-age=3600` — 1-hour cache
- Eliminates stale-page issues after redeployment without requiring users to hard-refresh

---

## 📝 Component Reference

| Component | Description |
|-----------|-------------|
| **NavBar** | Fixed top navigation with backdrop blur. SVG logo, route links, EN/中 toggle, ☀️/ toggle, GitHub link, Quick Start CTA. Mobile: hamburger menu (☰→✕ animation) with Teleport overlay panel, auto-close on route change |
| **HeroSection** | Full-viewport hero with gradient text heading and 4 core stats |
| **PainPoints** | 8 pain point cards showcasing limitations of traditional DTS tools |
| **Competitors** | 4-column competitive landscape table: MySQL2PG vs pgloader vs AWS DMS vs EDB MTK, 9 feature dimensions with three-state indicators (✓ full / ~ partial / — not supported) |
| **Features** | 8 feature cards (schema/data/views/indexes/functions/privileges/validation/MPP) with metric tags |
| **Architecture** | 5-stage pipeline visualization with responsive horizontal/vertical layout |
| **SqlDemo** | 6 SQL conversion pairs with tab switching, side-by-side MySQL → PostgreSQL syntax-highlighted code |
| **ReportPreview** | 4 report section cards + simulated browser window with stats summary + risk alert list |
| **Assessment** | 4 risk assessment cards with green/amber severity indicators and scores |
| **Security** | 3 security guarantee cards (credential security / transport encryption / zero source modification) |
| **Metrics** | 4 animated counters triggered by IntersectionObserver |
| **FlowSteps** | 8-step migration flow card grid + 3 summary statistics |
| **Versions** | MySQL / PostgreSQL version compatibility matrix |
| **QuickStart** | 3-step quick start cards with syntax-highlighted YAML config and shell commands |
| **Services** | Open source vs commercial edition comparison with feature matrix (standalone on `/services`) |
| **Contact** | 4 contact channel cards: GitHub Issues / email / WeChat / documentation (standalone on `/contact`) |
| **FAQ** | 15 questions across 5 categories with real-time search bar, pill-shaped category filter tabs (with counts), emoji category badges, and "no results" empty state. Dual-column grid, native `<details>`/`<summary>` accordion (standalone on `/faq`) |
| **FooterBar** | Minimal footer with GitHub link + License + copyright |

---

## 📄 License

[Apache-2.0](LICENSE)

---

<p align="center">
  Made with ❤️ for the <a href="https://github.com/xfg0218/MySQL2PG">MySQL2PG</a> project
</p>
