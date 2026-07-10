<div align="center">
  <img src="https://github.com/mrmartineau/zui/raw/main/zui-readme.png" alt="ZUI" width="400" />
</div>

# ZUI for Raycast

A [Raycast](https://www.raycast.com) extension for [ZUI](https://zui.zander.wtf) — search the docs, CSS classes, design tokens, and per-framework component snippets without leaving your keyboard.

## Commands

- **Search Documentation** — fuzzy-search every docs page (components, tokens, utilities, guides, integrations) and open it at [zui.zander.wtf](https://zui.zander.wtf).
- **Search CSS Classes** — every `zui-*` component class and utility class. `⏎` copies the class name, `⌘⏎` pastes it straight into the frontmost app, `⌘D` opens the relevant docs page.
- **Search Design Tokens** — every CSS custom property, filterable by category, with colour swatches for colour tokens. `⏎` copies `var(--token)`, `⌘⇧C` copies the bare token name, `⌘⇧V` copies the raw value.
- **Search Snippets** — every `<Demo>` example from the component docs, with a framework switcher for **HTML, React, Astro, Solid, Svelte, and Vue**. The code preview shows in the detail pane; `⏎` copies the snippet, `⌘⏎` pastes it.
- **Update ZUI Data** — fetch the latest reference data from the ZUI website on demand.

## How the data works

The extension fetches its reference data from the docs site at
[`https://zui.zander.wtf/api/reference.json`](https://zui.zander.wtf/api/reference.json),
so new components, classes, tokens, and snippets show up without republishing
the extension:

- The dataset is generated at docs-site build time by the shared builder in
  `docs/src/lib/reference-data.ts` — every docs deploy refreshes it.
- **Classes and tokens** come from the [`vscode-zui`](../vscode-zui) extension's `manifest.json` — the same manifest that powers VS Code IntelliSense, regenerated on every `@mrmartineau/zui` build. Entries are enriched with docs URLs.
- **Docs pages** are indexed from the frontmatter of `docs/src/pages/**/*.mdx`.
- **Snippets** are parsed from the `<Demo html={…} react={…} …>` blocks in the docs MDX pages, so every example on the docs site is available in every framework it's documented in.

Fetched data is cached for a day (Raycast `Cache`). Commands render instantly
from the cache and silently re-fetch when it's older than a day; `⌘R` in any
command or the **Update ZUI Data** command forces a refresh.

A snapshot in `src/data/reference.json` (built by `scripts/generate-data.ts`
from the same shared builder) ships with the extension as the offline/first-run
fallback. It isn't committed — it's generated on demand (along with the
vscode-zui manifest it depends on):

```sh
pnpm --filter zui run generate:data
```

(This runs automatically as part of `build`, `dev`, and `publish`.)

## Development

Raycast development requires macOS (or Windows) with the Raycast app installed.

```sh
pnpm install
pnpm --filter zui run dev   # regenerates data, then `ray develop`
```

`ray develop` hot-reloads the extension into Raycast as you edit.

## Publishing

To publish to the [Raycast Store](https://www.raycast.com/store):

```sh
pnpm --filter zui run publish
```

This regenerates the bundled data snapshot, then opens a pull request in the
[`raycast/extensions`](https://github.com/raycast/extensions) repository — the
extension goes live in the store once the Raycast team merges it. (Direct
uploads without a PR are only for private organisation extensions.)

The `author` field in `package.json` must match your Raycast account handle.

> **Note:** the ignore rule for the generated `src/data/reference.json` lives in
> the repo-root `.gitignore` on purpose. `ray publish` copies this directory —
> including any `.gitignore` in it — into the `raycast/extensions` fork and runs
> a plain `git add`, so a package-level ignore would silently drop the snapshot
> from the store submission.
