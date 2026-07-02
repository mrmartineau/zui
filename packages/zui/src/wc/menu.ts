import type {
  MenuAlign,
  MenuControllerApi,
  MenuDirection,
  MenuRootOptions,
  MenuSide,
} from '../core/menu'
import { attachMenuDom } from '../core/menu'
import type { MenuDomController } from '../core/menu/dom'
import { buttonVariants } from '../shared/buttonVariants'
import {
  adoptChildren,
  bindAttributeForwarding,
  boolAttr,
  keepAdoptingChildren,
  readVariantProps,
  stringAttr,
  whenChildrenReady,
  ZuiElement,
} from './element'

/**
 * `<zui-menu>` — attaches the shared vanilla menu controller (open/close,
 * keyboard navigation, typeahead, outside-click dismissal) to itself. Emits a
 * bubbling `zui-menu-toggle` CustomEvent with `{ open }`.
 */
export class ZuiMenu extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['align', 'side', 'open', 'disabled', 'modal', 'dir']
  }

  #dom: MenuDomController | null = null

  /** The shared menu controller (available once connected). */
  get controller(): MenuControllerApi | null {
    return this.#dom?.controller ?? null
  }

  get open(): boolean {
    return this.#dom?.controller.getSnapshot().open ?? false
  }

  #options(): MenuRootOptions {
    return {
      align: (stringAttr(this, 'align') as MenuAlign) ?? 'start',
      defaultOpen: boolAttr(this, 'default-open'),
      dir: (stringAttr(this, 'dir') as MenuDirection) ?? 'ltr',
      disabled: boolAttr(this, 'disabled') ?? false,
      id: this.id || undefined,
      modal: boolAttr(this, 'modal') ?? false,
      onOpenChange: (open) => {
        this.dispatchEvent(
          new CustomEvent('zui-menu-toggle', {
            bubbles: true,
            detail: { open },
          }),
        )
      },
      open: boolAttr(this, 'open'),
      side: (stringAttr(this, 'side') as MenuSide) ?? 'bottom',
    }
  }

  override connectedCallback(): void {
    whenChildrenReady(this, () => {
      if (!this.#dom) this.#dom = attachMenuDom(this, this.#options())
    })
    super.connectedCallback()
  }

  disconnectedCallback(): void {
    this.#dom?.destroy()
    this.#dom = null
  }

  override zuiSync(): void {
    this.#dom?.controller.setOptions(this.#options())
  }
}

const BUTTON_CONFIG = {
  attributes: {
    color: 'color',
    shape: 'shape',
    size: 'size',
    variant: 'variant',
  },
  booleanAttributes: { icon: 'icon' },
}

const BUTTON_ATTRIBUTES = ['variant', 'color', 'size', 'shape', 'icon']

/**
 * `<zui-menu-trigger>` — renders an inner native `<button>` carrying the
 * `data-zui-menu-trigger` hook. Styled as a ZUI button (`outline` default).
 */
export class ZuiMenuTrigger extends ZuiElement {
  static get observedAttributes(): string[] {
    return BUTTON_ATTRIBUTES
  }

  #button: HTMLButtonElement | null = null

  /** The rendered native button. */
  get control(): HTMLButtonElement | null {
    return this.#button
  }

  override zuiSync(): void {
    if (!this.#button) {
      const button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('data-zui-menu-trigger', '')
      this.#button = button
      this.prepend(button)
      adoptChildren(this, button)
      keepAdoptingChildren(this, button)
      bindAttributeForwarding(this, button, BUTTON_ATTRIBUTES)
    }

    const props = readVariantProps(this, BUTTON_CONFIG)
    props.variant = props.variant ?? 'outline'
    this.applyClasses(buttonVariants(props), this.#button)
  }
}

/** `<zui-menu-content>` — the host is the menu popup itself. */
export class ZuiMenuContent extends ZuiElement {
  override connectedCallback(): void {
    if (!this.hasAttribute('data-zui-menu-content')) {
      this.setAttribute('data-zui-menu-content', '')
    }
    super.connectedCallback()
  }

  override zuiSync(): void {
    this.applyClasses('zui-menu-content')
  }
}

/**
 * `<zui-menu-item>` — renders an inner native `<button>` (or `<a>` when
 * `href` is set) carrying the `data-zui-menu-item` hook. Styled as a ZUI
 * button (`ghost` default).
 */
export class ZuiMenuItem extends ZuiElement {
  static get observedAttributes(): string[] {
    return [...BUTTON_ATTRIBUTES, 'href', 'text-value']
  }

  #inner: HTMLButtonElement | HTMLAnchorElement | null = null

  /** The rendered native element. */
  get control(): HTMLButtonElement | HTMLAnchorElement | null {
    return this.#inner
  }

  override zuiSync(): void {
    if (!this.#inner) {
      const href = this.getAttribute('href')
      const inner = document.createElement(href ? 'a' : 'button') as
        | HTMLButtonElement
        | HTMLAnchorElement
      if (inner instanceof HTMLButtonElement) inner.type = 'button'
      inner.setAttribute('data-zui-menu-item', '')
      this.#inner = inner
      this.prepend(inner)
      adoptChildren(this, inner)
      keepAdoptingChildren(this, inner)
      bindAttributeForwarding(this, inner, [...BUTTON_ATTRIBUTES, 'text-value'])
    }

    const textValue = this.getAttribute('text-value')
    if (textValue) this.#inner.setAttribute('data-text-value', textValue)

    const props = readVariantProps(this, BUTTON_CONFIG)
    props.variant = props.variant ?? 'ghost'
    this.applyClasses(buttonVariants(props), this.#inner)
  }
}
