# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Paulo André's personal landing page (pauloandre.tech) — a single static HTML file pitching a "2-Day Diagnostic" consulting offer to VPs of Engineering and CTOs. No build step, no framework, no package manager.

## Repository contents

- `index.html` — the entire site: markup + inline `<style>` block. All CSS lives here.
- `images/` — static assets (currently just `paulo.png`).

There is no `package.json`, no `node_modules`, no test suite, no CI. Editing the site means editing `index.html` directly.

## Previewing changes

Open the file in a browser:

```bash
open index.html
```

Or serve locally if you need a real HTTP origin (e.g., to test the Google Fonts preconnect or a future asset path):

```bash
python3 -m http.server 8000
```

## Editorial / design conventions

The page uses a deliberate editorial system. Preserve it when adding sections:

- **Two fonts, narrow roles**: `Instrument Sans` is the workhorse for everything — body, headings, wordmark, footer, italic taglines, the lot. `Google Sans Code` is reserved exclusively for the hero `<h1>` to set the page's signature; do not introduce it elsewhere.
- **Color tokens** are CSS custom properties on `:root` — `--ink`, `--ink-soft`, `--cream`, `--blue`, `--copper`, `--rule`. Use these, don't hardcode hex values.
- **Section rhythm**: each section opens with a numbered eyebrow (`<p class="eyebrow"><span class="num">0X</span> Label</p>`) — keep the numbering sequential when adding/reordering sections.
- **Two-column editorial grid** (`.two-col`) — left column is a 280px label/eyebrow rail, right column is content. The mobile breakpoint at 720px collapses it.
- **Accent colors carry meaning**: copper (`--copper`) for "what I do / who I am", blue (`--blue`) for "the problem". Bullet variants like `.bullet-list--blue` swap the dot color.
- Cream-background sections (`.cream` / `#offer`, `#about`) alternate with white to break up the page — keep that alternation if adding sections.

## Content tone

The copy is written in Paulo's voice: direct, no jargon, no frameworks-speak, short sentences. If you're rewriting copy, match that — don't add filler like "leverage," "synergy," or hedging phrases.
