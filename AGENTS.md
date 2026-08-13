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

Astryx v0.3.0 · 155 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:

1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:

- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
- Dense data = rows (Table, List/Item) edge-to-edge — never Card-wrapped list items. Card = dashboard widgets, galleries, settings groups only.
- Status → StatusDot/Token; Badge only for counts and enumerated states, never decoration.
- Custom styling: component props first; else style/className with tokens — var(--color-_|--spacing-_|--radius-\*). No raw hex/px. (No StyleX/Tailwind compiler here — don't use xstyle/utility classes.)
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-\* in :root.
- SELF-CHECK before you finish: re-read the file and replace any raw <div>/<span> layout, imported .css/@apply, or hardcoded value (#hex, 16px) with the component or a token (var(--color-_|--spacing-_|…)). If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

MORE CLI:
search "<query>" find any component / hook / doc / template / block
component --list 155 components by category
template --list page + block recipes
docs <topic> color, elevation, icons, illustrations, internationalization, layout, migration, motion, principles, shape, spacing, styling, theme, tokens, typography
swizzle <Name> eject component source for deep customization
upgrade --apply run after any @astryxdesign/core bump

<!-- ASTRYX:END -->
