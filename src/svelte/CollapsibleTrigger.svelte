<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(
  ['zui-collapsible-trigger', className].filter(Boolean).join(' '),
)
</script>

<summary class={classes} {...rest}>
  {@render children?.()}
</summary>
