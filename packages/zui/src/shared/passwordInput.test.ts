import { expect, it } from 'vitest'
import { togglePasswordInput } from './passwordInput'

it('toggles the input type and aria-pressed', () => {
  document.body.innerHTML = `
    <div class="zui-password-input">
      <input type="password" />
      <button aria-pressed="false"></button>
    </div>`
  const input = document.querySelector('input') as HTMLInputElement
  const button = document.querySelector('button') as HTMLButtonElement

  togglePasswordInput(button)
  expect(input.type).toBe('text')
  expect(button.getAttribute('aria-pressed')).toBe('true')

  togglePasswordInput(button)
  expect(input.type).toBe('password')
  expect(button.getAttribute('aria-pressed')).toBe('false')
})
