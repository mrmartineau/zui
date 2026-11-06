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
  const onChange = vi.fn()
  input.addEventListener('input', onInput)
  input.addEventListener('change', onChange)
  return {
    down: document.getElementById('down') as HTMLElement,
    input,
    onChange,
    onInput,
    up: document.getElementById('up') as HTMLElement,
  }
}

describe('stepNumberField', () => {
  it('steps by the step attribute and fires input and change', () => {
    const { up, down, input, onInput, onChange } = setup('value="5" step="5"')
    stepNumberField(up, 'up')
    expect(input.value).toBe('10')
    stepNumberField(down, 'down')
    stepNumberField(down, 'down')
    expect(input.value).toBe('0')
    expect(onInput).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('stops at max and fires no event', () => {
    const { up, input, onInput, onChange } = setup('value="3" max="3"')
    stepNumberField(up, 'up')
    expect(input.value).toBe('3')
    expect(onInput).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('uses step 1 when step is "any"', () => {
    const { up, input } = setup('value="1.5" step="any"')
    expect(() => stepNumberField(up, 'up')).not.toThrow()
    expect(Number(input.value)).toBeGreaterThan(1.5)
    expect(input.step).toBe('any')
  })

  it.each(['disabled', 'readonly'])('does nothing when %s', (attr) => {
    const { up, input, onInput, onChange } = setup(`value="1" ${attr}`)
    stepNumberField(up, 'up')
    expect(input.value).toBe('1')
    expect(onInput).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })
})
