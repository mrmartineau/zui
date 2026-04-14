<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLThAttributes } from 'svelte/elements'

type Props = HTMLThAttributes & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(
  ['zui-table-head', className].filter(Boolean).join(' '),
)
</script>

<th class={classes} {...rest}>
  {@render children?.()}
</th>
