<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  type Props = HTMLInputAttributes & {
    class?: string
    value?: string | number | null
  }

  let {
    class: className,
    value = $bindable(),
    ...rest
  }: Props = $props()

  const classes = $derived(['zui-input', className].filter(Boolean).join(' '))
</script>

<input class={classes} bind:value {...rest} />
