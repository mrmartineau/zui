<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { VariantProps } from 'cva'
  import { flexVariants } from '../shared/flexVariants'

  type FlexVariantProps = VariantProps<typeof flexVariants>

  type Props = HTMLAttributes<HTMLDivElement> & {
    class?: string
    display?: FlexVariantProps['display']
    direction?: FlexVariantProps['direction']
    align?: FlexVariantProps['align']
    justify?: FlexVariantProps['justify']
    wrap?: FlexVariantProps['wrap']
    gap?: FlexVariantProps['gap']
    gapX?: FlexVariantProps['gapX']
    gapY?: FlexVariantProps['gapY']
    children?: Snippet
  }

  let {
    class: className,
    display,
    direction,
    align,
    justify,
    wrap,
    gap,
    gapX,
    gapY,
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(
    flexVariants({
      display,
      direction,
      align,
      justify,
      wrap,
      gap,
      gapX,
      gapY,
      className,
    }),
  )
</script>

<div class={classes} {...rest}>
  {@render children?.()}
</div>
