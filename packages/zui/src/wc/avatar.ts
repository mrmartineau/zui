import { avatarVariants } from '../shared/avatarVariants'
import { readVariantProps, stringAttr, ZuiElement } from './element'

const CONFIG = {
  attributes: { shape: 'shape', size: 'size' },
}

/**
 * `<zui-avatar src="…" alt="…" fallback="ZM" size="lg">` — renders the same
 * fallback + image markup as the other wrappers.
 */
export class ZuiAvatar extends ZuiElement {
  static get observedAttributes(): string[] {
    return ['shape', 'size', 'src', 'alt', 'fallback']
  }

  #fallback: HTMLSpanElement | null = null
  #image: HTMLImageElement | null = null

  override zuiSync(): void {
    this.applyClasses(avatarVariants(readVariantProps(this, CONFIG)))

    if (!this.#fallback) {
      const fallback = document.createElement('span')
      fallback.className = 'zui-avatar-fallback'
      this.#fallback = fallback
      this.prepend(fallback)
    }

    const fallbackText = stringAttr(this, 'fallback')
    if (fallbackText) {
      this.#fallback.textContent = fallbackText
    } else if (!this.#fallback.firstChild) {
      const icon = document.createElement('i')
      icon.className = 'ph ph-user'
      icon.setAttribute('aria-hidden', 'true')
      this.#fallback.appendChild(icon)
    }

    const src = stringAttr(this, 'src')
    if (src) {
      if (!this.#image) {
        const image = document.createElement('img')
        image.className = 'zui-avatar-image'
        image.addEventListener('error', () => {
          image.setAttribute('data-error', '')
        })
        this.#image = image
        this.appendChild(image)
      }
      this.#image.src = src
      this.#image.alt = stringAttr(this, 'alt') ?? ''
    } else if (this.#image) {
      this.#image.remove()
      this.#image = null
    }
  }
}
