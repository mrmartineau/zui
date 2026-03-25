# ZUI

A CSS-first UI library with optional React and Astro components.

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

## Package exports

| Specifier                    | Resolves to                  |
| :--------------------------- | :--------------------------- |
| `@mrmartineau/zui/css`       | `dist/css/zui.css`           |
| `@mrmartineau/zui/css/min`   | `dist/css/zui.min.css`       |
| `@mrmartineau/zui/react`     | `dist/react/index.mjs`       |
| `@mrmartineau/zui/astro`     | `src/astro/index.ts`         |
| `@mrmartineau/zui/astro/*`   | `src/astro/*`                |
| `@mrmartineau/zui/utils`     | `dist/utils/index.mjs`       |
