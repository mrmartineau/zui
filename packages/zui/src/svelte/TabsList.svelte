<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { tabsListVariants } from '../shared/tabsVariants'
import { getTabsContext } from './tabsContext'

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()
const { getSnapshot } = getTabsContext()
const classes = $derived(tabsListVariants({ className }))
const snapshot = $derived(getSnapshot())
</script>

<div
  {...rest}
  class={classes}
  data-orientation={snapshot.orientation}
  data-zui-tabs-list=""
  role="tablist"
  aria-orientation={snapshot.orientation === 'vertical' ? 'vertical' : undefined}
>
  {@render children?.()}
</div>
