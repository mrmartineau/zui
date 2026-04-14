<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLTableSectionElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(
  ['zui-table-header', className].filter(Boolean).join(' '),
)
</script>

<thead class={classes} {...rest}>
  {@render children?.()}
</thead>
