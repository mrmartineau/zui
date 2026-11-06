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
  // ponytail: stepUp() throws for step="any"; set a numeric step if buttons are needed
  if (direction === 'up') input.stepUp()
  else input.stepDown()
  if (input.value === before) return

  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}
