<script lang="ts">
import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'svelte/elements'
import {
  type SkeletonSizeProps,
  skeletonStyleString,
} from '../shared/skeletonStyle'
import { skeletonVariants } from '../shared/skeletonVariants'

type SkeletonVariantProps = VariantProps<typeof skeletonVariants>

type Props = HTMLAttributes<HTMLDivElement> &
  SkeletonVariantProps &
  SkeletonSizeProps & {
    class?: string
  }

let {
  class: className,
  shape,
  animation,
  width,
  height,
  size,
  aspectRatio,
  style,
  ...rest
}: Props = $props()

const classes = $derived(
  skeletonVariants({ animation, class: className, shape }),
)
const mergedStyle = $derived(
  [skeletonStyleString({ aspectRatio, height, size, width }), style]
    .filter(Boolean)
    .join('; '),
)
</script>

<div class={classes} style={mergedStyle} aria-hidden="true" {...rest}></div>
