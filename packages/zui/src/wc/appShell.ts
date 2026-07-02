import {
  AppShellController,
  type AppShellMode,
} from '../shared/AppShellController'
import {
  appShellHeaderVariants,
  appShellMainVariants,
  appShellSidebarBodyVariants,
  appShellSidebarFooterVariants,
  appShellSidebarHeaderVariants,
  appShellSidebarVariants,
  appShellVariants,
} from '../shared/appShellVariants'
import { boolAttr, classHostElement, stringAttr, ZuiElement } from './element'

const DEFAULT_SIDEBAR_ID = 'zui-app-shell-sidebar'
const DEFAULT_MAIN_ID = 'zui-app-shell-main'

type ControllerHost = HTMLElement & {
  __zuiAppShellController?: AppShellController
}

/**
 * `<zui-app-shell>` — boots the shared AppShellController (drawer, collapse,
 * persistence, keyboard shortcut) against its sidebar child.
 */
export class ZuiAppShell extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['position']
  }

  #controller: AppShellController | null = null
  #bootObserver: MutationObserver | null = null

  /** The mounted controller (available once the sidebar has connected). */
  get controller(): AppShellController | null {
    return this.#controller
  }

  toggle(): void {
    this.#controller?.toggle()
  }

  getMode(): AppShellMode | undefined {
    return this.#controller?.getMode()
  }

  override connectedCallback(): void {
    if (!this.hasAttribute('data-zui-app-shell')) {
      this.setAttribute('data-zui-app-shell', '')
    }
    if (!this.querySelector(':scope > .zui-app-shell-skip-link')) {
      const skipLink = document.createElement('a')
      skipLink.className = 'zui-app-shell-skip-link'
      skipLink.href = `#${stringAttr(this, 'main-id') ?? DEFAULT_MAIN_ID}`
      skipLink.textContent = 'Skip to main content'
      this.prepend(skipLink)
    }
    super.connectedCallback()
    this.#boot()
  }

  disconnectedCallback(): void {
    this.#bootObserver?.disconnect()
    this.#bootObserver = null
    this.#controller?.destroy()
    this.#controller = null
    delete (this as ControllerHost).__zuiAppShellController
  }

  override zuiSync(): void {
    this.applyClasses(
      appShellVariants({
        position: (stringAttr(this, 'position') ?? undefined) as never,
      }),
    )
  }

  #boot(): void {
    if (this.#controller) return
    const sidebar = this.querySelector<HTMLElement>('.zui-app-shell-sidebar')

    if (!sidebar) {
      // The sidebar may not have parsed/upgraded yet — wait for it.
      if (!this.#bootObserver) {
        this.#bootObserver = new MutationObserver(() => this.#boot())
        this.#bootObserver.observe(this, {
          attributeFilter: ['class'],
          attributes: true,
          childList: true,
          subtree: true,
        })
      }
      return
    }

    this.#bootObserver?.disconnect()
    this.#bootObserver = null

    const storageKey = stringAttr(this, 'storage-key')
    const controller = new AppShellController({
      bindKeyboardShortcut: boolAttr(this, 'shortcut') ?? false,
      defaultCollapsed: boolAttr(this, 'default-collapsed') ?? false,
      mobileBreakpoint: Number(stringAttr(this, 'mobile-breakpoint') ?? 768),
      root: this,
      sidebar,
      storageKey: storageKey === 'none' ? null : storageKey,
    })
    controller.mount()
    this.#controller = controller
    ;(this as ControllerHost).__zuiAppShellController = controller
  }
}

/**
 * `<zui-app-shell-header>` — auto-injects a sidebar toggle button unless
 * `toggle="false"`.
 */
export class ZuiAppShellHeader extends ZuiElement {
  override zuiSync(): void {
    this.applyClasses(appShellHeaderVariants({}))

    const wantsToggle = boolAttr(this, 'toggle') ?? true
    let button = this.querySelector<HTMLButtonElement>(
      ':scope > [data-zui-app-shell-toggle]',
    )

    if (wantsToggle && !button) {
      button = document.createElement('button')
      button.type = 'button'
      button.className = 'zui-app-shell-toggle'
      button.setAttribute('data-zui-app-shell-toggle', '')
      button.setAttribute(
        'aria-label',
        stringAttr(this, 'toggle-label') ?? 'Toggle sidebar',
      )
      button.setAttribute(
        'aria-controls',
        stringAttr(this, 'sidebar-id') ?? DEFAULT_SIDEBAR_ID,
      )
      const icon = document.createElement('i')
      icon.className = 'ph ph-list'
      icon.setAttribute('aria-hidden', 'true')
      button.appendChild(icon)
      button.addEventListener('click', () => {
        const root = this.closest<ControllerHost>('[data-zui-app-shell]')
        root?.__zuiAppShellController?.toggle()
      })
      this.prepend(button)
    } else if (!wantsToggle && button) {
      button.remove()
    }
  }
}

/** `<zui-app-shell-sidebar>` — becomes a popover drawer below the breakpoint. */
export class ZuiAppShellSidebar extends ZuiElement {
  override connectedCallback(): void {
    if (!this.id) this.id = DEFAULT_SIDEBAR_ID
    if (!this.hasAttribute('popover')) this.setAttribute('popover', 'auto')
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', stringAttr(this, 'label') ?? 'Sidebar')
    }
    super.connectedCallback()
  }

  override zuiSync(): void {
    this.applyClasses(appShellSidebarVariants({}))
  }
}

/** `<zui-app-shell-main>` — the main content landmark. */
export class ZuiAppShellMain extends ZuiElement {
  override connectedCallback(): void {
    if (!this.id) this.id = DEFAULT_MAIN_ID
    if (!this.hasAttribute('role')) this.setAttribute('role', 'main')
    super.connectedCallback()
  }

  override zuiSync(): void {
    this.applyClasses(appShellMainVariants({}))
  }
}

export const ZuiAppShellSidebarHeader = classHostElement({
  variants: () => appShellSidebarHeaderVariants({}),
})

export const ZuiAppShellSidebarBody = classHostElement({
  variants: () => appShellSidebarBodyVariants({}),
})

export const ZuiAppShellSidebarFooter = classHostElement({
  variants: () => appShellSidebarFooterVariants({}),
})
