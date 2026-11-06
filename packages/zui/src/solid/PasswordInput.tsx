import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { createSignal, splitProps } from 'solid-js'
import { inputVariants } from '../shared/inputVariants'
import { passwordInputToggleClass } from '../shared/passwordInput'

type InputVariantProps = VariantProps<typeof inputVariants>

export type PasswordInputProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'type'
> &
  InputVariantProps & {
    class?: string
    toggleLabel?: string
  }

export function PasswordInput(props: PasswordInputProps) {
  const [local, rest] = splitProps(props, ['class', 'shape', 'toggleLabel'])
  const [visible, setVisible] = createSignal(false)
  return (
    <div class={['zui-password-input', local.class].filter(Boolean).join(' ')}>
      <input
        class={inputVariants({ shape: local.shape })}
        type={visible() ? 'text' : 'password'}
        {...rest}
      />
      <button
        type="button"
        class={passwordInputToggleClass}
        aria-label={local.toggleLabel ?? 'Show password'}
        aria-pressed={visible()}
        disabled={rest.disabled}
        onClick={() => setVisible((v) => !v)}
      >
        <i
          class={`ph ${visible() ? 'ph-eye-slash' : 'ph-eye'}`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
