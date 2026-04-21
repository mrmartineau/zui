<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { createTabsController, type TabsActivationMode, type TabsDirection, type TabsOrientation } from '../core/tabs'
import { tabsVariants } from '../shared/tabsVariants'
import { setTabsContext } from './tabsContext'

type Props = HTMLAttributes<HTMLDivElement> & {
  activationMode?: TabsActivationMode
  defaultValue?: string
  dir?: TabsDirection
  disabled?: boolean
  id?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
  value?: string
  class?: string
  children?: Snippet
}

let {
  activationMode,
  class: className,
  defaultValue,
  dir,
  disabled,
  id,
  onValueChange,
  orientation,
  value,
  children,
  ...rest
}: Props = $props()

let root = $state<HTMLDivElement | undefined>()
const controller = createTabsController({
  activationMode,
  defaultValue,
  dir,
  disabled,
  id,
  onValueChange,
  orientation,
  value,
})
let snapshot = $state(controller.getSnapshot())

const unsubscribe = controller.subscribe((next) => {
  snapshot = next
})

$effect(() => {
  controller.setOptions({
    activationMode,
    defaultValue,
    dir,
    disabled,
    id,
    onValueChange,
    orientation,
    value,
  })
})

$effect(() => unsubscribe)

setTabsContext({
  controller,
  getRoot: () => root,
  getSnapshot: () => snapshot,
})

const classes = $derived(tabsVariants({ className }))
</script>

<div
  {...rest}
  bind:this={root}
  class={classes}
  data-disabled={snapshot.disabled ? 'true' : undefined}
  data-orientation={snapshot.orientation}
  data-zui-tabs-root=""
  id={snapshot.rootId}
>
  {@render children?.()}
</div>
