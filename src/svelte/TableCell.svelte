<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLTdAttributes } from 'svelte/elements'

  type Props = HTMLTdAttributes & {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const classes = $derived(
    ['zui-table-cell', className].filter(Boolean).join(' '),
  )
</script>

<td class={classes} {...rest}>
  {@render children?.()}
</td>
