/**
 * Step the number field that contains `button` up or down by the input's
 * `step`, inside its `min`/`max`. Uses the native stepUp()/stepDown(), then
 * fires `input` and `change` so React, Solid, Svelte and Vue bindings see the
 * new value. Shared by every framework wrapper.
 */
export function stepNumberField(button: Element, direction: 'up' | 'down') {
  const input = button
    .closest('.zui-number-field')
    ?.querySelector<HTMLInputElement>('.zui-number-field-input')
  if (!input || input.disabled || input.readOnly) return

  const before = input.value
  // stepUp() throws for step="any". Use step 1 instead (moves to the next whole number).
  const anyStep = input.step.toLowerCase() === 'any'
  if (anyStep) input.step = '1'
  if (direction === 'up') input.stepUp()
  else input.stepDown()
  if (anyStep) input.step = 'any'
  if (input.value === before) return

  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}
