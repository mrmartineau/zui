<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { fieldVariants } from '../shared/fieldVariants'

type FieldVariantProps = VariantProps<typeof fieldVariants>

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  orientation?: FieldVariantProps['orientation']
  invalid?: FieldVariantProps['invalid']
  children?: Snippet
}

let {
  class: className,
  orientation,
  invalid,
  children,
  ...rest
}: Props = $props()

const classes = $derived(
  fieldVariants({
    className,
    invalid,
    orientation,
  }),
)
</script>

<div role="group" class={classes} {...rest}>
  {@render children?.()}
</div>
