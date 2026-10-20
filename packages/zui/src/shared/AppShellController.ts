/*
 * AppShellController
 *
 * Vanilla TypeScript controller shared across all framework wrappers (Astro,
 * React, Solid, Svelte, Vue). Owns:
 *
 * - mode detection (desktop vs mobile) via matchMedia on the viewport
 * - mobile drawer open/close via the HTML popover API
 * - desktop collapse state via the `data-collapsed` attribute
 * - localStorage persistence of collapse state (when uncontrolled)
 * - Escape-to-close on desktop (mobile drawer handles Escape natively)
 * - optional Cmd/Ctrl+B keyboard shortcut
 * - the header toggle's tooltip (shows the shortcut when it is bound)
 *
 * See docs/adr/0001-shared-js-controllers.md for the rationale.
 */

export type AppShellMode = 'desktop' | 'mobile'

export interface AppShellControllerOptions {
  /** Root `.zui-app-shell` element. */
  root: HTMLElement
  /** The sidebar element (must also carry `popover="auto"` for mobile mode). */
  sidebar: HTMLElement
  /** Breakpoint in pixels below which the controller switches to mobile mode. */
  mobileBreakpoint?: number
  /** Initial collapsed state for the desktop rail. */
  defaultCollapsed?: boolean
  /** Controlled collapsed state. When provided, overrides internal state. */
  collapsed?: boolean
  /** Called whenever the desktop collapse state changes. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** localStorage key for persisting collapse state. Set to `null` to disable. */
  storageKey?: string | null
  /** When true, binds Cmd/Ctrl+B to toggle the sidebar. */
  bindKeyboardShortcut?: boolean
}

const DEFAULT_BREAKPOINT = 768
const DEFAULT_STORAGE_KEY = 'zui-app-shell-collapsed'
const TOOLTIP_EVENTS = [
  'pointerenter',
  'pointerleave',
  'focusin',
  'focusout',
  'click',
] as const

export class AppShellController {
  private root: HTMLElement
  private sidebar: HTMLElement
  private mobileBreakpoint: number
  private storageKey: string | null
  private bindKeyboard: boolean
  private controlled: boolean
  private onCollapsedChange?: (collapsed: boolean) => void

  private collapsed: boolean
  private mode: AppShellMode = 'desktop'
  private mediaQuery?: MediaQueryList
  private mediaHandler?: (e: MediaQueryListEvent) => void
  private keyboardHandler?: (e: KeyboardEvent) => void
  private escapeHandler?: (e: KeyboardEvent) => void
  private tooltipHandler?: (e: Event) => void
  private modeListeners = new Set<(mode: AppShellMode) => void>()

  constructor(options: AppShellControllerOptions) {
    this.root = options.root
    this.sidebar = options.sidebar
    this.mobileBreakpoint = options.mobileBreakpoint ?? DEFAULT_BREAKPOINT
    this.storageKey =
      options.storageKey === undefined
        ? DEFAULT_STORAGE_KEY
        : options.storageKey
    this.bindKeyboard = options.bindKeyboardShortcut ?? false
    this.controlled = options.collapsed !== undefined
    this.onCollapsedChange = options.onCollapsedChange

    this.collapsed = this.resolveInitialCollapsed(
      options.collapsed,
      options.defaultCollapsed,
    )
    this.applyCollapsedAttr()
  }

  private resolveInitialCollapsed(
    controlled: boolean | undefined,
    fallback: boolean | undefined,
  ): boolean {
    if (controlled !== undefined) return controlled
    if (this.storageKey && typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(this.storageKey)
        if (stored === 'true') return true
        if (stored === 'false') return false
      } catch {
        /* localStorage unavailable */
      }
    }
    return fallback ?? false
  }

  /** Start observing and bind listeners. Call after mount. */
  mount(): void {
    if (typeof window === 'undefined') return

    this.mediaQuery = window.matchMedia(
      `(max-width: ${this.mobileBreakpoint - 1}px)`,
    )
    this.mediaHandler = (e: MediaQueryListEvent) => {
      this.setMode(e.matches ? 'mobile' : 'desktop')
    }
    // Initial sync
    this.mode = this.mediaQuery.matches ? 'mobile' : 'desktop'
    this.mediaQuery.addEventListener('change', this.mediaHandler)

    if (this.bindKeyboard) {
      this.keyboardHandler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
          e.preventDefault()
          this.toggle()
        }
      }
      window.addEventListener('keydown', this.keyboardHandler)
      // CSS reads these to show the shortcut in the toggle tooltip
      this.root.setAttribute('data-zui-shortcut', '')
      if (/Mac|iPhone|iPad/.test(navigator.userAgent)) {
        this.root.setAttribute('data-zui-mac', '')
      }
    }

    // Delegated so toggles rendered after mount still get their tooltip.
    // Capture phase because pointerenter/leave do not bubble.
    this.tooltipHandler = (e: Event) => {
      const target = e.target
      if (!(target instanceof Element)) return
      // Clicks can land on the nested icon. Hover events must match the
      // button exactly: leaving the icon would otherwise hide the tooltip
      // while the pointer is still over the button.
      const btn =
        e.type === 'click' ? target.closest('.zui-app-shell-toggle') : target
      if (!btn?.matches('.zui-app-shell-toggle')) return
      const tip = btn.nextElementSibling
      if (
        !(tip instanceof HTMLElement) ||
        !tip.matches('.zui-app-shell-toggle-tooltip')
      ) {
        return
      }
      const show =
        (e.type === 'pointerenter' &&
          (e as PointerEvent).pointerType === 'mouse') ||
        (e.type === 'focusin' && btn.matches(':focus-visible'))
      if (show !== tip.matches(':popover-open')) tip.togglePopover(show)
    }
    for (const type of TOOLTIP_EVENTS) {
      this.root.addEventListener(type, this.tooltipHandler, true)
    }

    // Escape closes the sidebar on desktop. Mobile drawer already handles
    // Escape natively via the popover API, so we skip it there to avoid a
    // redundant collapsed-state write.
    this.escapeHandler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      for (const tip of this.root.querySelectorAll<HTMLElement>(
        '.zui-app-shell-toggle-tooltip:popover-open',
      )) {
        tip.hidePopover()
      }
      if (e.defaultPrevented) return
      if (this.mode !== 'desktop') return
      if (this.collapsed) return
      // Don't steal Escape from text inputs or other Escape-consuming UI
      const target = e.target as Element | null
      if (
        target?.closest(
          'input, textarea, select, [contenteditable=""], [contenteditable="true"]',
        )
      ) {
        return
      }
      this.setCollapsed(true)
    }
    window.addEventListener('keydown', this.escapeHandler)
  }

  /** Stop observing and clean up. */
  destroy(): void {
    if (this.mediaQuery && this.mediaHandler) {
      this.mediaQuery.removeEventListener('change', this.mediaHandler)
    }
    this.mediaQuery = undefined
    this.mediaHandler = undefined
    if (this.keyboardHandler) {
      window.removeEventListener('keydown', this.keyboardHandler)
      this.keyboardHandler = undefined
    }
    if (this.escapeHandler) {
      window.removeEventListener('keydown', this.escapeHandler)
      this.escapeHandler = undefined
    }
    if (this.tooltipHandler) {
      for (const type of TOOLTIP_EVENTS) {
        this.root.removeEventListener(type, this.tooltipHandler, true)
      }
      this.tooltipHandler = undefined
    }
    this.root.removeAttribute('data-zui-shortcut')
    this.modeListeners.clear()
  }

  /** Toggle: in desktop mode flips collapse, in mobile mode opens/closes drawer. */
  toggle(): void {
    if (this.mode === 'mobile') {
      this.toggleDrawer()
    } else {
      this.setCollapsed(!this.collapsed)
    }
  }

  setCollapsed(next: boolean): void {
    if (this.controlled) {
      this.onCollapsedChange?.(next)
      return
    }
    if (this.collapsed === next) return
    this.collapsed = next
    this.applyCollapsedAttr()
    this.persist()
    this.onCollapsedChange?.(next)
  }

  /** Sync external controlled value (no callback emitted). */
  syncCollapsed(next: boolean): void {
    this.controlled = true
    if (this.collapsed === next) return
    this.collapsed = next
    this.applyCollapsedAttr()
  }

  getCollapsed(): boolean {
    return this.collapsed
  }

  getMode(): AppShellMode {
    return this.mode
  }

  openDrawer(): void {
    if (
      'showPopover' in this.sidebar &&
      typeof this.sidebar.showPopover === 'function' &&
      !this.sidebar.matches(':popover-open')
    ) {
      this.sidebar.showPopover()
    }
  }

  closeDrawer(): void {
    if (
      'hidePopover' in this.sidebar &&
      typeof this.sidebar.hidePopover === 'function' &&
      this.sidebar.matches(':popover-open')
    ) {
      this.sidebar.hidePopover()
    }
  }

  toggleDrawer(): void {
    if (this.sidebar.matches(':popover-open')) {
      this.closeDrawer()
    } else {
      this.openDrawer()
    }
  }

  onModeChange(listener: (mode: AppShellMode) => void): () => void {
    this.modeListeners.add(listener)
    // Fire immediately so subscribers receive the current mode without
    // waiting for the first viewport crossing.
    listener(this.mode)
    return () => this.modeListeners.delete(listener)
  }

  private setMode(next: AppShellMode): void {
    this.mode = next
    // When crossing back to desktop, ensure drawer is closed
    if (next === 'desktop') this.closeDrawer()
    for (const listener of this.modeListeners) listener(next)
  }

  private applyCollapsedAttr(): void {
    if (this.collapsed) {
      this.root.setAttribute('data-collapsed', 'true')
    } else {
      this.root.removeAttribute('data-collapsed')
    }
  }

  private persist(): void {
    if (this.controlled || !this.storageKey || typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(this.storageKey, String(this.collapsed))
    } catch {
      /* localStorage unavailable */
    }
  }
}

/**
 * Inline `<head>` snippet to prevent a flash of wrong collapse state on first
 * paint when persistence is enabled. Drop into your document `<head>` before
 * the AppShell renders. Pass a custom key if you've changed `storageKey`.
 */
export function appShellNoFlashScript(
  storageKey: string = DEFAULT_STORAGE_KEY,
): string {
  return `(function(){try{var v=localStorage.getItem(${JSON.stringify(
    storageKey,
  )});if(v==='true'){document.documentElement.setAttribute('data-zui-app-shell-collapsed','true');}}catch(e){}})();`
}
