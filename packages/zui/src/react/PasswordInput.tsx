import type { VariantProps } from 'cva'
import { type InputHTMLAttributes, useState } from 'react'
import { inputVariants } from '../shared/inputVariants'
import { passwordInputToggleClass } from '../shared/passwordInput'

type InputVariantProps = VariantProps<typeof inputVariants>

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> &
  InputVariantProps & {
    className?: string
    toggleLabel?: string
  }

export function PasswordInput({
  className,
  shape,
  toggleLabel = 'Show password',
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div
      className={['zui-password-input', className].filter(Boolean).join(' ')}
    >
      <input
        className={inputVariants({ shape })}
        type={visible ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        className={passwordInputToggleClass}
        aria-label={toggleLabel}
        aria-pressed={visible}
        disabled={props.disabled}
        onClick={() => setVisible((v) => !v)}
      >
        <i
          className={`ph ${visible ? 'ph-eye-slash' : 'ph-eye'}`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
