<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'
import { buttonVariants } from '../shared/buttonVariants'
import { getMenuContext } from './menuContext'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type Props = HTMLButtonAttributes & {
  class?: string
  disabled?: boolean
  variant?: ButtonVariantProps['variant']
  color?: ButtonVariantProps['color']
  size?: ButtonVariantProps['size']
  shape?: ButtonVariantProps['shape']
  icon?: ButtonVariantProps['icon']
  children?: Snippet
}

let {
  class: className,
  disabled = false,
  variant = 'outline',
  color,
  size,
  shape,
  icon,
  children,
  onClick,
  onKeyDown,
  ...rest
}: Props = $props()

const { controller, getSnapshot } = getMenuContext()
let ref = $state<HTMLButtonElement | undefined>()

$effect(() => controller.registerTrigger({ disabled, element: ref ?? null, triggerId: getSnapshot().triggerId }))

const classes = $derived(
  buttonVariants({
    className: ['zui-menu-trigger', className].filter(Boolean).join(' '),
    color,
    icon,
    shape,
    size,
    variant,
  }),
)
</script>

<button
  {...rest}
  bind:this={ref}
  aria-controls={getSnapshot().contentId}
  aria-expanded={getSnapshot().open}
  aria-haspopup="menu"
  class={classes}
  data-disabled={getSnapshot().triggerDisabled ? 'true' : undefined}
  data-state={getSnapshot().open ? 'open' : 'closed'}
  data-zui-menu-trigger=""
  disabled={getSnapshot().disabled || disabled}
  id={getSnapshot().triggerId}
  on:click={(event) => {
    onClick?.(event)
    if (!event.defaultPrevented) controller.handleTriggerClick()
  }}
  on:keydown={(event) => {
    onKeyDown?.(event)
    if (!event.defaultPrevented) controller.handleTriggerKeydown(event)
  }}
  type="button"
>
  {@render children?.()}
</button>
