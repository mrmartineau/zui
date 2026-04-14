<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type {
  HTMLAnchorAttributes,
  HTMLButtonAttributes,
} from 'svelte/elements'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type Props = (HTMLButtonAttributes & HTMLAnchorAttributes) & {
  class?: string
  href?: string
  variant?: ButtonVariantProps['variant']
  color?: ButtonVariantProps['color']
  size?: ButtonVariantProps['size']
  shape?: ButtonVariantProps['shape']
  icon?: ButtonVariantProps['icon']
  children?: Snippet
}

let {
  class: className,
  href,
  variant,
  color,
  size,
  shape,
  icon,
  children,
  ...rest
}: Props = $props()

const classes = $derived(
  buttonVariants({ className, color, icon, shape, size, variant }),
)
</script>

{#if href}
  <a class={classes} {href} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <button class={classes} {...rest}>
    {@render children?.()}
  </button>
{/if}
