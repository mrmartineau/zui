<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { accordionVariants } from '../shared/accordionVariants'

type AccordionVariantProps = VariantProps<typeof accordionVariants>

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  shape?: AccordionVariantProps['shape']
  flush?: boolean
  children?: Snippet
}

let { class: className, flush, shape, children, ...rest }: Props = $props()

const classes = $derived(accordionVariants({ className, flush, shape }))
</script>

<div class={classes} {...rest}>
  {@render children?.()}
</div>
