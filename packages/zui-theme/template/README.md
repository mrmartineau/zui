# Docs site

A documentation site built with
[`@mrmartineau/zui-theme`](https://www.npmjs.com/package/@mrmartineau/zui-theme),
an Astro docs theme built on [ZUI](https://github.com/mrmartineau/zui).

## Commands

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start the dev server at `localhost:4321`     |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Preview the production build locally         |

## Structure

```
src/
├── site.config.ts          # Site name, links, version, theme controls
├── layouts/Layout.astro    # Thin wrapper around the theme's DocsLayout
├── components/             # Your own doc helpers (SectionCards lives here)
└── pages/
    ├── index.astro
    ├── guides/
    │   ├── index.mdx        # Section landing page (sets sectionOrder)
    │   └── getting-started.mdx
    └── components/
        ├── index.mdx
        └── example.mdx
```

## Adding content

Drop a new `.mdx` file under `src/pages/<section>/` — it appears in the sidebar
automatically, grouped by its folder. Control ordering with the `order` (per
page) and `sectionOrder` (on a section's `index.mdx`) frontmatter keys.

Use the `Demo` component for live examples with tabbed source code:

```mdx
import { Demo } from '@mrmartineau/zui-theme/astro'

<Demo html={`<button class="zui-button">Click me</button>`}>
  <button class="zui-button">Click me</button>
</Demo>
```

See the [theme README](https://www.npmjs.com/package/@mrmartineau/zui-theme) for
the full list of components, helpers, and config options.
