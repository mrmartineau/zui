<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLSelectAttributes } from 'svelte/elements'
import { selectVariants } from '../shared/selectVariants'

type SelectVariantProps = VariantProps<typeof selectVariants>

type Props = HTMLSelectAttributes & {
  class?: string
  shape?: SelectVariantProps['shape']
  value?: unknown
  children?: Snippet
}

let {
  class: className,
  shape,
  value = $bindable(),
  children,
  ...rest
}: Props = $props()

const classes = $derived(selectVariants({ className, shape }))
</script>

<select class={classes} bind:value {...rest}>
  {@render children?.()}
</select>
