import type {
  TabsActivationMode,
  TabsControllerApi,
  TabsDirection,
  TabsDomController,
  TabsOrientation,
  TabsRootOptions,
} from '../core/tabs'
import { attachTabsDom } from '../core/tabs'
import {
  tabsContentVariants,
  tabsListVariants,
  tabsTriggerVariants,
} from '../shared/tabsVariants'
import {
  adoptChildren,
  bindAttributeForwarding,
  boolAttr,
  classHostElement,
  keepAdoptingChildren,
  stringAttr,
  whenChildrenReady,
  ZuiElement,
} from './element'

/**
 * `<zui-tabs>` — attaches the shared vanilla tabs controller to itself.
 * Triggers and panels register automatically (the controller observes the
 * subtree), so children can arrive in any order. Emits a bubbling
 * `zui-tabs-change` CustomEvent with `{ value }` when the selection changes.
 */
export class ZuiTabs extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['value', 'orientation', 'activation-mode', 'dir', 'disabled']
  }

  #dom: TabsDomController | null = null

  /** The shared tabs controller (available once connected). */
  get controller(): TabsControllerApi | null {
    return this.#dom?.controller ?? null
  }

  /** The currently selected tab value. */
  get value(): string | undefined {
    return this.#dom?.controller.getSnapshot().selectedValue ?? undefined
  }

  set value(next: string | undefined) {
    if (next !== undefined) this.setAttribute('value', next)
  }

  #options(): TabsRootOptions {
    return {
      activationMode:
        (stringAttr(this, 'activation-mode') as TabsActivationMode) ?? 'auto',
      defaultValue: stringAttr(this, 'default-value'),
      dir: (stringAttr(this, 'dir') as TabsDirection) ?? 'ltr',
      disabled: boolAttr(this, 'disabled') ?? false,
      id: this.id || undefined,
      onValueChange: (value) => {
        this.dispatchEvent(
          new CustomEvent('zui-tabs-change', {
            bubbles: true,
            detail: { value },
          }),
        )
      },
      orientation:
        (stringAttr(this, 'orientation') as TabsOrientation) ?? 'horizontal',
      value: stringAttr(this, 'value'),
    }
  }

  override connectedCallback(): void {
    whenChildrenReady(this, () => {
      if (!this.#dom) this.#dom = attachTabsDom(this, this.#options())
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

export const ZuiTabsList = classHostElement({
  attributes: { variant: 'variant' },
  hostAttributes: { 'data-zui-tabs-list': '' },
  variants: (props) => tabsListVariants(props),
})

/** `<zui-tabs-content value="tab-1">` — the panel for a trigger value. */
export class ZuiTabsContent extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['value']
  }

  override zuiSync(): void {
    this.applyClasses(tabsContentVariants({}))
    if (!this.hasAttribute('data-zui-tabs-content')) {
      this.setAttribute('data-zui-tabs-content', '')
    }
    this.setAttribute('data-value', this.getAttribute('value') ?? '')
  }
}

/**
 * `<zui-tabs-trigger value="tab-1">` — renders an inner native `<button>`
 * carrying the `data-zui-tabs-trigger` hook the shared controller wires up.
 */
export class ZuiTabsTrigger extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['value', 'variant', 'disabled']
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
      button.setAttribute('data-zui-tabs-trigger', '')
      this.#button = button
      this.prepend(button)
      adoptChildren(this, button)
      keepAdoptingChildren(this, button)
      bindAttributeForwarding(this, button, ['value', 'variant'])
    }

    this.#button.setAttribute('data-value', this.getAttribute('value') ?? '')
    this.applyClasses(
      tabsTriggerVariants({
        variant: (stringAttr(this, 'variant') ?? undefined) as never,
      }),
      this.#button,
    )
  }
}
