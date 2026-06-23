<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(
  ['zui-field-separator', className].filter(Boolean).join(' '),
)
</script>

<div role="separator" class={classes} {...rest}>
  {@render children?.()}
</div>
