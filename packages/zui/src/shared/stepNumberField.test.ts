import { describe, expect, it, vi } from 'vitest'
import { stepNumberField } from './stepNumberField'

function setup(attrs: string) {
  document.body.innerHTML = `<div class="zui-number-field">
    <button id="down"></button>
    <input class="zui-number-field-input" type="number" ${attrs} />
    <button id="up"></button>
  </div>`
  const input = document.querySelector('input') as HTMLInputElement
  const onInput = vi.fn()
  input.addEventListener('input', onInput)
  return {
    down: document.getElementById('down') as HTMLElement,
    input,
    onInput,
    up: document.getElementById('up') as HTMLElement,
  }
}

describe('stepNumberField', () => {
  it('steps by the step attribute and fires input', () => {
    const { up, down, input, onInput } = setup('value="5" step="5"')
    stepNumberField(up, 'up')
    expect(input.value).toBe('10')
    stepNumberField(down, 'down')
    stepNumberField(down, 'down')
    expect(input.value).toBe('0')
    expect(onInput).toHaveBeenCalledTimes(3)
  })

  it('stops at max and fires no event', () => {
    const { up, input, onInput } = setup('value="3" max="3"')
    stepNumberField(up, 'up')
    expect(input.value).toBe('3')
    expect(onInput).not.toHaveBeenCalled()
  })

  it('does nothing when disabled', () => {
    const { up, input } = setup('value="1" disabled')
    stepNumberField(up, 'up')
    expect(input.value).toBe('1')
  })
})
