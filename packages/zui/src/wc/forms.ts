import {
  adoptChildren,
  bindAttributeForwarding,
  keepAdoptingChildren,
  ZuiElement,
} from './element'

/**
 * Base for hosts that render a real native form control inside themselves.
 * The control participates in surrounding `<form>`s natively (light DOM) and
 * `id` is moved onto it so `<label for>` targets the actual control.
 */
abstract class ZuiFormControl<
  T extends HTMLElement = HTMLElement,
> extends ZuiElement {
  protected inner: T | null = null

  /** The rendered native control. */
  get control(): T | null {
    return this.inner
  }

  protected abstract createControl(): T

  /** Whether host children should be moved into the control (e.g. options). */
  protected adoptsChildren(): boolean {
    return false
  }

  override zuiSync(): void {
    if (this.inner) return
    const inner = this.createControl()
    this.inner = inner
    this.prepend(inner)
    if (this.adoptsChildren()) {
      adoptChildren(this, inner)
      keepAdoptingChildren(this, inner)
    }
    bindAttributeForwarding(this, inner, ['value'], ['id'])
    const value = this.getAttribute('value')
    if (value !== null) this.value = value
  }

  get value(): string {
    const control = this.inner as unknown as { value?: string } | null
    return control?.value ?? this.getAttribute('value') ?? ''
  }

  set value(next: string) {
    const control = this.inner as unknown as { value?: string } | null
    if (control) control.value = next
  }
}

/** `<zui-input type="email" placeholder="…">` */
export class ZuiInput extends ZuiFormControl<HTMLInputElement> {
  protected createControl(): HTMLInputElement {
    const input = document.createElement('input')
    input.className = 'zui-input'
    return input
  }
}

/** `<zui-textarea rows="4">Initial value</zui-textarea>` */
export class ZuiTextarea extends ZuiFormControl<HTMLTextAreaElement> {
  protected createControl(): HTMLTextAreaElement {
    const textarea = document.createElement('textarea')
    textarea.className = 'zui-textarea'
    // Text children become the initial value. They may arrive after the
    // element upgrades (streaming parse), so keep absorbing them.
    const absorb = () => {
      let initial = ''
      for (const node of [...this.childNodes]) {
        if (node === textarea) continue
        initial += node.textContent ?? ''
        node.remove()
      }
      const trimmed = initial.trim()
      if (trimmed && !textarea.value) textarea.value = trimmed
    }
    queueMicrotask(absorb)
    new MutationObserver(absorb).observe(this, { childList: true })
    return textarea
  }
}

/** `<zui-select>` — slotted `<option>`s are moved into the native select. */
export class ZuiSelect extends ZuiFormControl<HTMLSelectElement> {
  protected createControl(): HTMLSelectElement {
    const select = document.createElement('select')
    select.className = 'zui-select'
    return select
  }

  protected override adoptsChildren(): boolean {
    return true
  }
}

/**
 * Base for `<zui-checkbox>` / `<zui-radio>`: renders the same
 * `<label class="zui-…"><input type="…"> label text</label>` markup as the
 * other wrappers. Form attributes live on the host and are forwarded to the
 * input; the host's children become the label text.
 */
abstract class ZuiToggleControl extends ZuiElement {
  protected input: HTMLInputElement | null = null

  protected abstract inputType(): 'checkbox' | 'radio'
  protected abstract labelClass(): string

  /** The rendered native input. */
  get control(): HTMLInputElement | null {
    return this.input
  }

  override zuiSync(): void {
    if (this.input) return
    const label = document.createElement('label')
    label.className = this.labelClass()
    const input = document.createElement('input')
    input.type = this.inputType()
    this.input = input
    label.appendChild(input)
    this.prepend(label)
    for (const node of [...this.childNodes]) {
      if (node !== label) label.appendChild(node)
    }
    const observer = new MutationObserver(() => {
      for (const node of [...this.childNodes]) {
        if (node !== label) label.appendChild(node)
      }
    })
    observer.observe(this, { childList: true })
    bindAttributeForwarding(this, input, [], ['id'])
  }

  get checked(): boolean {
    return this.input?.checked ?? this.hasAttribute('checked')
  }

  set checked(next: boolean) {
    if (this.input) this.input.checked = next
  }

  get value(): string {
    return this.input?.value ?? this.getAttribute('value') ?? 'on'
  }

  set value(next: string) {
    if (this.input) this.input.value = next
  }
}

export class ZuiCheckbox extends ZuiToggleControl {
  protected inputType(): 'checkbox' {
    return 'checkbox'
  }

  protected labelClass(): string {
    return 'zui-checkbox'
  }
}

export class ZuiRadio extends ZuiToggleControl {
  protected inputType(): 'radio' {
    return 'radio'
  }

  protected labelClass(): string {
    return 'zui-radio'
  }
}

/**
 * `<zui-label for="…">` — the host carries the `zui-label` class (so field
 * layout selectors keep matching) and wraps its children in a real `<label>`
 * for native control association.
 */
export class ZuiLabel extends ZuiElement {
  #label: HTMLLabelElement | null = null

  override zuiSync(): void {
    this.applyClasses('zui-label')
    if (this.#label) return
    const label = document.createElement('label')
    this.#label = label
    this.prepend(label)
    adoptChildren(this, label)
    keepAdoptingChildren(this, label)
    bindAttributeForwarding(this, label, ['class'])
  }
}
