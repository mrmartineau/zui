/*
 * Shared runtime for ZUI web components.
 *
 * Every ZUI custom element is a light-DOM element: it applies the same
 * `zui-*` classes the other framework wrappers use, so the global stylesheet
 * keeps working — no shadow DOM, no style duplication, full themability.
 *
 * Two patterns are used across the layer:
 *
 * 1. Class hosts — the custom element itself receives the component classes
 *    (`<zui-badge>` becomes `<zui-badge class="zui-badge …">`). Used wherever
 *    CSS only needs a class, since every ZUI component class sets its own
 *    `display`.
 * 2. Native-inner elements — where the platform requires a real native tag
 *    (`<button>`, `<input>`, `<dialog>`, …) the custom element renders it
 *    internally, moves its children into it, and forwards attributes.
 */

/** Read a string attribute, mapping `null` to `undefined` for cva defaults. */
export function stringAttr(el: HTMLElement, name: string): string | undefined {
  const value = el.getAttribute(name)
  return value === null ? undefined : value
}

/**
 * Read a boolean attribute. Presence means `true`, `"false"` means `false`,
 * absence means `undefined` (let the variant default apply).
 */
export function boolAttr(el: HTMLElement, name: string): boolean | undefined {
  const value = el.getAttribute(name)
  if (value === null) return undefined
  return value !== 'false'
}

export interface ClassHostConfig {
  /** cva resolver (or any props → class string function). */
  variants?: (props: Record<string, unknown>) => string
  /** Static class string used when there is no variant resolver. */
  baseClass?: string
  /** attribute name → variant prop name (e.g. `'gap-x': 'gapX'`). */
  attributes?: Record<string, string>
  /** Boolean attribute name → variant prop name (presence = true). */
  booleanAttributes?: Record<string, string>
  /** ARIA role applied on connect unless the author set one. */
  role?: string
  /** `data-*` (or other) attributes applied on connect. */
  hostAttributes?: Record<string, string>
}

/**
 * `HTMLElement` stand-in so this module can be imported (not used) in
 * DOM-less environments like SSR — element classes are only instantiated by
 * `customElements`, which never happens without a DOM.
 */
const BaseElement: typeof HTMLElement =
  typeof HTMLElement !== 'undefined'
    ? HTMLElement
    : (class {} as unknown as typeof HTMLElement)

export class ZuiElement extends BaseElement {
  #appliedClasses: string[] = []

  connectedCallback(): void {
    this.zuiSync()
  }

  attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue !== newValue && this.isConnected) this.zuiSync()
  }

  /** Recompute managed state. Overridden by concrete elements. */
  zuiSync(): void {}

  /**
   * Apply a computed class string to an element, removing only the classes
   * this component applied previously so author classes survive.
   */
  protected applyClasses(classes: string, target: Element = this): void {
    const next = classes.split(/\s+/).filter(Boolean)
    for (const name of this.#appliedClasses) {
      if (!next.includes(name)) target.classList.remove(name)
    }
    for (const name of next) target.classList.add(name)
    this.#appliedClasses = next
  }
}

/** Resolve variant props for a config from the element's attributes. */
export function readVariantProps(
  el: HTMLElement,
  config: ClassHostConfig,
): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const [attr, prop] of Object.entries(config.attributes ?? {})) {
    props[prop] = stringAttr(el, attr)
  }
  for (const [attr, prop] of Object.entries(config.booleanAttributes ?? {})) {
    props[prop] = boolAttr(el, attr)
  }
  return props
}

export function resolveClasses(
  el: HTMLElement,
  config: ClassHostConfig,
): string {
  if (config.variants) return config.variants(readVariantProps(el, config))
  return config.baseClass ?? ''
}

/**
 * Create a class-host custom element: the element applies component classes
 * to itself and re-resolves them when variant attributes change.
 */
export function classHostElement(config: ClassHostConfig): typeof ZuiElement {
  const observed = [
    ...Object.keys(config.attributes ?? {}),
    ...Object.keys(config.booleanAttributes ?? {}),
  ]

  return class extends ZuiElement {
    static get observedAttributes(): string[] {
      return observed
    }

    override connectedCallback(): void {
      if (config.role && !this.hasAttribute('role')) {
        this.setAttribute('role', config.role)
      }
      for (const [name, value] of Object.entries(config.hostAttributes ?? {})) {
        if (!this.hasAttribute(name)) this.setAttribute(name, value)
      }
      super.connectedCallback()
    }

    override zuiSync(): void {
      this.applyClasses(resolveClasses(this, config))
    }
  }
}

/** Move all of `host`'s children (except `inner`) into `inner`. */
export function adoptChildren(host: HTMLElement, inner: HTMLElement): void {
  for (const node of [...host.childNodes]) {
    if (node !== inner) inner.appendChild(node)
  }
}

/**
 * Keep adopting children that are appended to the host later (initial HTML
 * parsing, frameworks patching the DOM, `append()` calls).
 */
export function keepAdoptingChildren(
  host: HTMLElement,
  inner: HTMLElement,
): MutationObserver {
  const observer = new MutationObserver(() => {
    if (host.firstChild !== inner || host.childNodes.length > 1) {
      adoptChildren(host, inner)
    }
  })
  observer.observe(host, { childList: true })
  return observer
}

/**
 * Attributes never forwarded from a host to its inner native element.
 * `id` is only ever *moved* (via `move`) — copying it would duplicate ids.
 */
const FORWARD_EXCLUDED = new Set(['class', 'id', 'style', 'slot'])

function shouldForward(name: string, exclude: ReadonlySet<string>): boolean {
  if (FORWARD_EXCLUDED.has(name)) return false
  if (exclude.has(name)) return false
  if (name.startsWith('on')) return false
  if (name.startsWith('data-zui-')) return false
  return true
}

/**
 * Mirror the host's attributes onto the inner native element (initial copy +
 * live updates), excluding classes, styles, inline handlers and the
 * component's own variant attributes. `move` attributes are removed from the
 * host after copying (e.g. `id` on form controls, so labels target the real
 * control and ids stay unique).
 */
export function bindAttributeForwarding(
  host: HTMLElement,
  inner: HTMLElement,
  exclude: Iterable<string> = [],
  move: Iterable<string> = [],
): MutationObserver {
  const excluded = new Set(exclude)
  const moved = new Set(move)

  const forward = (name: string) => {
    if (moved.has(name)) {
      const value = host.getAttribute(name)
      if (value !== null) {
        inner.setAttribute(name, value)
        host.removeAttribute(name)
      }
      return
    }
    if (!shouldForward(name, excluded)) return
    const value = host.getAttribute(name)
    if (value === null) {
      inner.removeAttribute(name)
    } else {
      inner.setAttribute(name, value)
    }
  }

  for (const attr of [...host.attributes]) forward(attr.name)

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName) {
        forward(mutation.attributeName)
      }
    }
  })
  observer.observe(host, { attributes: true })
  return observer
}

/**
 * Run `cb` once the host's children are available: after `DOMContentLoaded`
 * while the document is still streaming in, otherwise on a microtask (so
 * sibling upgrades from the same parse/insert have finished).
 */
export function whenChildrenReady(host: HTMLElement, cb: () => void): void {
  const run = () => {
    if (host.isConnected) cb()
  }
  if (host.ownerDocument.readyState === 'loading') {
    host.ownerDocument.addEventListener('DOMContentLoaded', run, {
      once: true,
    })
  } else {
    queueMicrotask(run)
  }
}

/** True in any DOM-capable environment where custom elements exist. */
function canDefine(): boolean {
  return typeof window !== 'undefined' && typeof customElements !== 'undefined'
}

/** Register a custom element once; safe to call repeatedly and during SSR. */
export function defineElement(
  tag: string,
  ctor: CustomElementConstructor,
): void {
  if (!canDefine()) return
  if (!customElements.get(tag)) customElements.define(tag, ctor)
}
