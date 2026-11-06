<script lang="ts">
import type { VariantProps } from 'cva'
import type { HTMLInputAttributes } from 'svelte/elements'
import { inputVariants } from '../shared/inputVariants'
import { passwordInputToggleClass } from '../shared/passwordInput'

type InputVariantProps = VariantProps<typeof inputVariants>

type Props = Omit<HTMLInputAttributes, 'type'> & {
  class?: string
  shape?: InputVariantProps['shape']
  toggleLabel?: string
  value?: string | number | null
}

let {
  class: className,
  shape,
  toggleLabel = 'Show password',
  value = $bindable(),
  ...rest
}: Props = $props()

let visible = $state(false)
const classes = $derived(
  ['zui-password-input', className].filter(Boolean).join(' '),
)
</script>

<div class={classes}>
  <input
    class={inputVariants({ shape })}
    type={visible ? 'text' : 'password'}
    bind:value
    {...rest}
  />
  <button
    type="button"
    class={passwordInputToggleClass}
    aria-label={toggleLabel}
    aria-pressed={visible}
    disabled={rest.disabled}
    onclick={() => (visible = !visible)}
  >
    <i class="ph {visible ? 'ph-eye-slash' : 'ph-eye'}" aria-hidden="true"></i>
  </button>
</div>
