<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(['zui-code', className].filter(Boolean).join(' '))
</script>

<code class={classes} {...rest}>
  {@render children?.()}
</code>
