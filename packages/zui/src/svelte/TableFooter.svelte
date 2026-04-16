<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLTableSectionElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(
  ['zui-table-footer', className].filter(Boolean).join(' '),
)
</script>

<tfoot class={classes} {...rest}>
  {@render children?.()}
</tfoot>
