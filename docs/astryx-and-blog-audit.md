# Astryx upgrade and blog navigation audit

Reviewed on 2026-11-14. The dependency upgrade is followed by an implementation of the series navigation described below. Editor-owned content is unchanged.

## Upgrade

All six installed Astryx packages move from `0.6.0` to `0.7.16`: Core, CLI, Chocolate, Matcha, Neutral, and Stone. The version was checked against the npm registry's `latest` tag. Exact versions and the lockfile keep installations reproducible.

`npm run astryx -- upgrade --from 0.6.0 --apply` ran the applicable migrations and found no source changes necessary. It refreshed only the managed section of `AGENTS.md`.

Sources: the installed Core `CHANGELOG.md`, the project-local CLI, and the [upstream releases](https://github.com/meta/astryx/releases). Reproduce the inventory with `npm run astryx -- component --list --json`.

## Component inventory

The CLI catalog grows from 163 to 174 entries. Newly listed names are `Code`, `Drawer`, `DrawerHeader`, `DropdownMenuGroup`, `HStack`, `Heading`, `InfoTip`, `ScrollableArea`, `TableSelectionToolbar`, `Timer`, and `VStack`; no catalog names disappear. These are catalog additions, not all newly implemented components: this site already used `Heading`, `HStack`, and `VStack` before the upgrade.

| Existing use                            | Available improvements in the upgraded library                                        | Decision                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `Markdown` for blog articles            | Text-transform performance improvements, URL handling fixes, and list rendering fixes | Retain the component; dependency upgrade supplies the fixes.                 |
| `Outline` with `useOutlineFromMarkdown` | Scroll-spy consistency and keyboard/focus fixes                                       | Retain the Markdown hook, which shares the article parser and heading slugs. |
| `CommandPalette` for Pagefind search    | Search-source refresh and loading-state fixes                                         | Retain the current integration.                                              |
| `MobileNav`                             | Header sizing, narrow-screen width, modal keyboard and dismissal fixes                | Retain mobile navigation; a switch to `Drawer` is unnecessary.               |
| `Link`, `Text`, `Heading`               | Link truncation/disabled-state fixes and long-word wrapping improvements              | Existing uses receive library fixes without replacing the site layout.       |
| `Pagination` for Home news              | Input variant and input validation improvements                                       | Keep the existing news pagination behavior.                                  |

Potential additions are `InfoTip` for persistent explanatory help, `ScrollableArea` for bounded scrolling regions, and `Code` for standalone inline code. There is no current site requirement that justifies adding these solely because they are available. `Markdown` already handles article code.

`useOutlineFromDOM` is also discoverable in the new CLI. Its documentation explicitly recommends `useOutlineFromMarkdown` when the source is a Markdown string, as it is here; changing hooks would not improve this site's article outline.

## Blog navigation findings before implementation

The blog schema in `keystatic.config.ts` and `src/content.config.ts` contains title, excerpt, publication date, draft status, tags, cover, and article body. It has no series, ordering, previous-post, or next-post fields. The detail route renders tags, article content, and an in-page outline; it does not render links between articles. Tags and month filters in `BlogDirectory` group articles but do not establish a reading order.

This audit concerns available functionality. The `template` branch has no blog entries, so it cannot establish which editor-owned articles belong together.

The CLI's build/search results do not provide a dedicated article-series pager. `Pagination` takes a page number and an `onChange` callback; its API does not provide article destinations. For static cross-page navigation, use `Link` with real `href` values and `rel="prev"` / `rel="next"`, composed with `VStack`, `HStack` or `Grid` and `Text` inside a semantic `nav`. This works without client hydration and preserves opening links in a new tab.

## Implemented navigation using existing packages

The implementation adds a local Keystatic `blogSeries` collection with a title and an ordered array of `fields.relationship({ collection: 'blog', label: 'Post' })`. The installed Keystatic version already supports relationship fields, which store a referenced entry slug. An editor selects posts and arranges them in reading order in one place. Derive both neighboring links from this list, avoiding contradictory previous/next pointers stored on separate posts.

The Astro schema uses a Content Layer `glob()` loader for the series files. `src/lib/blog-series.ts` resolves series membership; `src/lib/collections.ts` supplies only published posts. The detail page receives the neighboring public article titles and URLs. Duplicate entries and membership in multiple series produce a clear validation error. Supporting multiple series later would require explicit navigation context.

Resolve destinations exclusively against `getPublishedPosts()`, so drafts, future-dated articles, and missing/deleted references cannot produce public titles or links. Preserve the relative order of remaining public posts. Omit the navigation for unassigned articles or series with only one public article; omit the absent side at the beginning/end. Missing series collections must continue to build successfully. Exclude the navigation from Pagefind article text with `data-pagefind-ignore`.

An alternative for fully independent manual links is two optional relationship fields on each article, `previousPost` and `nextPost`. This is smaller but requires editors to maintain reciprocal links and avoid self-links or cycles. An ordered series collection is the preferred model for coherent sequences.

The article footer uses Astryx `VStack`, `Text`, and `Link` inside a semantic `nav`, with no client hydration or additional dependencies. Automated tests cover series ordering, boundaries, duplicate membership, missing references, draft/future filtering, empty collections, and server-rendered accessible links. Publish the schema/UI feature through the integration-branch workflow first, then let editors populate series on `main` separately.
