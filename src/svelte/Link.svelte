<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAnchorAttributes } from 'svelte/elements'

type Props = HTMLAnchorAttributes & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(['zui-link', className].filter(Boolean).join(' '))
</script>

<a class={classes} {...rest}>
  {@render children?.()}
</a>
