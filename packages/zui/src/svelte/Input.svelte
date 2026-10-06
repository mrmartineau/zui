<script lang="ts">
import type { VariantProps } from 'cva'
import type { HTMLInputAttributes } from 'svelte/elements'
import { inputVariants } from '../shared/inputVariants'

type InputVariantProps = VariantProps<typeof inputVariants>

type Props = HTMLInputAttributes & {
  class?: string
  shape?: InputVariantProps['shape']
  value?: string | number | null
}

let { class: className, shape, value = $bindable(), ...rest }: Props = $props()

const classes = $derived(inputVariants({ className, shape }))
</script>

<input class={classes} bind:value {...rest} />
