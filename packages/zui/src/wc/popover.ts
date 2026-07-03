import { ZuiElement } from './element'

/**
 * `<zui-popover id="my-popover" type="auto">` — the host itself is the
 * popover: the native popover attribute works on any element, so buttons
 * with `popovertarget="my-popover"` open it and CSS anchor positioning uses
 * `--my-popover` as the anchor name (set `anchor-name` on the trigger).
 */
export class ZuiPopover extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['id', 'type']
  }

  override zuiSync(): void {
    this.applyClasses('zui-popover')
    this.setAttribute('popover', this.getAttribute('type') ?? 'auto')
    if (this.id) {
      this.style.setProperty('position-anchor', `--${this.id}`)
    }
  }
}
