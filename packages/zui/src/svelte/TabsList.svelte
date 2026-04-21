<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { tabsListVariants } from '../shared/tabsVariants'
import { getTabsContext } from './tabsContext'

type TabsListVariantProps = VariantProps<typeof tabsListVariants>

type Props = HTMLAttributes<HTMLDivElement> & TabsListVariantProps & {
  class?: string
  children?: Snippet
}

let { class: className, children, variant, ...rest }: Props = $props()
const { getSnapshot } = getTabsContext()
const classes = $derived(tabsListVariants({ className, variant }))
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
