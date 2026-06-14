---
name: zui-theme
description: "Build a documentation site with @mrmartineau/zui-theme, an Astro docs theme built on ZUI. Use when scaffolding a new docs site or adding docs to an existing Astro project that should use DocsLayout, the file-based sidebar/TOC, the Demo component, and theme switchers. Triggers on: zui-theme, @mrmartineau/zui-theme, DocsLayout, buildSidebarSections, create-zui-docs, ZUI docs site."
user-invocable: true
---

# Building docs with @mrmartineau/zui-theme

`@mrmartineau/zui-theme` is a **source-only Astro docs theme** built on [ZUI](https://github.com/mrmartineau/zui). It ships the layout, file-based navigation, content components (live `Demo`s, code tabs, token tables), and theme switchers that power the ZUI docs — so you can stand up a matching docs site for any package.

- No build step — ships `.astro`/`.ts`/`.css` and resolves via package `exports`.
- The sidebar and footer build themselves from your `src/pages` directory; there is no nav config to maintain.
- Requires `@mrmartineau/zui` (peer) and `astro@^6`.

## New project (scaffold)

```sh
npx @mrmartineau/zui-theme create-zui-docs my-docs
cd my-docs
npm install
npm run dev
```

This copies a working starter (config, thin layout, example pages). Then edit `src/site.config.ts` and add pages under `src/pages/`.

## Existing project (manual integration)

### 1. Install

```sh
npm install @mrmartineau/zui-theme @mrmartineau/zui
npx astro add mdx
```

Add Shiki themes to `astro.config.mjs` so code blocks match the theme:

```js
import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      defaultColor: 'light-dark()',
      themes: { dark: 'rose-pine', light: 'rose-pine-dawn' },
    },
  },
})
```

### 2. Site config — `src/site.config.ts`

```ts
import type { SiteConfig } from '@mrmartineau/zui-theme/nav'

export const site: SiteConfig = {
  title: 'My Package',
  description: 'Documentation for My Package.',
  version: '0.1.0',
  author: 'Your Name',
  authorHref: 'https://example.com',
  social: [
    { href: 'https://github.com/you/my-package', icon: 'github-logo', label: 'Repo' },
    { href: 'https://www.npmjs.com/package/my-package', icon: 'package', ariaLabel: 'npm' },
  ],
}
```

### 3. Thin layout — `src/layouts/Layout.astro`

**This file is required and must live in your project.** `import.meta.glob` is resolved relative to the file that calls it, so the page globs have to run here (in your project), not inside the theme package. Keeping the layout at `src/layouts/Layout.astro` also lets every `.mdx` page reference it via `layout:` frontmatter.

```astro
---
import {
  DocsLayout,
  buildSidebarSections,
  buildFooterSections,
} from '@mrmartineau/zui-theme/astro'
import { site } from '../site.config'

interface Props { title?: string; description?: string }
// @ts-expect-error frontmatter passthrough
const { title, description } = (Astro.props.frontmatter ?? Astro.props) as Props

const pages = import.meta.glob('../pages/**/*.mdx', { eager: true })
const indexPages = import.meta.glob('../pages/*/index.mdx', { eager: true })

const sections = buildSidebarSections(pages)
const footerSections = buildFooterSections(indexPages)
---

<DocsLayout
  title={title}
  description={description}
  currentPath={Astro.url.pathname}
  site={site}
  sections={sections}
  footerSections={footerSections}
>
  <slot />
</DocsLayout>
```

`DocsLayout` imports `@mrmartineau/zui/css` and the theme's global styles itself — **don't import them again** in your pages.

Add a `public/favicon.svg` (DocsLayout links to `/favicon.svg`). Phosphor Icons load from the CDN by default (`site.phosphor: false` to disable).

### 4. Write pages

Every `.mdx` under `src/pages/<section>/` becomes a sidebar entry, grouped by its top-level folder. Use the theme's `Demo` for live examples with tabbed source:

```mdx
---
layout: ../../layouts/Layout.astro
title: Getting started
order: 1
description: Install and use the package.
---

import { Demo } from '@mrmartineau/zui-theme/astro'

## Usage

<Demo
  html={`<button class="zui-button">Click me</button>`}
  react={`import { Button } from '@mrmartineau/zui/react'\n\n<Button>Click me</Button>`}
>
  <button class="zui-button">Click me</button>
</Demo>
```

- Children of `<Demo>` are the live preview; pass `html`/`react`/`astro`/`solid`/`svelte`/`vue` for code tabs (only the ones you pass appear). Omit children for a code-only block.
- A section's `index.mdx` sets `sectionOrder` (section position) and appears at the top of its group.

## Page frontmatter

| Key            | Where         | Effect                                                |
| -------------- | ------------- | ----------------------------------------------------- |
| `layout`       | every page    | `../../layouts/Layout.astro`.                         |
| `title`        | every page    | Sidebar label, page heading, and `<title>`.           |
| `description`  | every page    | Sub-heading under the title + `<meta description>`.   |
| `order`        | any page      | Position within a section's sidebar list (ascending). |
| `sectionOrder` | `index.mdx`   | Position of the whole section in sidebar + footer.     |

## Imports

Import components and helpers (named) from the barrel:

```ts
import {
  DocsLayout, Sidebar, TableOfContents,
  Demo, DemoPreview, CopyCode, TokenGrid, TokenRow, Section, Subtitle,
  DarkModeSwitcher, MiniThemeSwitcher, ThemeSwitcher,
  buildSidebarSections, buildFooterSections,
} from '@mrmartineau/zui-theme/astro'
```

| Specifier                        | Contents                                              |
| -------------------------------- | ----------------------------------------------------- |
| `@mrmartineau/zui-theme/astro`   | All components + nav helpers and types.               |
| `@mrmartineau/zui-theme/astro/*` | Individual `.astro` components by path.               |
| `@mrmartineau/zui-theme/nav`     | `buildSidebarSections`, `buildFooterSections`, types. |
| `@mrmartineau/zui-theme/css`     | Global docs styles (imported by `DocsLayout`).        |

### Components

- **Layout/nav:** `DocsLayout` (the configurable shell), `Sidebar`, `TableOfContents`.
- **Content:** `Demo` (preview + code tabs), `DemoPreview` (preview box), `CopyCode` (click-to-copy inline code), `TokenGrid`/`TokenRow` (design-token tables), `Section`, `Subtitle`.
- **Theme controls:** `DarkModeSwitcher` (light/dark/system), `MiniThemeSwitcher` (colour dots), `ThemeSwitcher` (floating builder; `inline` prop for an embedded panel).

### Helpers

- `buildSidebarSections(pages, options?)` — group a `pages` glob into sorted sidebar sections. `options.append` adds non-page links to a section by heading, e.g. a hand-written changelog:

  ```ts
  buildSidebarSections(pages, {
    append: [{ heading: 'Guides', items: [{ href: '/changelog', label: 'Changelog' }] }],
  })
  ```

- `buildFooterSections(indexPages)` — footer section links from a glob of section `index.mdx` files.

## `SiteConfig`

| Field               | Default      | Description                                |
| ------------------- | ------------ | ------------------------------------------ |
| `title`             | —            | Brand name; logo + `<title>` prefix.       |
| `logo`              | `title`      | Logo text override.                        |
| `description`       | —            | Default meta description.                  |
| `version`           | —            | Header badge + footer.                     |
| `versionHref`       | `/changelog` | Where the version badge links.             |
| `author`            | —            | Footer credit.                             |
| `authorHref`        | —            | Author credit link.                        |
| `social`            | `[]`         | Header + footer links (`{ href, icon?, label?, ariaLabel? }`; `icon` is a Phosphor name like `github-logo`). |
| `phosphor`          | `true`       | Load Phosphor Icons from the CDN.          |
| `phosphorVersion`   | `2.1.2`      | Phosphor web package version for the CDN.  |
| `themeSwitcher`     | `true`       | Floating theme builder.                    |
| `miniThemeSwitcher` | `true`       | Header colour-theme dots.                  |
| `miniThemes`        | ZUI palette  | Colours for the mini switcher.             |
| `colorSchemeToggle` | `true`       | Light/dark/system toggle.                  |

## Section landing cards (optional)

The theme intentionally does **not** ship a `SectionCards` component, because it depends on a glob of your own pages. Add a local one (`src/components/SectionCards.astro`) that globs `../pages/**/*.mdx`, filters by section, and renders `zui-card` links — the scaffold template includes a ready-made copy.

## Key rules

1. **Keep `src/layouts/Layout.astro` in your project** and run the `import.meta.glob` calls there — globs are location-sensitive, and the local layout is what `.mdx` `layout:` frontmatter resolves to.
2. **Import named** from `@mrmartineau/zui-theme/astro` (e.g. `import { Demo } from '@mrmartineau/zui-theme/astro'`), matching how ZUI components are imported.
3. **Don't re-import CSS** — `DocsLayout` already pulls in `@mrmartineau/zui/css` and the theme styles.
4. **Configure, don't fork** — change branding/behaviour via `site.config.ts` (`SiteConfig`), and restyle by overriding ZUI tokens (`--color-theme`, `--font-body`, `--radius-scale`, …), not by editing the theme.
5. **`@mrmartineau/zui` is a peer dependency** — install it alongside the theme.
6. **Published package needs no Vite aliases.** Only when consuming the theme from source inside a monorepo (workspace/`file:` link) do you need `resolve.alias` entries pointing `@mrmartineau/zui-theme/astro|nav|css` at the source files (see the ZUI repo's `docs/astro.config.mjs`).
