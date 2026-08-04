# Academic Portfolio

A static academic personal website built with Astro, React 19, Astryx Stone, Markdoc, and Keystatic in local mode.

## Requirements

- Node.js 24 (minimum supported version: 22.13.0)
- npm 11 or later

## Development

```sh
npm ci
npm run dev
```

Open `http://localhost:4321` for the website and `http://localhost:4321/keystatic` for the local content editor. Keystatic writes content and uploaded images directly to this repository.

No starter content is included. Configure the three page singletons and add collection entries in Keystatic; the public website provides empty states until content exists.

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
npm run astryx -- --dense build "academic publication page"
npm run astryx -- --dense component Card
npm run astryx -- --json doctor
```

The CLI is the primary AI interface. The remote Astryx MCP (`https://astryx.atmeta.com/mcp`) is optional and read-only.

## Archive

The previous website is preserved unchanged in `old/`. It is not referenced by the new application and is excluded from deployment.
