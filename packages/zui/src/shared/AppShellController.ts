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
 * - optional Cmd/Ctrl+B keyboard shortcut
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
  private modeListeners = new Set<(mode: AppShellMode) => void>()

  constructor(options: AppShellControllerOptions) {
    this.root = options.root
    this.sidebar = options.sidebar
    this.mobileBreakpoint = options.mobileBreakpoint ?? DEFAULT_BREAKPOINT
    this.storageKey =
      options.storageKey === undefined ? DEFAULT_STORAGE_KEY : options.storageKey
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
    }
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
