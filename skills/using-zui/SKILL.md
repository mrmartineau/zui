---
name: using-zui
description: "Build interfaces with the ZUI CSS-first UI library. Use when generating HTML, React, Astro, Solid, Svelte, or Vue markup that should use ZUI components, design tokens, and utility classes. Triggers on: ZUI, zui-button, zui-card, zui- prefix, @mrmartineau/zui."
user-invocable: true
---

# Using ZUI

ZUI is a CSS-first UI library with optional React, Astro, Solid, Svelte, and Vue component wrappers. Import `@mrmartineau/zui/css` for styles, then import components from the framework-specific path.

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

// Solid
import { Button, Card, Input } from '@mrmartineau/zui/solid'

// Svelte
import { Button, Card, Input } from '@mrmartineau/zui/svelte'

// Vue
import { Button, Card, Input } from '@mrmartineau/zui/vue'
```

Icons use [Phosphor Icons](https://phosphoricons.com/) — HTML: `<i class="ph ph-icon-name"></i>`, React: `import { IconName } from '@phosphor-icons/react'`.

## Adding ZUI to an Existing Project

When introducing ZUI to a project that doesn't already use it, **audit the project's main/global stylesheet and remove styles that ZUI already provides.** ZUI ships its own reset and base layer (`zui.reset`, `zui.base`), so keeping the project's old equivalents is redundant and can fight with ZUI's cascade.

Remove only the things ZUI actually defines (from `zui.reset` and `zui.base`):

- **Box sizing** — `*, *::before, *::after { box-sizing: border-box; }`.
- **Margin reset** — ZUI applies `* { margin: 0; }`, so a project's global margin reset is redundant.
- **Base typography on `html`/`body`** — `font-family` (from `--font-body`) and `line-height`. ZUI sets these, so drop project-level `body { font-family: … }` / `line-height: …` declarations.
- **Media element defaults** — `img, picture, video, canvas, svg { display: block; max-width: 100%; }`.
- **Misc base styles** — font smoothing, `color-scheme`, `:focus-visible` outline, custom scrollbar styling, and reduced-motion handling.

**Don't remove styles ZUI doesn't replace.** ZUI's reset is intentionally minimal — it does **not** reset list styles (`ul`/`ol`), style base links (links are styled via the `.zui-link` class / `Link` component, not a global `a` rule), set a base `font-size`, or restyle headings beyond the blanket margin reset. Keep the project's own rules for those, or migrate them to the relevant ZUI utilities (e.g. `prose` for long-form content, `.zui-link` for links).

After removing the redundant resets, **don't re-add hard-coded values to override ZUI.** Instead, update the relevant ZUI variables (design tokens / component custom properties) in the project's stylesheet. For example, to change the project font or base colours, override the tokens rather than re-declaring `body { font-family: … }`:

```css
:root {
  --font-body: 'Inter', var(--font-stack-sans); /* override ZUI's body font token */
  --color-theme: oklch(0.6 0.2 250); /* override the brand colour token */
}
```

See **Design Tokens** and **Overriding Component Styles** below for the full set of variables available. The goal: let ZUI own the reset and base layer, and customise only by overriding its variables.

## Match the Project's Framework

**Always use the framework-native ZUI components when the project uses a supported framework — don't write raw HTML elements with `zui-` classes.**

- **React** project → use the React components from `@mrmartineau/zui/react` (`<Button>`, `<Card>`, …).
- **Astro** project → use the Astro components from `@mrmartineau/zui/astro` (`<Button>`, `<Card>`, …).
- **Solid** project → use the Solid components from `@mrmartineau/zui/solid`.
- **Svelte** project → use the Svelte components from `@mrmartineau/zui/svelte`.
- **Vue** project → use the Vue components from `@mrmartineau/zui/vue`.

The components are typed wrappers that map props (`variant`, `color`, `size`, …) to the underlying `zui-` classes and wire up behaviour (state, focus management, anchor positioning) for you. Only fall back to plain HTML with `zui-` classes when the project has no supported framework (e.g. a static HTML page or a framework without a ZUI wrapper).

The HTML examples below are provided to show the underlying markup and class names — prefer the framework component example when one exists for your project's framework.

## CSS Layers

All styles are organised into cascading layers. When writing custom CSS that interacts with ZUI, place it in the correct layer:

```
@layer zui.reset, zui.base, zui.components, zui.utilities;
```

## Overriding Component Styles

**Prefer the component's CSS variables over raw CSS properties.** When you need to restyle a component for an isolated, one-off case (not a global theme change), change the component's custom property rather than setting `color`, `background-color`, `border`, etc. directly. The variables are the component's intended API — they flow through the component's internal states (hover, focus, disabled, variants) so overriding one value stays consistent, whereas a raw property override only patches the single declaration it targets and can be out-sync or need `!important` to win.

For example, to change a button's foreground colour, set `--zui-btn-fg` — don't set `color`:

```css
/* ✅ Do — override the variable */
.checkout .zui-button {
  --zui-btn-fg: var(--color-background);
  --zui-btn-bg: var(--color-success);
}

/* ❌ Avoid — raw property override */
.checkout .zui-button {
  color: var(--color-background);
  background-color: var(--color-success);
}
```

(Component variables use the abbreviated prefix — `--zui-btn-*` for the button, not `--zui-button-*`.) Only fall back to raw CSS properties when no variable exists for the thing you need to change. If you find yourself reaching for a raw property often, check the component's docs page for a variable that covers it first.

### CSS custom properties

Every component exposes CSS custom properties that control its appearance — colours, border radius, padding, shadow, and more. Override these without touching source CSS.

**Inline** — via `style` attribute on the component's root element:

```html
<div class="zui-card" style="--zui-card-radius: var(--radius-sm); --zui-card-padding: var(--space-lg);">…</div>
```

**Stylesheet** — target the component class. Rules outside a `@layer` win over `zui.components` automatically, no `!important` needed:

```css
.zui-card {
  --zui-card-radius: var(--radius-sm);
  --zui-card-padding: var(--space-lg);
}
```

**Scoped** — nest under a parent selector to restrict the override to a specific context:

```css
.my-sidebar .zui-button {
  --zui-btn-radius: 0;
}
```

Each component page in the docs lists its available custom properties and their defaults.

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

### Animation

Pre-built animation tokens for use with `animation:`:

`--animation-fade-in` · `--animation-fade-out` · `--animation-scale-up` · `--animation-scale-down` · `--animation-slide-in-up` · `--animation-slide-in-down` · `--animation-slide-in-right` · `--animation-slide-in-left` · `--animation-slide-out-up` · `--animation-slide-out-down` · `--animation-slide-out-right` · `--animation-slide-out-left` · `--animation-shake-x` · `--animation-shake-y` · `--animation-shake-z` · `--animation-spin` · `--animation-ping` · `--animation-blink` · `--animation-float` · `--animation-bounce` · `--animation-pulse`

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

Carries no margin — always wrap a label + control in a [Field](#field) for spacing.

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

### Field

Composable wrappers that give forms consistent spacing, descriptions, errors, legends, and orientation. They wrap — they do not replace — the controls above (`Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Label`). **Always wrap form controls in a `Field`**: `zui-label` and the controls carry no margins, so the Field family owns all spacing.

| Component | CSS class | Element | Purpose |
|---|---|---|---|
| `Field` | `zui-field` | `div[role=group]` | Wraps a label + control + description/error. Props: `orientation` (`vertical`\|`horizontal`\|`responsive`), `invalid`. |
| `FieldGroup` | `zui-field-group` | `div` | Stacks multiple fields; establishes the container for `responsive` orientation. |
| `FieldDescription` | `zui-field-description` | `div` | Helper text. |
| `FieldError` | `zui-field-error` | `div[role=alert]` | Validation message. |
| `FieldSet` | `zui-field-set` | `fieldset` | Groups related controls (radios/checkboxes). |
| `FieldLegend` | `zui-field-legend` | `legend` | Caption for a `FieldSet` (`variant`: `legend`\|`label`). |
| `FieldSeparator` | `zui-field-separator` | `div[role=separator]` | Divider with optional inline content. |

Modifier classes: `zui-field-horizontal`, `zui-field-responsive` (needs a `FieldGroup` ancestor; flips to horizontal at `32rem`), `zui-field-invalid`.

```html
<div class="zui-field">
  <label class="zui-label" for="email">Email</label>
  <input class="zui-input" type="email" id="email" aria-describedby="email-desc" />
  <div class="zui-field-description" id="email-desc">We'll never share it.</div>
</div>
```

```tsx
<Field>
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" aria-describedby="email-desc" />
  <FieldDescription id="email-desc">We'll never share it.</FieldDescription>
</Field>
```

Field components are presentational — wire `id`/`for`/`aria-describedby`/`aria-invalid` yourself. Group radios/checkboxes with `FieldSet` + `FieldLegend`.

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

### Kbd / KbdGroup

**CSS classes:** `zui-kbd` (single key), `zui-kbd-group` (shortcut wrapper). Both render a `<kbd>`. Keys scale to the surrounding font size, so they work inline in text, buttons, and tooltips. Use plain `<span>` children inside a group as connectors (`+`, `then`).

```html
<kbd class="zui-kbd">Esc</kbd>

<kbd class="zui-kbd-group">
  <kbd class="zui-kbd">⌘</kbd>
  <kbd class="zui-kbd">K</kbd>
</kbd>
```

```tsx
<Kbd>Esc</Kbd>

<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
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

### Accordion

**CSS classes:** `zui-accordion` (wrapper), `zui-accordion-item` (`<details>`), `zui-accordion-trigger` (`<summary>`), `zui-accordion-content`

Variant: `zui-accordion-flush` — no outer border/background, items separated by dividers.

Uses native `<details>`/`<summary>` elements with CSS animated open/close. Add `name` attribute to `<details>` items to make them mutually exclusive (browser-native accordion behaviour).

```html
<div class="zui-accordion">
  <details class="zui-accordion-item">
    <summary class="zui-accordion-trigger">Section 1</summary>
    <div class="zui-accordion-content">Content here</div>
  </details>
  <details class="zui-accordion-item">
    <summary class="zui-accordion-trigger">Section 2</summary>
    <div class="zui-accordion-content">Content here</div>
  </details>
</div>
```

```tsx
<Accordion>
  <AccordionItem>
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content here</AccordionContent>
  </AccordionItem>
</Accordion>

{/* Flush variant */}
<Accordion flush>…</Accordion>
```

### AppShell

Top-level application layout — full-height sidebar, header over main, scrollable main content. On desktop the sidebar toggles between fully visible and fully hidden (no icon rail). Below 768px the sidebar becomes a popover-driven off-canvas drawer and the header auto-injects a hamburger toggle. Persists collapse state to `localStorage`.

**CSS classes:** `zui-app-shell` (root), `zui-app-shell-sidebar` (full-height aside, must carry `popover="auto"`), `zui-app-shell-sidebar-header`, `zui-app-shell-sidebar-body` (scrolls), `zui-app-shell-sidebar-footer`, `zui-app-shell-header`, `zui-app-shell-toggle` (header button), `zui-app-shell-main` (scrolls), `zui-app-shell-skip-link`

| Variant axis | Options | Class pattern |
|---|---|---|
| position | `left` (default), `right` | `zui-app-shell-position-{name}` |

State on root: `data-collapsed="true"` flips desktop layout to hide the sidebar; the JS controller toggles this attribute.

**Local tokens** (scoped to `.zui-app-shell` root): `--zui-app-shell-sidebar-width` (15rem), `--zui-app-shell-header-height` (3rem), `--zui-app-shell-main-padding` (`var(--space-md)`), `--zui-app-shell-transition-duration` (200ms), `--zui-app-shell-surface`, `--zui-app-shell-border`.

```html
<div class="zui-app-shell" data-zui-app-shell>
  <a class="zui-app-shell-skip-link" href="#main">Skip to main content</a>

  <aside class="zui-app-shell-sidebar" popover="auto" aria-label="Sidebar">
    <div class="zui-app-shell-sidebar-header">
      <i class="ph ph-sparkle"></i><span>Acme</span>
    </div>
    <div class="zui-app-shell-sidebar-body">
      <a href="#"><i class="ph ph-house"></i><span>Home</span></a>
    </div>
    <div class="zui-app-shell-sidebar-footer">
      <i class="ph ph-user-circle"></i><span>Account</span>
    </div>
  </aside>

  <header class="zui-app-shell-header">
    <button type="button" class="zui-app-shell-toggle" aria-label="Toggle sidebar">
      <i class="ph ph-list"></i>
    </button>
    <strong>Dashboard</strong>
  </header>

  <main id="main" class="zui-app-shell-main">…</main>
</div>
```

```tsx
// React — wrappers manage the controller automatically
<AppShell shortcut>
  <AppShellSidebar>
    <AppShellSidebarHeader>
      <i className="ph ph-sparkle" /><span>Acme</span>
    </AppShellSidebarHeader>
    <AppShellSidebarBody>
      <a href="#"><i className="ph ph-house" /><span>Home</span></a>
    </AppShellSidebarBody>
    <AppShellSidebarFooter>
      <i className="ph ph-user-circle" /><span>Account</span>
    </AppShellSidebarFooter>
  </AppShellSidebar>

  <AppShellHeader>
    <strong>Dashboard</strong>
  </AppShellHeader>

  <AppShellMain>…</AppShellMain>
</AppShell>
```

```astro
<!-- Astro — same component tree; controller wired via inline scripts -->
<AppShell shortcut>
  <AppShellSidebar>
    <AppShellSidebarHeader>…</AppShellSidebarHeader>
    <AppShellSidebarBody>…</AppShellSidebarBody>
    <AppShellSidebarFooter>…</AppShellSidebarFooter>
  </AppShellSidebar>
  <AppShellHeader><strong>Dashboard</strong></AppShellHeader>
  <AppShellMain>…</AppShellMain>
</AppShell>
```

**`AppShell` props:** `position` (`'left' | 'right'`), `defaultCollapsed`, `collapsed` (controlled), `onCollapsedChange`, `mobileBreakpoint` (default 768), `storageKey` (default `'zui-app-shell-collapsed'`, pass `null` to disable), `shortcut` (binds <kbd>Cmd/Ctrl+B</kbd>).

**`AppShellHeader` props:** `toggle` (default `true`, auto-injects the hamburger toggle button), `toggleLabel`.

**`AppShellSidebar` props:** `label` (default `'Sidebar'`, used as `aria-label`).

The `AppShellHeader` toggle calls `controller.toggle()` — on desktop it flips `data-collapsed`; below the mobile breakpoint it opens/closes the popover drawer.

### Avatar

**CSS classes:** `zui-avatar` (base), `zui-avatar-image` (`<img>`), `zui-avatar-fallback`

| Variant axis | Options | Class pattern |
|---|---|---|
| size | `sm`, `md` (default), `lg` | `zui-avatar-size-{name}` |
| shape | `default` (round), `hard` (square), `soft` (round), `squircle` | `zui-avatar-shape-{name}` |

Falls back to a user icon when `src` is absent or fails to load. The `fallback` prop accepts any React node.

```html
<span class="zui-avatar">
  <span class="zui-avatar-fallback"><i class="ph ph-user"></i></span>
  <img class="zui-avatar-image" src="…" alt="Name" />
</span>
```

```tsx
<Avatar src="/photo.jpg" alt="Zander" size="md" shape="default" />
<Avatar fallback="ZM" size="lg" />
```

### Collapsible

**CSS classes:** `zui-collapsible` (`<details>`), `zui-collapsible-trigger` (`<summary>`), `zui-collapsible-content`

Single disclosure widget with animated open/close. Uses native `<details>`/`<summary>`.

```html
<details class="zui-collapsible">
  <summary class="zui-collapsible-trigger">Show more</summary>
  <div class="zui-collapsible-content">Hidden content</div>
</details>
```

```tsx
<Collapsible>
  <CollapsibleTrigger>Show more</CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>
```

### Tabs

**CSS classes:** `zui-tabs` (root), `zui-tabs-list`, `zui-tabs-trigger`, `zui-tabs-content`

Accessible tabs primitive with managed state, keyboard navigation, and horizontal or vertical orientation.

| Variant axis | Options | Class pattern |
|---|---|---|
| list variant | `surface` (default), `underline` | `zui-tabs-list-variant-{name}` |
| trigger variant | `surface` (default), `underline` | `zui-tabs-trigger-variant-{name}` |
| orientation | `horizontal` (default), `vertical` | `data-orientation={name}` |
| activationMode | `auto` (default), `manual` | prop only |

```html
<div class="zui-tabs" data-orientation="horizontal">
  <div class="zui-tabs-list" role="tablist" aria-label="Profile sections">
    <button class="zui-tabs-trigger" type="button" role="tab" aria-selected="true">Account</button>
    <button class="zui-tabs-trigger" type="button" role="tab" aria-selected="false">Security</button>
    <button class="zui-tabs-trigger" type="button" role="tab" aria-selected="false">Billing</button>
  </div>
  <div class="zui-tabs-content" role="tabpanel">Account settings</div>
</div>
```

```tsx
<Tabs defaultValue="account">
  <TabsList aria-label="Profile sections">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>

  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
  <TabsContent value="billing">Billing settings</TabsContent>
</Tabs>
```

Use `variant="underline"` on both `TabsList` and `TabsTrigger` for the underline style. Use `orientation="vertical"` for vertical tabs.

### Menu

**CSS classes:** `zui-menu` (root), `zui-menu-trigger`, `zui-menu-content`, `zui-menu-item`

Strict action menu primitive with managed focus, keyboard navigation, dismissal behavior, and typeahead. `MenuTrigger` is a real button styled with the ZUI button variants. `MenuItem` renders as a `<button>` by default or an `<a>` when `href` is provided.

```html
<div class="zui-menu">
  <button class="zui-button zui-button-variant-outline zui-menu-trigger" aria-haspopup="menu" aria-expanded="false">
    Open menu
  </button>
  <div class="zui-menu-content" role="menu" hidden>
    <button class="zui-button zui-button-variant-ghost zui-menu-item" role="menuitem">Action</button>
    <a class="zui-button zui-button-variant-ghost zui-menu-item" href="/page" role="menuitem">Link</a>
  </div>
</div>
```

```tsx
<Menu>
  <MenuTrigger>Open menu</MenuTrigger>
  <MenuContent>
    <MenuItem>Action</MenuItem>
    <MenuItem href="/page">Link</MenuItem>
  </MenuContent>
</Menu>
```

`Menu` props include `defaultOpen`, `open`, `disabled`, `side`, `align`, and `dir`. `MenuItem` supports `disabled`, `href`, and `textValue` for typeahead matching.

### Flex

Convenience React/Astro wrapper that applies flex utility classes via props. No dedicated CSS component — uses the utility layer.

```tsx
<Flex direction="row" align="center" justify="between" gap="sm">
  …
</Flex>
```

Props: `display` (`flex` | `inline-flex`), `direction` (`row` | `column`), `align`, `justify`, `wrap`, `gap`, `gapX`, `gapY`

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

1. **Use framework-native components** — in a React/Astro/Solid/Svelte/Vue project, use the framework's ZUI components, not raw HTML elements with `zui-` classes. Only hand-write `zui-` class markup when no ZUI wrapper exists for the project's framework.
2. **Always use design tokens** — never hard-code colours, spacing, radii, shadows, or font sizes.
3. **Use `light-dark()`** for colour values that differ between themes.
4. **Use `oklch(from …)`** relative colour syntax to derive tints, shades, and transparency.
5. **Component classes use `zui-` prefix** — e.g. `zui-button`, `zui-card`.
6. **Utility classes have no prefix** — e.g. `flex`, `gap-m`, `p-xs`.
7. **Icons use Phosphor Icons** — never inline SVG. HTML: `<i class="ph ph-icon-name"></i>`, React: `import { Icon } from '@phosphor-icons/react'`.
8. **Border style** uses `var(--border-style)`.
9. **Focus ring** uses `var(--focus-ring)` and `var(--focus-ring-offset)`.
10. **Forms always use Field components** — wrap every label + control in a `Field` (and groups in `FieldSet`/`FieldLegend`). `zui-label` and the controls carry no margins; the Field family owns all form spacing.
11. **Override variables, not properties** — for isolated component restyles, change the component's custom property (e.g. `--zui-btn-fg`) rather than raw `color`/`background-color`. Fall back to raw CSS properties only when no variable exists.
