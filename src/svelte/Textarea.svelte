<script lang="ts">
import type { HTMLTextareaAttributes } from 'svelte/elements'

type Props = HTMLTextareaAttributes & {
  class?: string
  value?: string | null
}

let { class: className, value = $bindable(), ...rest }: Props = $props()

const classes = $derived(['zui-textarea', className].filter(Boolean).join(' '))
</script>

<textarea class={classes} bind:value {...rest}></textarea>
