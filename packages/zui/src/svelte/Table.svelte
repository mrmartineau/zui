<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLTableAttributes } from 'svelte/elements'

type Props = HTMLTableAttributes & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(['zui-table', className].filter(Boolean).join(' '))
</script>

<table class={classes} {...rest}>
  {@render children?.()}
</table>
