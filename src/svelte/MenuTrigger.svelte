<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type Props = HTMLAttributes<HTMLElement> & {
  class?: string
  variant?: ButtonVariantProps['variant']
  color?: ButtonVariantProps['color']
  size?: ButtonVariantProps['size']
  shape?: ButtonVariantProps['shape']
  icon?: ButtonVariantProps['icon']
  children?: Snippet
}

let {
  class: className,
  variant = 'outline',
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

<summary class={classes} {...rest}>
  {@render children?.()}
</summary>
