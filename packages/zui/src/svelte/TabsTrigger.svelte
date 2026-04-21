<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsTriggerVariants } from '../shared/tabsVariants'
import { getTabsContext, getTabsTriggerOrder } from './tabsContext'

type Props = HTMLButtonAttributes & {
  value: string
  class?: string
  children?: Snippet
}

let {
  class: className,
  disabled = false,
  onblur,
  onclick,
  onfocus,
  onkeydown,
  value,
  children,
  ...rest
}: Props = $props()

const { controller, getRoot, getSnapshot } = getTabsContext()
let ref = $state<HTMLButtonElement | undefined>()
const snapshot = $derived(getSnapshot())
const classes = $derived(tabsTriggerVariants({ className }))
const isActive = $derived(snapshot.selectedValue === value)
const triggerId = $derived(createTabsTriggerId(snapshot.rootId, value))
const panelId = $derived(createTabsContentId(snapshot.rootId, value))

$effect(() => {
  const unregister = controller.registerTrigger({
    disabled,
    element: ref ?? null,
    order: getTabsTriggerOrder(getRoot(), ref),
    panelId,
    triggerId,
    value,
  })

  return unregister
})
</script>

<button
  {...rest}
  bind:this={ref}
  aria-controls={panelId}
  aria-selected={isActive}
  class={classes}
  data-disabled={disabled ? 'true' : undefined}
  data-orientation={snapshot.orientation}
  data-state={isActive ? 'active' : 'inactive'}
  data-value={value}
  data-zui-tabs-trigger=""
  disabled={disabled || snapshot.disabled}
  id={triggerId}
  on:blur={(event) => {
    onblur?.(event)
    if (!event.defaultPrevented) controller.blurTrigger(value)
  }}
  on:click={(event) => {
    onclick?.(event)
    if (!event.defaultPrevented) controller.clickTrigger(value)
  }}
  on:focus={(event) => {
    onfocus?.(event)
    if (!event.defaultPrevented) controller.focusTrigger(value)
  }}
  on:keydown={(event) => {
    onkeydown?.(event)
    if (!event.defaultPrevented) controller.handleTriggerKeydown(event, value)
  }}
  role="tab"
  tabindex={isActive ? 0 : -1}
  type="button"
>
  {@render children?.()}
</button>
