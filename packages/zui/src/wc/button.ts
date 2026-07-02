import { buttonVariants } from '../shared/buttonVariants'
import {
  adoptChildren,
  bindAttributeForwarding,
  keepAdoptingChildren,
  readVariantProps,
  ZuiElement,
} from './element'

const CONFIG = {
  attributes: {
    color: 'color',
    shape: 'shape',
    size: 'size',
    variant: 'variant',
  },
  booleanAttributes: { icon: 'icon' },
}

const VARIANT_ATTRIBUTES = ['variant', 'color', 'size', 'shape', 'icon']

/**
 * `<zui-button>` renders an inner native `<button>` (or `<a>` when `href` is
 * set) so focus, forms and keyboard behaviour stay native. All non-variant
 * attributes are forwarded to the inner element.
 */
export class ZuiButton extends ZuiElement {
  static get observedAttributes(): string[] {
    return [...VARIANT_ATTRIBUTES, 'href']
  }

  #inner: HTMLButtonElement | HTMLAnchorElement | null = null
  #observers: MutationObserver[] = []

  /** The rendered native element. */
  get control(): HTMLButtonElement | HTMLAnchorElement | null {
    return this.#inner
  }

  override zuiSync(): void {
    const tag = this.getAttribute('href') ? 'a' : 'button'

    if (this.#inner && this.#inner.tagName.toLowerCase() !== tag) {
      for (const observer of this.#observers) observer.disconnect()
      this.#observers = []
      const previous = this.#inner
      this.#inner = null
      this.#mount(tag, previous)
      previous.remove()
    }

    if (!this.#inner) this.#mount(tag, this)

    if (this.#inner) {
      this.applyClasses(
        buttonVariants(readVariantProps(this, CONFIG)),
        this.#inner,
      )
    }
  }

  #mount(tag: 'a' | 'button', childSource: HTMLElement): void {
    const inner = document.createElement(tag) as
      | HTMLButtonElement
      | HTMLAnchorElement
    this.#inner = inner
    this.prepend(inner)
    adoptChildren(childSource, inner)
    this.#observers.push(
      keepAdoptingChildren(this, inner),
      bindAttributeForwarding(this, inner, VARIANT_ATTRIBUTES),
    )
  }
}
