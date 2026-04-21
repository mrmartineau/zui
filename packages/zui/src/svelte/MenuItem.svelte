<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type {
  HTMLAnchorAttributes,
  HTMLButtonAttributes,
} from 'svelte/elements'
import { createMenuItemId } from '../core/menu'
import { buttonVariants } from '../shared/buttonVariants'
import { getMenuContext, getMenuItemOrder } from './menuContext'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type Props = (HTMLButtonAttributes & HTMLAnchorAttributes) & {
  class?: string
  disabled?: boolean
  href?: string
  id?: string
  textValue?: string
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
  href,
  id,
  textValue,
  variant = 'ghost',
  color,
  size,
  shape,
  icon,
  children,
  onClick,
  onFocus,
  onPointerEnter,
  ...rest
}: Props = $props()

const { controller, getRoot, getSnapshot } = getMenuContext()
let ref = $state<HTMLElement | undefined>()
const fallbackId = createMenuItemId(getSnapshot().rootId)
const itemId = $derived(id ?? fallbackId)
const highlighted = $derived(getSnapshot().highlightedItemId === itemId)
const classes = $derived(
  buttonVariants({
    className: ['zui-menu-item', className].filter(Boolean).join(' '),
    color,
    icon,
    shape,
    size,
    variant,
  }),
)

$effect(() =>
  controller.registerItem({
    disabled,
    element: ref ?? null,
    id: itemId,
    kind: href ? 'link' : 'button',
    order: getMenuItemOrder(getRoot(), ref),
    textValue,
  }),
)
</script>

{#if href}
  <a
    {...rest}
    bind:this={ref}
    aria-disabled={getSnapshot().disabled || disabled ? 'true' : undefined}
    class={classes}
    data-disabled={getSnapshot().disabled || disabled ? 'true' : undefined}
    data-highlighted={highlighted ? 'true' : undefined}
    data-text-value={textValue}
    data-zui-menu-item=""
    {href}
    id={itemId}
    on:click={(event) => {
      onClick?.(event)
      if (!event.defaultPrevented) {
        const accepted = controller.selectItem(itemId)
        if (!accepted && (getSnapshot().disabled || disabled)) event.preventDefault()
      }
    }}
    on:focus={(event) => {
      onFocus?.(event)
      if (!event.defaultPrevented) controller.focusItem(itemId)
    }}
    on:pointerenter={(event) => {
      onPointerEnter?.(event)
      if (!event.defaultPrevented) controller.handleItemPointerEnter(itemId)
    }}
    role="menuitem"
    tabindex={getSnapshot().open && highlighted ? 0 : -1}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    {...rest}
    bind:this={ref}
    class={classes}
    data-disabled={getSnapshot().disabled || disabled ? 'true' : undefined}
    data-highlighted={highlighted ? 'true' : undefined}
    data-text-value={textValue}
    data-zui-menu-item=""
    disabled={getSnapshot().disabled || disabled}
    id={itemId}
    on:click={(event) => {
      onClick?.(event)
      if (!event.defaultPrevented) controller.selectItem(itemId)
    }}
    on:focus={(event) => {
      onFocus?.(event)
      if (!event.defaultPrevented) controller.focusItem(itemId)
    }}
    on:pointerenter={(event) => {
      onPointerEnter?.(event)
      if (!event.defaultPrevented) controller.handleItemPointerEnter(itemId)
    }}
    role="menuitem"
    tabindex={getSnapshot().open && highlighted ? 0 : -1}
    type="button"
  >
    {@render children?.()}
  </button>
{/if}
