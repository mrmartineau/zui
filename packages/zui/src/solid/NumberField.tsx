import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { numberFieldVariants } from '../shared/numberFieldVariants'
import { stepNumberField } from '../shared/stepNumberField'

type NumberFieldVariantProps = VariantProps<typeof numberFieldVariants>

export type NumberFieldProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'type'
> &
  NumberFieldVariantProps & {
    /** Class for the wrapper. Other props go to the `<input>`. */
    class?: string
    decrementLabel?: string
    incrementLabel?: string
  }

export function NumberField(props: NumberFieldProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'shape',
    'decrementLabel',
    'incrementLabel',
  ])
  const classes = () =>
    numberFieldVariants({ class: local.class, shape: local.shape })
  const buttonDisabled = () =>
    Boolean(rest.disabled || rest.readOnly || rest.readonly)
  return (
    <div class={classes()}>
      <button
        type="button"
        class="zui-number-field-button"
        tabIndex={-1}
        aria-label={local.decrementLabel ?? 'Decrease'}
        disabled={buttonDisabled()}
        onClick={(e) => stepNumberField(e.currentTarget, 'down')}
      >
        <i class="ph ph-minus" aria-hidden="true" />
      </button>
      <input type="number" class="zui-input zui-number-field-input" {...rest} />
      <button
        type="button"
        class="zui-number-field-button"
        tabIndex={-1}
        aria-label={local.incrementLabel ?? 'Increase'}
        disabled={buttonDisabled()}
        onClick={(e) => stepNumberField(e.currentTarget, 'up')}
      >
        <i class="ph ph-plus" aria-hidden="true" />
      </button>
    </div>
  )
}
