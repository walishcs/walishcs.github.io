# Project instructions

## Scope and architecture

- This repository is a static academic website built with Astro, React 19, strict TypeScript, Astryx with CMS-selectable themes, Markdoc, and local-mode Keystatic.
- Public pages live in `src/pages/`; shared UI lives in `src/components/` and `src/layouts/`; content access belongs in `src/lib/`.
- Keystatic schemas are defined in `keystatic.config.ts`. Keep collection fields in sync with `src/content.config.ts`, which must continue to use Astro Content Layer `glob()` loaders.
- `old/` is a read-only archive of the previous website. Do not edit, import, copy, serve, or deploy anything from it.

## Content and UI rules

- Content is English and editor-owned. Do not add sample people, publications, posts, projects, services, news, images, or links.
- Missing singletons and empty collections must always build successfully and show a useful public empty state.
- News appears only on Home; do not add a public News route. CV is an optional public route controlled by `siteSettings.showCvPage`.
- Use Astryx components and semantic tokens. Never override Astryx color tokens or hard-code replacement theme colors.
- Load styles in this order: Astryx reset, Astryx core, supported theme CSS, then project CSS. Keep accessible focus states, keyboard operation, responsive layouts, and reduced-motion behavior.
- Keystatic remains `storage: { kind: 'local' }`. Never add cloud storage, authentication, or production admin routes without explicit approval.
- Google Analytics is optional and configured by `siteSettings.googleAnalyticsMeasurementId`; keep it production-only, and never emit manual page views alongside GA4 history-change measurement.

## Astryx AI workflow

- Use the checked-in CLI via `npm run astryx -- …`; it is the source of truth. The remote read-only MCP at `https://astryx.atmeta.com/mcp` is optional discovery support only.
- Before adding, replacing, or hand-building any UI element, search the Astryx component library with `npm run astryx -- search "<need>" --dense`, then inspect the selected component or template with the CLI. Use the library component when it fits.
- For UI work follow: `build --dense` → `template --dense` and/or `component --dense` → implementation → `doctor`. Prefer `--json` when consuming output programmatically.
- Preserve the Astryx-managed block in this file; update it with the CLI instead of editing its generated contents.

## Git workflow

- For feature updates (UI, components, routes, schemas, dependencies, configuration, or tooling), switch to `template` before making changes and keep the work on that branch. Commit and push completed feature work there, but do not open a pull request directly from `template` when its editor-owned content differs from `main`.
- To publish a feature, create a temporary integration branch from the current `origin/main`, cherry-pick only the feature commit(s) from `template`, then open a pull request from that integration branch to `main`. Merge only after CI succeeds, then delete the temporary branch. Never carry template content-removal commits into `main`.
- For content-only updates made through Keystatic, switch to the current `main` branch first. Commit and push the resulting content and uploaded-asset changes directly to `main`; do not put ordinary site content on `template`.
- If an intended content change also needs a schema, component, layout, route, configuration, or dependency change, publish the feature through the integration-branch flow first, then apply the editor-owned content separately on `main`.

## Commands and completion checks

- Use Node.js `>=22.13.0` (CI uses Node 24) and install with `npm ci`.
- Local editing: `npm run dev`; CMS: `http://localhost:4321/keystatic`.
- Before completion run `npm run check`, `npm test`, `npm run format:check`, `npm run build`, and `npm run astryx -- doctor`.
- A production build must not contain `old/`, `/keystatic`, Keystatic API routes, drafts, inactive services, or future-dated posts.

<!-- ASTRYX:START -->

Astryx v0.7.16 · 174 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:

1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
   Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.
   Before you deliver a build, run `astryx doctor --built <dir>`; don't deliver it if it fails.

RULES:

- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then tokens (var(--color-_|--spacing-_|--radius-\*)). No raw hex/px. No StyleX/Tailwind compiler here — don't use xstyle/utility classes directly. Some templates use StyleX and need a compiler plugin; see `astryx docs styling-overview`.
- THEMES: palettes and custom colors go through the theme, never :root overrides. To make or change a theme (colors, fonts, corners, spacing, a look from a picture), prefer the experimental theme editor over hand-written theme files: `astryx experimental theme editor new <name> --like neutral`, then `editor set <name> <thing> <value>` or `editor how "<what you want>"`; wire it with `astryx theme add <name>`; after each change look at it with `astryx experimental theme editor show <name> --png` and open the PNGs it writes (changes nothing in the app); a theme change is not done until you have looked at the pictures. In code, extend an imported theme to customize it; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any raw <div>/<span>, imported .css/@apply, or hardcoded #hex/px with the component or a token.

`astryx help` lists every command. Key ones beyond the workflow:
search "<query>" find any component / hook / doc / template
discover <words> integrations you could add
docs <topic> getting-started, principles, tokens, theme … (`astryx docs` lists all)
docs cli commands and API reference
docs authoring build an integration package, and every field it holds
upgrade --from <old version> --apply run after a dependency bump

<!-- ASTRYX:END -->
