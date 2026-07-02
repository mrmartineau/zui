# ZUI for Raycast

A [Raycast](https://www.raycast.com) extension for [ZUI](https://zui.zander.wtf) — search the docs, CSS classes, design tokens, and per-framework component snippets without leaving your keyboard.

## Commands

- **Search Documentation** — fuzzy-search every docs page (components, tokens, utilities, guides, integrations) and open it at [zui.zander.wtf](https://zui.zander.wtf).
- **Search CSS Classes** — every `zui-*` component class and utility class. `⏎` copies the class name, `⌘⏎` pastes it straight into the frontmost app, `⌘D` opens the relevant docs page.
- **Search Design Tokens** — every CSS custom property, filterable by category, with colour swatches for colour tokens. `⏎` copies `var(--token)`, `⌘⇧C` copies the bare token name, `⌘⇧V` copies the raw value.
- **Search Snippets** — every `<Demo>` example from the component docs, with a framework switcher for **HTML, React, Astro, Solid, Svelte, and Vue**. The code preview shows in the detail pane; `⏎` copies the snippet, `⌘⏎` pastes it.

## How the data works

The extension ships with pregenerated JSON in `src/data/`, built by `scripts/generate-data.ts`:

- **Classes and tokens** come from the [`vscode-zui`](../vscode-zui) extension's `manifest.json` — the same manifest that powers VS Code IntelliSense, regenerated on every `@mrmartineau/zui` build. Entries are enriched with docs URLs.
- **Docs pages** are indexed from the frontmatter of `docs/src/pages/**/*.mdx`.
- **Snippets** are parsed from the `<Demo html={…} react={…} …>` blocks in the docs MDX pages, so every example on the docs site is available in every framework it's documented in.

Regenerate after changing the CSS or docs:

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

The `author` field in `package.json` must match your Raycast account handle.
