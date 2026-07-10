<div align="center">
  <img src="https://github.com/mrmartineau/zui/raw/main/zui-readme.png" alt="ZUI" width="400" />
</div>

# @mrmartineau/zui-theme

[![npm](https://img.shields.io/npm/v/@mrmartineau/zui-theme)](https://www.npmjs.com/package/@mrmartineau/zui-theme)

An Astro documentation theme built on [ZUI](https://github.com/mrmartineau/zui).
It ships the layout, navigation, and content components that power the ZUI docs
site, so you can spin up a matching docs site for any of your own packages.

- **Configurable layout** — header, collapsible sidebar, table of contents,
  footer, light/dark + colour theme switchers.
- **File-based navigation** — the sidebar and footer build themselves from your
  `src/pages` directory. No nav config to maintain.
- **Docs components** — `Demo` (live preview + tabbed source), `CopyCode`,
  `TokenGrid`/`TokenRow`, and more.
- **Source-only** — ships `.astro`/`.ts`/`.css` directly, so there's no build
  step and your bundler tree-shakes what you use.

## Quick start

Scaffold a new docs site with the included template:

```sh
npx @mrmartineau/zui-theme create-zui-docs my-docs
cd my-docs
npm install
npm run dev
```

Then edit `src/site.config.ts` and start adding pages under `src/pages/`.

## Manual setup

Install the theme alongside `zui` and Astro's MDX integration:

```sh
npm install @mrmartineau/zui-theme @mrmartineau/zui
npx astro add mdx
```

Create a thin layout that runs the page globs (they must run from *your*
project so the paths resolve against your `src/pages`) and forwards them to the
theme's `DocsLayout`:

```astro
---
// src/layouts/Layout.astro
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

Add a site config:

```ts
// src/site.config.ts
import type { SiteConfig } from '@mrmartineau/zui-theme/nav'

export const site: SiteConfig = {
  title: 'My Package',
  description: 'Documentation for My Package.',
  version: '0.1.0',
  author: 'Your Name',
  authorHref: 'https://example.com',
  social: [
    { href: 'https://github.com/you/my-package', icon: 'github-logo', label: 'Repo' },
  ],
}
```

Now write pages. Every `.mdx` file under `src/pages/<section>/` becomes a sidebar
entry, grouped by its top-level folder:

```mdx
---
layout: ../../layouts/Layout.astro
title: Getting started
order: 1
---

import { Demo } from '@mrmartineau/zui-theme/astro'

## Usage

<Demo html={`<button class="zui-button">Click me</button>`}>
  <button class="zui-button">Click me</button>
</Demo>
```

## Page conventions

| Frontmatter    | Where         | Effect                                                  |
| -------------- | ------------- | ------------------------------------------------------- |
| `title`        | every page    | Sidebar label, page heading, and `<title>`.             |
| `description`  | every page    | Sub-heading under the title and `<meta description>`.   |
| `order`        | any page      | Position within its section's sidebar list (asc).       |
| `sectionOrder` | `index.mdx`   | Position of the whole section in the sidebar/footer.    |

## Exports

| Specifier                       | Contents                                              |
| ------------------------------- | ---------------------------------------------------- |
| `@mrmartineau/zui-theme/astro`  | All `.astro` components + nav helpers and types.      |
| `@mrmartineau/zui-theme/astro/*`| Individual `.astro` components by path.               |
| `@mrmartineau/zui-theme/nav`    | `buildSidebarSections`, `buildFooterSections`, types. |
| `@mrmartineau/zui-theme/css`    | Global documentation styles (imported by DocsLayout). |

### Components

`DocsLayout`, `BaseLayout`, `Sidebar`, `TableOfContents`, `Demo`, `DemoPreview`,
`CopyCode`, `TokenGrid`, `TokenRow`, `Section`, `Subtitle`, `DarkModeSwitcher`,
`MiniThemeSwitcher`, `ThemeSwitcher`.

`BaseLayout` is the header + footer shell without the sidebar or table of
contents — use it for homepages and landing pages. It takes the same props as
`DocsLayout`, except `sections` is optional (it only feeds the mobile nav
dialog) and `currentPath` is optional too (defaults to `Astro.url.pathname`).
You provide your own `<main>` wrapper.

### Helpers

- `buildSidebarSections(pages, options?)` — group an `import.meta.glob` of pages
  into sorted sidebar sections. `options.append` adds extra (non-page) links to
  a section by heading, e.g. a hand-written Changelog page.
- `buildFooterSections(indexPages)` — build footer section links from a glob of
  section `index.mdx` files.

## `SiteConfig`

| Field               | Default        | Description                                  |
| ------------------- | -------------- | -------------------------------------------- |
| `title`             | —              | Brand name; logo + `<title>` prefix.         |
| `logo`              | `title`        | Logo text override.                          |
| `description`       | —              | Default meta description.                    |
| `version`           | —              | Shown as a header badge + footer.            |
| `versionHref`       | `/changelog`   | Where the version badge links.               |
| `author`            | —              | Footer credit.                               |
| `authorHref`        | —              | Link for the author credit.                  |
| `social`            | `[]`           | Header + footer links (GitHub, npm, …).      |
| `phosphor`          | `true`         | Load Phosphor Icons from the CDN.            |
| `phosphorVersion`   | `2.1.2`        | Phosphor web package version for the CDN.    |
| `themeSwitcher`     | `true`         | Floating theme builder.                      |
| `miniThemeSwitcher` | `true`         | Header colour-theme dots.                    |
| `miniThemes`        | ZUI palette    | Colours for the mini switcher.               |
| `colorSchemeToggle` | `true`         | Light/dark/system toggle.                    |

## License

MIT
