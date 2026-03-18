# ZUI

A CSS UI library with optional React and Astro components.

CSS is authored as modular source files using `@import` and `@layer`, then bundled with [tsdown](https://tsdown.dev/) (powered by [Lightning CSS](https://lightningcss.dev/)) into a single distributable stylesheet.

## Install

```sh
npm install @mrmartineau/zui
```

## Usage

### CSS only

Import the bundled stylesheet. All `@import` statements are resolved and layers are preserved.

```css
@import '@mrmartineau/zui/css';
```

Or use the minified version:

```css
@import '@mrmartineau/zui/css/min';
```

You can also link to it directly in HTML:

```html
<link rel="stylesheet" href="node_modules/@mrmartineau/zui/dist/css/zui.css" />
```

### With React

```tsx
import { Button } from '@mrmartineau/zui/react'

export function App() {
  return <Button>Click me</Button>
}
```

### With Astro

```astro
---
import { Button } from '@mrmartineau/zui/astro'
---

<Button>Click me</Button>
```

## Customisation

`src/css/theme.css` is the single file you need to edit. It contains semantic colour tokens and font settings that map onto the underlying design token palette. Override any of these to retheme the library:

```css
/* src/css/theme.css */
:root {
  --color-primary: light-dark(var(--color-violet-600), var(--color-violet-400));
  --color-secondary: light-dark(var(--color-slate-700), var(--color-slate-300));
  --color-background: light-dark(var(--color-slate-50), var(--color-slate-950));
  --color-text: light-dark(var(--color-slate-900), var(--color-slate-100));
  /* … */
}
```

Everything else in `src/css/` is generated or internal — only `theme.css` is intended for user edits.

## Design tokens

### Colours

Colours are exposed as CSS custom properties in the form `--color-{name}-{shade}`, e.g. `--color-blue-500`. A handful of special values have no shade: `--color-black`, `--color-white`, `--color-transparent`, `--color-inherit`, `--color-current`.

Use the palette tokens directly, or reference them through the semantic tokens in `theme.css`:

```css
.my-element {
  /* raw palette token */
  background-color: var(--color-blue-500);

  /* semantic token from theme.css */
  color: var(--color-text);
}
```

#### Adapting colours with CSS relative color syntax

Rather than shipping a separate variable for every possible transparency or tint, ZUI uses CSS [relative color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors) to let you derive new values on the fly from any existing token.

**Add transparency**

```css
.my-element {
  /* 50% opacity blue */
  background-color: oklch(from var(--color-blue-500) l c h / 50%);

  /* 10% opacity — useful for subtle tinted backgrounds */
  background-color: oklch(from var(--color-blue-500) l c h / 10%);
}
```

**Lighten or darken**

```css
.my-element {
  /* Lighter — increase l toward 1 */
  color: oklch(from var(--color-blue-500) calc(l + 0.15) c h);

  /* Darker — decrease l toward 0 */
  color: oklch(from var(--color-blue-500) calc(l - 0.15) c h);
}
```

**Desaturate or shift hue**

```css
.my-element {
  /* Half the chroma (more muted) */
  color: oklch(from var(--color-blue-500) l calc(c * 0.5) h);

  /* Rotate hue by 30° */
  color: oklch(from var(--color-blue-500) l c calc(h + 30));
}
```

All of the above can be combined freely. Browser support: Chrome 119+, Firefox 128+, Safari 16.4+.

## CSS Architecture

Source CSS lives in `src/css/` and is organised into layers declared in `layers.css`:

```css
@layer zui.base, zui.components, zui.utilities;
```

| File / Directory | Layer              | Purpose                                        |
| :--------------- | :----------------- | :--------------------------------------------- |
| `theme.css`      | `zui.base`         | **Edit this.** Semantic tokens & font settings |
| `reset.css`      | `zui.base`         | Minimal reset / normalisations                 |
| `tokens/`        | `zui.base`         | Design tokens as custom properties (generated) |
| `components/`    | `zui.components`   | Component styles (button, etc.)                |
| `utilities/`     | `zui.utilities`    | Utility classes (flex, spacing, etc)           |

## Building

Everything is built with a single command using [tsdown](https://tsdown.dev/) which uses Lightning CSS under the hood for `@import` resolution and minification.

```sh
npm run build
```

This produces:

| Output                    | Description                     |
| :------------------------ | :------------------------------ |
| `dist/css/zui.css`        | Bundled CSS (readable)          |
| `dist/css/zui.min.css`    | Bundled CSS (minified)          |
| `dist/react/index.mjs`    | React components (ESM)          |
| `dist/react/index.d.mts`  | React component type declarations |

### Dev mode

```sh
npm run dev
```

### Demo site

```sh
cd demo
npm install
npm run dev
```

An Astro site at `demo/` renders every component variant for visual testing.

## Package exports

| Specifier                    | Resolves to              |
| :--------------------------- | :----------------------- |
| `@mrmartineau/zui/css`       | `dist/css/zui.css`       |
| `@mrmartineau/zui/css/min`   | `dist/css/zui.min.css`   |
| `@mrmartineau/zui/react`     | `dist/react/index.mjs`   |
| `@mrmartineau/zui/astro`     | `src/astro/index.ts`     |
| `@mrmartineau/zui/astro/*`   | `src/astro/*`            |
