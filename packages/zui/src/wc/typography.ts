import { type TextSize, textSizeClass } from '../shared/textSizeClass'
import {
  adoptChildren,
  bindAttributeForwarding,
  classHostElement,
  keepAdoptingChildren,
  ZuiElement,
} from './element'

export const ZuiText = classHostElement({
  attributes: { size: 'size' },
  variants: (props) => textSizeClass((props.size as TextSize) ?? '0'),
})

export const ZuiCode = classHostElement({ baseClass: 'zui-code' })
export const ZuiKbd = classHostElement({ baseClass: 'zui-kbd' })
export const ZuiKbdGroup = classHostElement({ baseClass: 'zui-kbd-group' })
export const ZuiProse = classHostElement({ baseClass: 'prose' })

/** `<zui-pre>` renders an inner `<pre>` so whitespace behaviour is native. */
export class ZuiPre extends ZuiElement {
  #pre: HTMLPreElement | null = null

  override zuiSync(): void {
    if (!this.#pre) {
      const pre = document.createElement('pre')
      pre.className = 'zui-pre'
      this.#pre = pre
      this.prepend(pre)
      adoptChildren(this, pre)
      keepAdoptingChildren(this, pre)
      bindAttributeForwarding(this, pre)
    }
  }
}

/** `<zui-link href="…">` renders an inner `<a>` so navigation is native. */
export class ZuiLink extends ZuiElement {
  #anchor: HTMLAnchorElement | null = null

  override zuiSync(): void {
    if (!this.#anchor) {
      const anchor = document.createElement('a')
      anchor.className = 'zui-link'
      this.#anchor = anchor
      this.prepend(anchor)
      adoptChildren(this, anchor)
      keepAdoptingChildren(this, anchor)
      bindAttributeForwarding(this, anchor)
    }
  }
}
