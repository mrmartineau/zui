import { buttonVariants } from './buttonVariants'

export const passwordInputToggleClass = buttonVariants({
  class: 'zui-password-input-toggle',
  icon: true,
  size: 'sm',
  variant: 'ghost',
})

/** Plain-DOM toggle used by the Astro wrapper and plain-HTML users. */
export function togglePasswordInput(button: HTMLButtonElement) {
  const input = button
    .closest('.zui-password-input')
    ?.querySelector<HTMLInputElement>('input')
  if (!input) return
  const show = input.type === 'password'
  input.type = show ? 'text' : 'password'
  button.setAttribute('aria-pressed', String(show))
}
