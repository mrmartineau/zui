import {
  adoptChildren,
  bindAttributeForwarding,
  classHostElement,
  keepAdoptingChildren,
  ZuiElement,
} from './element'

/**
 * `<zui-card>` is a class host; with an `href` attribute it renders an inner
 * `<a>` carrying the card classes instead, mirroring the other wrappers'
 * interactive-card behaviour.
 */
export class ZuiCard extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['href']
  }

  #anchor: HTMLAnchorElement | null = null

  override zuiSync(): void {
    const href = this.getAttribute('href')

    if (href && !this.#anchor) {
      const anchor = document.createElement('a')
      this.#anchor = anchor
      this.applyClasses('', this)
      this.prepend(anchor)
      adoptChildren(this, anchor)
      keepAdoptingChildren(this, anchor)
      bindAttributeForwarding(this, anchor, [])
    }

    if (this.#anchor) {
      this.applyClasses('zui-card zui-card-interactive', this.#anchor)
    } else {
      this.applyClasses('zui-card')
    }
  }
}

export const ZuiCardHeader = classHostElement({ baseClass: 'zui-card-header' })
export const ZuiCardTitle = classHostElement({ baseClass: 'zui-card-title' })
export const ZuiCardDescription = classHostElement({
  baseClass: 'zui-card-description',
})
export const ZuiCardBody = classHostElement({ baseClass: 'zui-card-body' })
