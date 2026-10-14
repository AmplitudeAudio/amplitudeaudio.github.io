# Amplitude Audio SDK Website

This is the public repository for the website and blog hosted on https://amplitudeaudiosdk.com.

It is a static site built with [SvelteKit](https://svelte.dev/docs/kit) and [Svelte 5](https://svelte.dev), with [mdsvex](https://mdsvex.pngwing.com) for blog posts and [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for translations. It is deployed to GitHub Pages on every push to `main`.

## Getting started

Requires [Bun](https://bun.sh) 1.3 or later.

```bash
bun install
bun run dev
```

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `bun run dev`     | Start the dev server (draft posts are visible). |
| `bun run build`   | Build the static site into `build/`.            |
| `bun run preview` | Serve the production build locally.             |
| `bun run check`   | Type-check the project with `svelte-check`.     |
| `bun run lint`    | Check formatting (Prettier) and lint (ESLint).  |
| `bun run format`  | Format every file with Prettier.                |

## Project layout

```text
messages/            Translations, one JSON file per locale
project.inlang/      Paraglide project settings (locales, base locale)
src/
  lib/
    components/      Header, footer, icons and the home page sections
    sim/             Canvas rendering for the hero and the feature demos
    i18n.ts          Localized links and date formatting
    posts.ts         Blog post loading
    site.ts          Site metadata and external links
  posts/             Blog posts (Markdown)
  routes/            Pages
static/              Files copied as-is (favicons, logos, robots.txt)
```

## Writing a blog post

Add a Markdown file to `src/posts/`. The file name becomes the URL (`src/posts/my-post.md` is served at `/blog/my-post/`).

```md
---
title: My Post
description: One sentence for the post list and social cards.
date: 2026-10-13
author: Amplitude Audio
draft: true
---

Your content here.
```

Drafts show up with `bun run dev` and are left out of production builds. Remove `draft: true` to publish. Posts are written in English and shown as-is in every locale.

## Translations

The site is available in English (default, served at `/`), French (`/fr/`), Japanese (`/ja/`) and Chinese (`/zh/`).

UI text lives in `messages/<locale>.json`. To change a string, edit it in every locale file. To add a string, add the same key to every file and use it in a component:

```svelte
<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
</script>

<h2>{m.my_new_key()}</h2>
```

Use `localHref('/path/')` from `#lib/i18n.ts` for internal links so they keep the current locale.

To add a locale, add it to `locales` in `project.inlang/settings.json`, create `messages/<locale>.json`, and add its display name to `localeNames` in `src/lib/i18n.ts`.

## Deployment

`.github/workflows/pages.yml` type-checks, builds and deploys `build/` to GitHub Pages on every push to `main`.
