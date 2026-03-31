# ZUI

A CSS-first UI library with optional React, Astro, Solid, and Vue components.

**Full documentation: [zui.zander.wtf](https://zui.zander.wtf)**

## Install

```sh
npm install @mrmartineau/zui
```

## Quick start

### CSS only

```css
@import '@mrmartineau/zui/css';
```

Or minified:

```css
@import '@mrmartineau/zui/css/min';
```

### React

```tsx
import { Button } from '@mrmartineau/zui/react'

export function App() {
  return <Button>Click me</Button>
}
```

### Astro

```astro
---
import { Button } from '@mrmartineau/zui/astro'
---

<Button>Click me</Button>
```

### Solid

```tsx
import { Button } from '@mrmartineau/zui/solid'

export function App() {
  return <Button>Click me</Button>
}
```

### Vue

```vue
<template>
  <Button>Click me</Button>
</template>

<script setup>
import { Button } from '@mrmartineau/zui/vue'
</script>
```

## Customisation

Override semantic tokens in your CSS to retheme the library:

```css
:root {
  --color-theme: light-dark(var(--color-violet-600), var(--color-violet-400));
  --color-background: light-dark(var(--color-slate-50), var(--color-slate-950));
  --color-text: light-dark(var(--color-slate-900), var(--color-slate-100));
}
```

See [zui.zander.wtf](https://zui.zander.wtf) for the full token reference, component docs, and live examples.

## Releasing

This package uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

### Workflow

1. **During development** — after making changes, create a changeset to describe them:

   ```sh
   pnpm changeset
   ```

   Follow the prompts to select a bump type (`major`, `minor`, or `patch`) and write a summary. This creates a markdown file in `.changeset/` that should be committed alongside your changes.

2. **Preparing a release** — consume pending changesets to bump the version and update `CHANGELOG.md`:

   ```sh
   pnpm changeset:version
   ```

   Commit the resulting changes.

3. **Publishing** — build and publish to npm:

   ```sh
   pnpm changeset:publish
   ```

### Publishing locally

To release without CI, run the three steps in sequence:

```sh
pnpm changeset         # 1. create a changeset (if not already done)
pnpm changeset:version # 2. bump version + update CHANGELOG.md
pnpm changeset:publish # 3. build + publish to npm
```

You must be logged in to npm (`npm login`) and have publish access to `@mrmartineau/zui` before running step 3.

### CI / automated releases

Pushing to `main` triggers the release workflow (`.github/workflows/release.yml`). It uses the [changesets/action](https://github.com/changesets/action) which will:

- **Open a "Version Packages" PR** if there are unpublished changesets — merging it bumps versions and updates the changelog.
- **Publish to npm automatically** once that PR is merged.

The workflow requires an `NPM_TOKEN` secret set in the repository settings.

## Package exports

| Specifier                    | Resolves to                  |
| :--------------------------- | :--------------------------- |
| `@mrmartineau/zui/css`       | `dist/css/zui.css`           |
| `@mrmartineau/zui/css/min`   | `dist/css/zui.min.css`       |
| `@mrmartineau/zui/react`     | `dist/react/index.mjs`       |
| `@mrmartineau/zui/solid`     | `dist/solid/index.mjs`       |
| `@mrmartineau/zui/vue`       | `src/vue/index.ts`           |
| `@mrmartineau/zui/vue/*`     | `src/vue/*`                  |
| `@mrmartineau/zui/astro`     | `src/astro/index.ts`         |
| `@mrmartineau/zui/astro/*`   | `src/astro/*`                |
| `@mrmartineau/zui/utils`     | `dist/utils/index.mjs`       |
