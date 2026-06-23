<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { fieldLegendVariants } from '../shared/fieldLegendVariants'

type FieldLegendVariantProps = VariantProps<typeof fieldLegendVariants>

type Props = HTMLAttributes<HTMLLegendElement> & {
  class?: string
  variant?: FieldLegendVariantProps['variant']
  children?: Snippet
}

let { class: className, variant, children, ...rest }: Props = $props()

const classes = $derived(
  fieldLegendVariants({
    className,
    variant,
  }),
)
</script>

<legend class={classes} {...rest}>
  {@render children?.()}
</legend>
