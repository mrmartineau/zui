<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsContentVariants } from '../shared/tabsVariants'
import { getTabsContext } from './tabsContext'

type Props = HTMLAttributes<HTMLDivElement> & {
  value: string
  class?: string
  children?: Snippet
}

let { class: className, hidden, value, children, ...rest }: Props = $props()

const { controller, getSnapshot } = getTabsContext()
let ref = $state<HTMLDivElement | undefined>()
const snapshot = $derived(getSnapshot())
const classes = $derived(tabsContentVariants({ className }))
const isActive = $derived(snapshot.selectedValue === value)
const triggerId = $derived(createTabsTriggerId(snapshot.rootId, value))
const panelId = $derived(createTabsContentId(snapshot.rootId, value))

$effect(() => {
  const unregister = controller.registerContent({
    element: ref ?? null,
    panelId,
    triggerId,
    value,
  })

  return unregister
})
</script>

<div
  {...rest}
  bind:this={ref}
  aria-labelledby={triggerId}
  class={classes}
  data-orientation={snapshot.orientation}
  data-state={isActive ? 'active' : 'inactive'}
  data-value={value}
  data-zui-tabs-content=""
  hidden={hidden ?? !isActive}
  id={panelId}
  role="tabpanel"
>
  {@render children?.()}
</div>
