<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(['zui-kbd', className].filter(Boolean).join(' '))
</script>

<kbd class={classes} {...rest}>
  {@render children?.()}
</kbd>
