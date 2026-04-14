# ZUI

A CSS-first UI library with optional React, Astro, Solid, Svelte, and Vue components.

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

### Svelte

```svelte
<script>
  import { Button } from '@mrmartineau/zui/svelte'
</script>

<Button>Click me</Button>
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

This package uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate versioning and publishing based on [Conventional Commits](https://www.conventionalcommits.org/).

### Commit message format

When a release is run, semantic-release inspects the commit history since the last release to determine the next version:

| Prefix | Release type |
| :----- | :----------- |
| `fix:` | Patch (`1.0.x`) |
| `feat:` | Minor (`1.x.0`) |
| `feat!:` or `BREAKING CHANGE:` | Major (`x.0.0`) |

### CI / automated releases

Releases are triggered manually via the **"NPM Release"** workflow in GitHub Actions (`.github/workflows/release.yml`). The workflow:

1. Installs dependencies
2. Builds the CSS bundle and component wrappers (`pnpm run build`)
3. Runs `semantic-release`, which determines the next version from commit history, updates `CHANGELOG.md`, publishes to npm, and creates a GitHub release

The workflow requires an `NPM_TOKEN` secret set in the repository settings. `GITHUB_TOKEN` is provided automatically by GitHub Actions.

## Package exports

| Specifier                    | Resolves to                  |
| :--------------------------- | :--------------------------- |
| `@mrmartineau/zui/css`       | `dist/css/zui.css`           |
| `@mrmartineau/zui/css/min`   | `dist/css/zui.min.css`       |
| `@mrmartineau/zui/react`     | `dist/react/index.mjs`       |
| `@mrmartineau/zui/solid`     | `dist/solid/index.mjs`       |
| `@mrmartineau/zui/svelte`    | `src/svelte/index.ts`        |
| `@mrmartineau/zui/svelte/*`  | `src/svelte/*`               |
| `@mrmartineau/zui/vue`       | `src/vue/index.ts`           |
| `@mrmartineau/zui/vue/*`     | `src/vue/*`                  |
| `@mrmartineau/zui/astro`     | `src/astro/index.ts`         |
| `@mrmartineau/zui/astro/*`   | `src/astro/*`                |
| `@mrmartineau/zui/utils`     | `dist/utils/index.mjs`       |
