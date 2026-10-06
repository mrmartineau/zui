<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { popoverVariants } from '../shared/popoverVariants'

type PopoverVariantProps = VariantProps<typeof popoverVariants>

type Props = HTMLAttributes<HTMLDivElement> & {
  id: string
  popover?: 'auto' | 'manual'
  class?: string
  shape?: PopoverVariantProps['shape']
  children?: Snippet
}

let {
  id,
  popover = 'auto',
  class: className,
  shape,
  children,
  ...rest
}: Props = $props()

const classes = $derived(popoverVariants({ className, shape }))
const mergedStyle = $derived(
  rest.style
    ? `position-anchor: --${id}; ${rest.style}`
    : `position-anchor: --${id};`,
)
</script>

<div {id} {popover} class={classes} {...rest} style={mergedStyle}>
  {@render children?.()}
</div>
