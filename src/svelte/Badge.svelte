<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { VariantProps } from 'cva'
  import { badgeVariants } from '../shared/badgeVariants'

  type BadgeVariantProps = VariantProps<typeof badgeVariants>

  type Props = HTMLAttributes<HTMLSpanElement> & {
    class?: string
    variant?: BadgeVariantProps['variant']
    color?: BadgeVariantProps['color']
    children?: Snippet
  }

  let {
    class: className,
    variant,
    color,
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(badgeVariants({ variant, color, className }))
</script>

<span class={classes} {...rest}>
  {@render children?.()}
</span>
