<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLDetailsElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(
  ['zui-accordion-item', className].filter(Boolean).join(' '),
)
</script>

<details class={classes} {...rest}>
  {@render children?.()}
</details>
