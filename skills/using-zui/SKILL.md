---
name: using-zui
description: "Build interfaces with the ZUI CSS-first UI library. Use when generating HTML, React, or Astro markup that should use ZUI components, design tokens, and utility classes. Triggers on: ZUI, zui-button, zui-card, zui- prefix, @mrmartineau/zui."
user-invocable: true
---

# Using ZUI

ZUI is a CSS-first UI library with optional React and Astro component wrappers. Import `@mrmartineau/zui/css` for styles, `@mrmartineau/zui/react` for React components, or `@mrmartineau/zui/astro` for Astro components.

## Setup

```html
<!-- CSS only (any framework) -->
<link rel="stylesheet" href="path/to/zui.css" />
```

```ts
// React
import { Button, Card, Input } from '@mrmartineau/zui/react'

// Astro
import { Button, Card, Input } from '@mrmartineau/zui/astro'
```

Icons use [Phosphor Icons](https://phosphoricons.com/) — HTML: `<i class="ph ph-icon-name"></i>`, React: `import { IconName } from '@phosphor-icons/react'`.

## CSS Layers

All styles are organised into cascading layers. When writing custom CSS that interacts with ZUI, place it in the correct layer:

```
@layer zui.reset, zui.base, zui.components, zui.utilities;
```

## Design Tokens

Always use tokens via CSS custom properties — never hard-code raw values.

### Semantic Colours (from `theme.css`)

| Token | Purpose |
|---|---|
| `--color-theme` | Primary brand colour |
| `--color-accent` | Secondary accent |
| `--color-background` | Page background |
| `--color-surface` | Card/panel backgrounds |
| `--color-border` | Default border colour |
| `--color-text` | Body text |
| `--color-success` | Success states |
| `--color-error` | Error/destructive states |
| `--color-warning` | Warning states |

Use `light-dark()` for values that differ between themes. Derive transparency/tints with `oklch(from … )` relative colour syntax.

### Space (fluid, clamp-based)

`--space-5xs` · `--space-4xs` · `--space-3xs` · `--space-2xs` · `--space-xs` · `--space-sm` · `--space-md` · `--space-lg` · `--space-xl` · `--space-2xl` · `--space-3xl`

One-up pairs: `--space-3xs-2xs`, `--space-xs-sm`, `--space-sm-md`, `--space-md-lg`, etc.

### Font Size (fluid, clamp-based)

`--step--4` through `--step-10` (0 = base ~13–16px)

### Radii

`--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-xl` · `--radius-2xl` · `--radius-3xl` · `--radius-full` · `--radius-round`

Controlled globally by `--radius-scale` (default `1`).

### Shadows

`--shadow-sm` · `--shadow` · `--shadow-md` · `--shadow-lg` · `--shadow-xl` · `--shadow-2xl`

### Easing

`--ease` · `--ease-in` · `--ease-out` · `--ease-in-out` · `--ease-elastic-out` · `--ease-elastic-in` · `--ease-elastic-in-out` · `--ease-spring`

### Z-Index

`--z--1` · `--z-0` · `--z-1` (1000) through `--z-9` (9000) · `--z-important`

### Border

Use `var(--border-style)` for border-style (defaults to `solid`).

## Components

All component classes use the `zui-` prefix. Each component exists as a CSS class, an Astro wrapper, and a React wrapper.

### Button

**CSS classes:** `zui-button` (base)

| Variant axis | Options | Class pattern |
|---|---|---|
| variant | `fill` (default), `subtle`, `outline`, `ghost`, `link` | `zui-button-variant-{name}` |
| color | `theme` (default), `accent`, `destructive` | `zui-button-color-{name}` |
| size | `xs`, `sm`, `md` (default), `lg`, `xl` | `zui-button-size-{name}` |
| shape | `default`, `hard`, `soft`, `squircle` | `zui-button-shape-{name}` |
| icon | boolean — square 1:1 for icon-only buttons | `zui-button-icon` |

```html
<button class="zui-button">Default</button>
<button class="zui-button zui-button-variant-outline zui-button-color-accent">Outline Accent</button>
<button class="zui-button zui-button-size-sm zui-button-shape-soft">Small Pill</button>
<button class="zui-button zui-button-icon"><i class="ph ph-plus"></i></button>
```

```tsx
<Button>Default</Button>
<Button variant="outline" color="accent">Outline Accent</Button>
<Button size="sm" shape="soft">Small Pill</Button>
<Button icon><Plus /></Button>
```

### Badge

**CSS classes:** `zui-badge` (base)

| Variant axis | Options | Class pattern |
|---|---|---|
| variant | `subtle` (default), `fill`, `outline` | `zui-badge-variant-{name}` |
| color | `default`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `gray` | `zui-badge-color-{name}` |

```html
<span class="zui-badge">Default</span>
<span class="zui-badge zui-badge-variant-fill zui-badge-color-emerald">Success</span>
```

```tsx
<Badge>Default</Badge>
<Badge variant="fill" color="emerald">Success</Badge>
```

### Card

**CSS classes:** `zui-card` (base), `zui-card-header`, `zui-card-title`, `zui-card-description`, `zui-card-body`, `zui-card-footer`

Variants: `zui-card-elevated` (shadow, no border), `zui-card-interactive` (hover effects, clickable)

```html
<div class="zui-card">
  <div class="zui-card-header">
    <h3 class="zui-card-title">Title</h3>
    <p class="zui-card-description">Description</p>
  </div>
  <div class="zui-card-body">Content</div>
  <div class="zui-card-footer">
    <button class="zui-button">Action</button>
  </div>
</div>
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

### Input

**CSS class:** `zui-input`

Handles `:focus`, `:disabled`, `[aria-invalid="true"]`, and `:user-invalid` states automatically.

```html
<input class="zui-input" type="text" placeholder="Enter text" />
```

```tsx
<Input type="text" placeholder="Enter text" />
```

### Textarea

**CSS class:** `zui-textarea` — same API pattern as Input.

### Select

**CSS class:** `zui-select` — same API pattern as Input.

### Label

**CSS class:** `zui-label`

### Checkbox

**CSS class:** `zui-checkbox` — renders a `<label>` wrapping a styled `<input type="checkbox">`. Children become the label text. Use `zui-checkbox-list` on a `<ul>` to stack multiple checkboxes.

```html
<label class="zui-checkbox">
  <input type="checkbox" name="agree" />
  I agree
</label>

<ul class="zui-checkbox-list">
  <li><label class="zui-checkbox"><input type="checkbox" /> Option A</label></li>
  <li><label class="zui-checkbox"><input type="checkbox" /> Option B</label></li>
</ul>
```

```tsx
<Checkbox name="agree">I agree</Checkbox>
```

### Radio

**CSS class:** `zui-radio` — same pattern as Checkbox; renders a `<label>` wrapping `<input type="radio">`.

```html
<label class="zui-radio"><input type="radio" name="choice" value="a" /> Option A</label>
```

```tsx
<Radio name="choice" value="a">Option A</Radio>
```

### Dialog

**CSS classes:** `zui-dialog` (base), `zui-dialog-header`, `zui-dialog-title`, `zui-dialog-description`, `zui-dialog-body`, `zui-dialog-footer`, `zui-dialog-close`

Uses native `<dialog>` element with `showModal()` / `close()`. Has built-in backdrop blur and fade transitions.

| Size | Class |
|---|---|
| sm (24rem) | `zui-dialog-size-sm` |
| md (32rem, default) | — |
| lg (42rem) | `zui-dialog-size-lg` |
| full | `zui-dialog-size-full` |

```html
<dialog class="zui-dialog" closedby="any">
  <div class="zui-dialog-header">
    <h2 class="zui-dialog-title">Title</h2>
    <p class="zui-dialog-description">Description</p>
  </div>
  <div class="zui-dialog-body">Content</div>
  <div class="zui-dialog-footer">
    <button class="zui-button zui-button-variant-ghost">Cancel</button>
    <button class="zui-button">Confirm</button>
  </div>
</dialog>
```

```tsx
// React — controlled via `open` boolean; `onClose` fires on native close
<Dialog open={isOpen} onClose={() => setIsOpen(false)} size="md">
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </DialogHeader>
  <DialogBody>Content</DialogBody>
  <DialogFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button>Confirm</Button>
  </DialogFooter>
</Dialog>
```

```astro
<!-- Astro — requires `id`; open/close via JS: document.getElementById('my-dialog').showModal() -->
<Dialog id="my-dialog" size="md">
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </DialogHeader>
  <DialogBody>Content</DialogBody>
  <DialogFooter>
    <button class="zui-button zui-button-variant-ghost">Cancel</button>
    <button class="zui-button">Confirm</button>
  </DialogFooter>
</Dialog>
```

### Tooltip

**CSS classes:** `zui-tooltip` (wrapper), `zui-tooltip-content` (popover content)

Uses CSS Anchor Positioning and Popover API. Placements: `zui-tooltip-placement-top` (default), `-bottom`, `-left`, `-right`.

```html
<span class="zui-tooltip">
  <span style="anchor-name: --my-tip" popovertarget="my-tip" popovertargetaction="hover">
    Hover me
  </span>
  <span popover="hint" id="my-tip" class="zui-tooltip-content zui-tooltip-placement-top" role="tooltip"
        style="position-anchor: --my-tip">Tooltip text</span>
</span>
```

```tsx
// React — handles anchor wiring automatically
<Tooltip text="Tooltip text" placement="top">
  <button class="zui-button">Hover me</button>
</Tooltip>
```

```astro
<!-- Astro — handles anchor wiring automatically -->
<Tooltip text="Tooltip text" placement="top">
  <button class="zui-button">Hover me</button>
</Tooltip>
```

### Popover

**CSS class:** `zui-popover`

Uses CSS Anchor Positioning and Popover API. Positioned below the trigger by default. The trigger needs `anchor-name` CSS and `popovertarget` pointing to the popover's `id`.

```html
<button class="zui-button" popovertarget="my-pop" style="anchor-name: --my-pop">Open</button>
<div id="my-pop" popover="auto" class="zui-popover" style="position-anchor: --my-pop">
  Popover content
</div>
```

```tsx
// React — pass matching `id`; the component sets position-anchor automatically
<button className="zui-button" popoverTarget="my-pop" style={{ anchorName: '--my-pop' }}>Open</button>
<Popover id="my-pop" popover="auto">Popover content</Popover>
```

```astro
<!-- Astro — `type` prop maps to popover attribute ("auto" | "manual") -->
<button class="zui-button" popovertarget="my-pop" style="anchor-name: --my-pop">Open</button>
<Popover id="my-pop" type="auto">Popover content</Popover>
```

### Text

**CSS class:** `zui-text-{step}` — sizes a `<span>` to a type scale step.

```tsx
<Text size="base">Normal text</Text>
<Text size="1">Slightly larger</Text>
<Text size="-1">Smaller text</Text>
```

### Code / Pre

**CSS classes:** `zui-code` (inline), `zui-pre` (block)

```html
<code class="zui-code">inline snippet</code>
<pre class="zui-pre"><code>block code</code></pre>
```

```tsx
<Code>inline snippet</Code>
<Pre><code>block code</code></Pre>
```

### Link

**CSS class:** `zui-link`

```html
<a class="zui-link" href="/">Go home</a>
```

```tsx
<Link href="/">Go home</Link>
```

### Prose

**CSS class:** `prose` — rich-text formatting for long-form content (headings, paragraphs, lists, etc.)

```html
<div class="prose"><p>Long-form content…</p></div>
```

```tsx
<Prose><p>Long-form content…</p></Prose>
```

### Table

**CSS classes:** `zui-table`, `zui-table-header` (`<thead>`), `zui-table-body` (`<tbody>`), `zui-table-footer` (`<tfoot>`), `zui-table-row` (`<tr>`), `zui-table-head` (`<th>`), `zui-table-cell` (`<td>`), `zui-table-caption`

## Utility Classes

### Layout

| Class | Effect |
|---|---|
| `flex` | `display: flex` |
| `inline-flex` | `display: inline-flex` |
| `flex-center` | `display: flex; align-items: center` |
| `flex-column` | `flex-direction: column` |
| `flex-row` | `flex-direction: row` |
| `flex-wrap` | `flex-wrap: wrap` |
| `flex-auto` | `flex: 1 1 auto` |
| `flex-none` | `flex: none` |
| `items-center` | `align-items: center` |
| `justify-between` | `justify-content: space-between` |
| `justify-center` | `justify-content: center` |

### Spacing

Gap (all axes): `gap-0`, `gap-2xs`, `gap-xs`, `gap-s`, `gap-m`, `gap-l`, `gap-xl`, `gap-2xl`, `gap-3xl`, `gap-4xl`
Column gap only: `gapx-{size}` (same scale)
Row gap only: `gapy-{size}` (same scale)
Padding: `p-{size}`, `px-{size}`, `py-{size}`, `pt-{size}`, `pb-{size}`, `pl-{size}`, `pr-{size}`

### Typography

| Class | Effect |
|---|---|
| `zui-text--4` … `zui-text-6` | Font size steps |
| `zui-text-base` | Base font size (step 0) |
| `zui-color-muted` | 70% opacity text |
| `zui-color-faint` | 50% opacity text |
| `zui-link` | Styled link with underline |
| `zui-code` | Inline code styling |
| `zui-pre` | Code block styling |

### Content Flow

| Class | Effect |
|---|---|
| `flow` | Vertical rhythm — `> * + *` gets `margin-block-start` |
| `prose` | Rich text formatting for long-form content |

### Background

| Class | Effect |
|---|---|
| `surface` | Subtle background tint for alternating sections |

### Visibility

| Class | Effect |
|---|---|
| `sr-only` / `visually-hidden` | Screen-reader-only content |

## Key Rules

1. **Always use design tokens** — never hard-code colours, spacing, radii, shadows, or font sizes.
2. **Use `light-dark()`** for colour values that differ between themes.
3. **Use `oklch(from …)`** relative colour syntax to derive tints, shades, and transparency.
4. **Component classes use `zui-` prefix** — e.g. `zui-button`, `zui-card`.
5. **Utility classes have no prefix** — e.g. `flex`, `gap-m`, `p-xs`.
6. **Icons use Phosphor Icons** — never inline SVG. HTML: `<i class="ph ph-icon-name"></i>`, React: `import { Icon } from '@phosphor-icons/react'`.
7. **Border style** uses `var(--border-style)`.
8. **Focus ring** uses `var(--focus-ring)` and `var(--focus-ring-offset)`.
