import { boolAttr, ZuiElement } from './element'

function decorateDetails(
  details: HTMLDetailsElement,
  itemClass: string,
  triggerClass: string,
  contentClass: string,
): void {
  details.classList.add(itemClass)
  for (const child of details.children) {
    if (child.tagName === 'SUMMARY') child.classList.add(triggerClass)
    else child.classList.add(contentClass)
  }
}

/**
 * `<zui-accordion>` — accordion items stay native `<details>`/`<summary>`
 * elements (the CSS animates `::details-content`, which only exists on real
 * details). The custom element applies all `zui-accordion-*` classes for you:
 *
 * ```html
 * <zui-accordion>
 *   <details name="faq">
 *     <summary>Question</summary>
 *     <div>Answer</div>
 *   </details>
 * </zui-accordion>
 * ```
 */
export class ZuiAccordion extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['flush']
  }

  #observer: MutationObserver | null = null

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.#observer) {
      this.#observer = new MutationObserver(() => this.zuiSync())
      this.#observer.observe(this, { childList: true, subtree: true })
    }
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect()
    this.#observer = null
  }

  override zuiSync(): void {
    this.applyClasses(
      ['zui-accordion', boolAttr(this, 'flush') && 'zui-accordion-flush']
        .filter(Boolean)
        .join(' '),
    )
    for (const details of this.querySelectorAll<HTMLDetailsElement>(
      ':scope > details',
    )) {
      decorateDetails(
        details,
        'zui-accordion-item',
        'zui-accordion-trigger',
        'zui-accordion-content',
      )
    }
  }
}

/**
 * `<zui-collapsible>` — wraps a native `<details>` and applies the
 * `zui-collapsible-*` classes to it, its `<summary>` and its content:
 *
 * ```html
 * <zui-collapsible>
 *   <details>
 *     <summary>Show more</summary>
 *     <div>Hidden content</div>
 *   </details>
 * </zui-collapsible>
 * ```
 */
export class ZuiCollapsible extends ZuiElement {
  #observer: MutationObserver | null = null

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.#observer) {
      this.#observer = new MutationObserver(() => this.zuiSync())
      this.#observer.observe(this, { childList: true, subtree: true })
    }
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect()
    this.#observer = null
  }

  override zuiSync(): void {
    for (const details of this.querySelectorAll<HTMLDetailsElement>(
      ':scope > details',
    )) {
      decorateDetails(
        details,
        'zui-collapsible',
        'zui-collapsible-trigger',
        'zui-collapsible-content',
      )
    }
  }
}
