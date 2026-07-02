# ZUI

A CSS-first UI library with thin Astro, React, Solid, Svelte, and Vue wrappers, plus framework-free Web Components. Components are authored as modular CSS in cascade layers, with framework wrappers that share `cva` variant definitions.

## Language

### Component layers

**Component**:
A UI primitive with seven layers: CSS class, Astro wrapper, React wrapper, Solid wrapper, Svelte wrapper, Vue wrapper, web component. Optionally shares `cva` variants from `packages/zui/src/shared/`.
_Avoid_: Widget, element, control.

**Wrapper**:
A thin per-framework binding that applies the `zui-` CSS class and forwards props. Carries no logic of its own beyond variant resolution.
_Avoid_: Adapter, binding.

**Variant**:
A `cva`-defined visual or behavioural mode of a component (e.g. `size="lg"`, `position="left"`). Shared across all framework wrappers.
_Avoid_: Mode, style, type.

**Token**:
A CSS custom property exposing a design value. **Global tokens** live in `packages/zui/src/css/tokens/` (`--color-*`, `--space-*`, etc.). **Component-local tokens** are scoped on a component selector and prefixed `--zui-<component>-*` (e.g. `--zui-dialog-bg`).
_Avoid_: Variable, custom property (when referring to design values).

### App shell domain

**AppShell**:
The top-level layout component owning the grid, collapse state, and breakpoint mode for an application-style UI. Composes `AppShellSidebar`, `AppShellHeader`, `AppShellMain`.
_Avoid_: Layout, frame, chrome, app layout.

**Drawer**:
The off-canvas presentation of `AppShellSidebar` below the mobile breakpoint. Same DOM element as desktop sidebar, presented via the native `popover` API with extracted `zui-drawer-slide-left|right` animation.
_Avoid_: Off-canvas, modal sidebar, mobile menu.

**Collapse**:
The desktop sidebar transition between fully visible and fully hidden. State stored on the root as `data-collapsed="true"`. When collapsed the sidebar grid track shrinks to `0`, the sidebar receives `visibility: hidden`, and main content expands.
_Avoid_: Minimise, fold, shrink.

**Mobile mode**:
The presentation below the configured breakpoint, where the sidebar becomes a popover-driven drawer and the header auto-injects a hamburger toggle. Determined by a viewport `@media` query in CSS plus a `matchMedia` listener in the JS controller, kept in sync via the same breakpoint value.
_Avoid_: Small screen mode, responsive mode, mobile view.

**AppShellController**:
The vanilla TypeScript controller in `packages/zui/src/shared/` that drives popover open/close, ResizeObserver, localStorage persistence, and keyboard shortcuts. Framework wrappers thin-wrap it.
_Avoid_: Manager, store, state.

## Relationships

- An **AppShell** contains exactly one **AppShellSidebar**, one **AppShellHeader**, and one **AppShellMain**.
- An **AppShellSidebar** has three regions: header, body (scrolls), footer.
- An **AppShellSidebar** is in one of two **modes** at any time: desktop (collapse/rail/expanded) or mobile (drawer).
- Every **Component** has one or more **Variants** defined in `packages/zui/src/shared/`.
- Every **Wrapper** consumes the same shared **Variants**.

## Flagged ambiguities

- "Sidebar collapse" briefly meant "icon rail" (narrow but visible). Resolved: rail was removed; **collapse** now means fully hidden on desktop and is distinct only from the mobile **drawer** presentation.
- "Toolbar" was initially used by the requester to mean what is now **AppShellHeader**. Resolved: header is the canonical term; "toolbar" reserved for any future in-content action bar component.

## Example dialogue

> **Dev:** "What happens to the **AppShellSidebar** at 600px?"
> **Maintainer:** "It switches to **mobile mode** — the **AppShellController** calls `showPopover()` and the sidebar becomes a **drawer**. The header auto-injects the toggle. `data-collapsed` is irrelevant in mobile mode."
> **Dev:** "And when collapsed on desktop?"
> **Maintainer:** "Sidebar grid track goes to `0` and the sidebar gets `visibility: hidden`. Fully gone — no icon rail."
