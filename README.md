# Academic Portfolio

A static academic personal website built with Astro, React 19, Astryx Stone, Markdoc, Pagefind, and local-mode Keystatic. Public routes cover Home, About, Publications, Talks, Blog, Projects, Services, and an optional CV page; page visibility is managed in Site settings.

## Requirements

- Node.js `>=22.13.0` (CI uses Node.js 24)
- npm with lockfile support

## Development

```sh
npm ci
npm run dev
```

Open `http://localhost:4321` for the website and `http://localhost:4321/keystatic` for the local content editor. Keystatic stores singleton and collection data under `src/content/` and uploaded assets under `public/`.

The public site continues to build when a singleton or collection is empty and displays an appropriate empty state.

## Search preview

Pagefind indexes the production HTML, so search is unavailable during the regular Astro development server. Build the index and run a searchable local preview with:

```sh
npm run preview:search
```

## Validation

```sh
npm run check
npm test
npm run format:check
npm run build
npm run astryx -- doctor
```

`npm run build` sets `SKIP_KEYSTATIC=true`, so the static `dist/` output contains neither the Keystatic admin UI nor its API routes.

## Astryx

Use the project-local CLI, for example:

```sh
npm run astryx -- search "publication layout" --dense
npm run astryx -- build "academic publication page" --dense
npm run astryx -- component Card --dense
npm run astryx -- doctor
```

Search the Astryx library before adding or hand-building a UI element. The project-local CLI is the source of truth; the remote Astryx MCP (`https://astryx.atmeta.com/mcp`) is optional and read-only.

## Git workflow and deployment

Feature work is developed on `template` and merged into `main` through a pull request. Content-only updates made through Keystatic are committed directly to `main`. A push to `main` runs CI and deploys the static `dist/` output to GitHub Pages.
