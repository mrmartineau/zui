<script lang="ts">
import type { VariantProps } from 'cva'
import type { HTMLInputAttributes } from 'svelte/elements'
import { numberFieldVariants } from '../shared/numberFieldVariants'
import { stepNumberField } from '../shared/stepNumberField'

type NumberFieldVariantProps = VariantProps<typeof numberFieldVariants>

type Props = Omit<HTMLInputAttributes, 'type'> & {
  /** Class for the wrapper. Other props go to the `<input>`. */
  class?: string
  shape?: NumberFieldVariantProps['shape']
  value?: number | null
  decrementLabel?: string
  incrementLabel?: string
}

let {
  class: className,
  shape,
  value = $bindable(),
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  disabled,
  readonly,
  ...rest
}: Props = $props()

const classes = $derived(numberFieldVariants({ className, shape }))
const buttonDisabled = $derived(Boolean(disabled || readonly))
</script>

<div class={classes}>
  <button
    type="button"
    class="zui-number-field-button"
    tabindex="-1"
    aria-label={decrementLabel}
    disabled={buttonDisabled}
    onclick={(e) => stepNumberField(e.currentTarget, 'down')}
  >
    <i class="ph ph-minus" aria-hidden="true"></i>
  </button>
  <input
    type="number"
    class="zui-input zui-number-field-input"
    bind:value
    {disabled}
    {readonly}
    {...rest}
  />
  <button
    type="button"
    class="zui-number-field-button"
    tabindex="-1"
    aria-label={incrementLabel}
    disabled={buttonDisabled}
    onclick={(e) => stepNumberField(e.currentTarget, 'up')}
  >
    <i class="ph ph-plus" aria-hidden="true"></i>
  </button>
</div>
