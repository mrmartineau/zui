import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import type { VariantProps } from 'cva'
import type { InputHTMLAttributes } from 'react'
import { numberFieldVariants } from '../shared/numberFieldVariants'
import { stepNumberField } from '../shared/stepNumberField'

type NumberFieldVariantProps = VariantProps<typeof numberFieldVariants>

export type NumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> &
  NumberFieldVariantProps & {
    /** Class for the wrapper. Other props go to the `<input>`. */
    className?: string
    decrementLabel?: string
    incrementLabel?: string
  }

export function NumberField({
  className,
  shape,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  disabled,
  readOnly,
  ...props
}: NumberFieldProps) {
  const classes = numberFieldVariants({ className, shape })
  const buttonDisabled = disabled || readOnly
  return (
    <div className={classes}>
      <button
        type="button"
        className="zui-number-field-button"
        tabIndex={-1}
        aria-label={decrementLabel}
        disabled={buttonDisabled}
        onClick={(e) => stepNumberField(e.currentTarget, 'down')}
      >
        <MinusIcon aria-hidden="true" />
      </button>
      <input
        type="number"
        className="zui-input zui-number-field-input"
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
      <button
        type="button"
        className="zui-number-field-button"
        tabIndex={-1}
        aria-label={incrementLabel}
        disabled={buttonDisabled}
        onClick={(e) => stepNumberField(e.currentTarget, 'up')}
      >
        <PlusIcon aria-hidden="true" />
      </button>
    </div>
  )
}
