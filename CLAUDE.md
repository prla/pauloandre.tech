# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Paulo André's personal landing page (pauloandre.tech) — a single static HTML file. It has one job: get the right visitor (CTOs, VPs of Engineering, technical founders) to think "I want to talk to this person" and book a call.

Positioning: **"The hardest problems in technology leadership don't have playbooks."** Not a consulting site — no packages, offers, methodology, or feature sections. The writing is the interface. Deletion is the strategy; resist adding sections.

No build step, no framework, no package manager.

## Repository contents

- `index.html` — the entire site: markup, an inline `<style>` block, and an inline `<script>` block. All CSS and JS live here.
- `images/` — static assets. `paulo.jpg` is the optimized portrait used by the page and OG tags (900px, ~100KB). Keep images web-optimized; don't commit multi-MB originals.
- `404.html` — custom error page, auto-served by Netlify (zero-config, filename convention) with a real 404 status for any nonexistent path.
- `llms.txt` — machine-readable site summary for AI crawlers/agents.
- `netlify/edge-functions/markdown-negotiation.js` — the one piece of server-side logic in this repo. Implements [acceptmarkdown.com](https://acceptmarkdown.com)-style content negotiation: on `/` and on any 404, parses `Accept` by q-value and serves `text/markdown` to requests that prefer it over `text/html`, `406` to requests that accept neither, and the normal HTML otherwise — always with `Vary: Accept, Accept-Encoding`. `HOME_MARKDOWN` in that file is a hand-written markdown rendering of the homepage copy; **it is not generated from `index.html`, so update both when the hero copy changes.** Zero-config (Netlify auto-discovers the file via the exported `config.path`), no bundler, no `netlify.toml` needed.

There is no `package.json`, no `node_modules`, no test suite, no CI, no bundler. Editing the site means editing `index.html` directly. The edge function above is deliberately the sole exception to "no server-side logic" — keep it that way; don't grow it into a framework.

## Previewing changes

Open the file in a browser:

```bash
open index.html
```

Or serve locally if you need a real HTTP origin (e.g., to test the Google Fonts preconnect or an asset path):

```bash
python3 -m http.server 8000
```

## Page structure

One desktop viewport, roughly. In order:

1. **Header** — wordmark left; Hagakure / LinkedIn / Talk to me + a light/dark theme toggle right.
2. **Hero** — headline, four short paragraphs, an emphasis line, a single CTA, and the portrait alongside.
3. **Writing line** — one paragraph pointing to Hagakure with a "Read Hagakure →" link.
4. **Footer** — "Paulo André · Berlin" and LinkedIn / Hagakure.

## Design conventions

Extremely restrained, editorial rather than SaaS. Preserve this when editing:

- **Two fonts, narrow roles**: `Instrument Sans` is the workhorse for everything. `Google Sans Code` is reserved exclusively for the hero `<h1>` to set the page's signature; do not introduce it elsewhere.
- **Color tokens** are CSS custom properties on `:root` (with a `[data-theme="dark"]` override) — `--ink`, `--ink-soft`, `--bg`, `--rule`, `--blue`, `--copper`, `--portrait-bg`. Use these, never hardcode hex values.
- **Editorial measure**: body copy stays within `--measure` (~672px). Strong contrast — body text is `--ink`, not faint gray.
- **One dominant action**: the "Let's talk →" CTA in the hero. A second, quiet "Talk to me" in the header is fine. Clean text/underline treatment, never a big colored SaaS button.
- No gradients, cards, feature grids, icons (except the theme-toggle glyph), stock imagery, or animation beyond subtle hover states.

## Integrations (don't break these)

- **Booking link**: `https://calendar.app.google/jKuzeph3c6ndobgM8` — every CTA points here. Clicks fire a PostHog `book_call_clicked` event via the `data-source` attribute.
- **Analytics**: PostHog, initialized inline (`api_host: t.pauloandre.tech`). Also tracks `theme_toggled`.
- **Theme toggle**: light/dark, persisted to `localStorage`, respects `prefers-color-scheme`. An inline `<head>` script sets the theme before paint to avoid a flash.
- **External links**: LinkedIn (`/in/paulorlandre/`) and Hagakure (`hagakure.substack.com`).

## Requirements when editing

- Excellent Lighthouse performance, semantic HTML, accessible contrast and focus states.
- Basic SEO + OpenGraph metadata kept in sync with positioning.
- No unnecessary JS or dependencies. Keep it small and maintainable.

## Content tone

Paulo's voice: direct, no jargon, no frameworks-speak, short sentences. If you rewrite copy, match that — no filler like "leverage," "synergy," or hedging phrases.
