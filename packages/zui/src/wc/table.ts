import { ZuiElement } from './element'

const TAG_CLASSES: Record<string, string> = {
  CAPTION: 'zui-table-caption',
  TABLE: 'zui-table',
  TBODY: 'zui-table-body',
  TD: 'zui-table-cell',
  TFOOT: 'zui-table-footer',
  TH: 'zui-table-head',
  THEAD: 'zui-table-header',
  TR: 'zui-table-row',
}

/**
 * `<zui-table>` — table markup must stay native (the HTML parser does not
 * allow custom elements inside `<table>`), so this element wraps a real
 * `<table>` and applies every `zui-table-*` class to it and its parts:
 *
 * ```html
 * <zui-table>
 *   <table>
 *     <thead><tr><th>Name</th></tr></thead>
 *     <tbody><tr><td>Ada</td></tr></tbody>
 *   </table>
 * </zui-table>
 * ```
 *
 * Rows added later (e.g. by a framework) are decorated automatically.
 */
export class ZuiTable extends ZuiElement {
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
    for (const element of this.querySelectorAll(
      'table, thead, tbody, tfoot, tr, th, td, caption',
    )) {
      const className = TAG_CLASSES[element.tagName]
      if (className) element.classList.add(className)
    }
  }
}
