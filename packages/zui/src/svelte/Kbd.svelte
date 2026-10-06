<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { kbdVariants } from '../shared/kbdVariants'

type KbdVariantProps = VariantProps<typeof kbdVariants>

type Props = HTMLAttributes<HTMLElement> & {
  class?: string
  shape?: KbdVariantProps['shape']
  children?: Snippet
}

let { class: className, shape, children, ...rest }: Props = $props()

const classes = $derived(kbdVariants({ className, shape }))
</script>

<kbd class={classes} {...rest}>
  {@render children?.()}
</kbd>
