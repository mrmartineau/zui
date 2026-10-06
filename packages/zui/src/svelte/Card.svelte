<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements'
import { cardVariants } from '../shared/cardVariants'

type CardVariantProps = VariantProps<typeof cardVariants>

type Props = (HTMLAttributes<HTMLDivElement> & HTMLAnchorAttributes) & {
  class?: string
  href?: string
  shape?: CardVariantProps['shape']
  children?: Snippet
}

let { class: className, href, shape, children, ...rest }: Props = $props()

const classes = $derived(
  cardVariants({
    className: [href && 'zui-card-interactive', className]
      .filter(Boolean)
      .join(' '),
    shape,
  }),
)
</script>

{#if href}
  <a class={classes} {href} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <div class={classes} {...rest}>
    {@render children?.()}
  </div>
{/if}
