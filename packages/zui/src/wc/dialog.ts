import { dialogVariants } from '../shared/dialogVariants'
import {
  adoptChildren,
  bindAttributeForwarding,
  classHostElement,
  keepAdoptingChildren,
  readVariantProps,
  ZuiElement,
} from './element'

const CONFIG = {
  attributes: { position: 'position', size: 'size' },
}

/**
 * `<zui-dialog>` renders an inner native `<dialog>` so `showModal()`, the
 * `::backdrop` and light dismiss all work natively. Open it with the `open`
 * attribute or the `showModal()` / `close()` methods on the host.
 */
export class ZuiDialog extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['position', 'size', 'open', 'closedby']
  }

  #dialog: HTMLDialogElement | null = null

  /** The rendered native `<dialog>`. */
  get dialog(): HTMLDialogElement | null {
    return this.#dialog
  }

  override zuiSync(): void {
    if (!this.#dialog) {
      const dialog = document.createElement('dialog')
      this.#dialog = dialog
      this.prepend(dialog)
      adoptChildren(this, dialog)
      keepAdoptingChildren(this, dialog)
      // `id` stays on the host: it exposes showModal()/close(), so
      // `document.getElementById('…').showModal()` works and ids stay unique.
      bindAttributeForwarding(this, dialog, [
        'position',
        'size',
        'open',
        'closedby',
        'id',
      ])
      dialog.addEventListener('close', () => {
        this.removeAttribute('open')
        this.dispatchEvent(new Event('close', { bubbles: false }))
      })
    }

    this.applyClasses(
      dialogVariants(readVariantProps(this, CONFIG)),
      this.#dialog,
    )
    this.#dialog.setAttribute(
      'closedby',
      this.getAttribute('closedby') ?? 'any',
    )

    const shouldBeOpen = this.hasAttribute('open')
    if (shouldBeOpen && !this.#dialog.open) this.showModal()
    else if (!shouldBeOpen && this.#dialog.open) this.#dialog.close()
  }

  showModal(): void {
    this.#dialog?.showModal()
  }

  show(): void {
    this.#dialog?.show()
  }

  close(returnValue?: string): void {
    this.#dialog?.close(returnValue)
  }
}

export const ZuiDialogHeader = classHostElement({
  baseClass: 'zui-dialog-header',
})
export const ZuiDialogBody = classHostElement({ baseClass: 'zui-dialog-body' })
export const ZuiDialogFooter = classHostElement({
  baseClass: 'zui-dialog-footer',
})
export const ZuiDialogTitle = classHostElement({
  baseClass: 'zui-dialog-title',
})
export const ZuiDialogDescription = classHostElement({
  baseClass: 'zui-dialog-description',
})
