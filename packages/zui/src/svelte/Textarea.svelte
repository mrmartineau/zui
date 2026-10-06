<script lang="ts">
import type { VariantProps } from 'cva'
import type { HTMLTextareaAttributes } from 'svelte/elements'
import { textareaVariants } from '../shared/textareaVariants'

type TextareaVariantProps = VariantProps<typeof textareaVariants>

type Props = HTMLTextareaAttributes & {
  class?: string
  shape?: TextareaVariantProps['shape']
  value?: string | null
}

let { class: className, shape, value = $bindable(), ...rest }: Props = $props()

const classes = $derived(textareaVariants({ className, shape }))
</script>

<textarea class={classes} bind:value {...rest}></textarea>
