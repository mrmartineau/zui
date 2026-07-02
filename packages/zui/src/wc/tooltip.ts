import { tooltipVariants } from '../shared/tooltipVariants'
import { ZuiElement } from './element'

let tooltipCount = 0

/**
 * `<zui-tooltip text="Save your work" placement="top">…trigger…</zui-tooltip>`
 * — renders the same trigger + manual-popover markup as the other wrappers,
 * shown on hover and keyboard focus.
 */
export class ZuiTooltip extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['text', 'placement']
  }

  #trigger: HTMLSpanElement | null = null
  #content: HTMLSpanElement | null = null

  override zuiSync(): void {
    this.applyClasses('zui-tooltip')

    if (!this.#trigger) {
      tooltipCount += 1
      const id = this.id ? `${this.id}-tooltip` : `zui-tooltip-${tooltipCount}`
      const anchorName = `--${id}`

      const trigger = document.createElement('span')
      trigger.style.setProperty('anchor-name', anchorName)
      this.#trigger = trigger

      const content = document.createElement('span')
      content.id = id
      content.setAttribute('popover', 'manual')
      content.setAttribute('role', 'tooltip')
      content.style.setProperty('position-anchor', anchorName)
      this.#content = content

      this.prepend(trigger)
      this.appendChild(content)
      for (const node of [...this.childNodes]) {
        if (node !== trigger && node !== content) trigger.appendChild(node)
      }
      const observer = new MutationObserver(() => {
        for (const node of [...this.childNodes]) {
          if (node !== trigger && node !== content) trigger.appendChild(node)
        }
      })
      observer.observe(this, { childList: true })

      const show = () => content.showPopover?.()
      const hide = () => content.hidePopover?.()
      trigger.addEventListener('mouseenter', show)
      trigger.addEventListener('mouseleave', hide)
      trigger.addEventListener('focusin', show)
      trigger.addEventListener('focusout', hide)
    }

    if (this.#content) {
      const placementClass = tooltipVariants({
        placement: (this.getAttribute('placement') ?? undefined) as never,
      })
        .split(' ')
        .find((name: string) => name.startsWith('zui-tooltip-placement-'))
      this.#content.className = ['zui-tooltip-content', placementClass]
        .filter(Boolean)
        .join(' ')
      this.#content.textContent = this.getAttribute('text') ?? ''
    }
  }
}
