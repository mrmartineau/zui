<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLSelectAttributes } from 'svelte/elements'

  type Props = HTMLSelectAttributes & {
    class?: string
    value?: unknown
    children?: Snippet
  }

  let {
    class: className,
    value = $bindable(),
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(['zui-select', className].filter(Boolean).join(' '))
</script>

<select class={classes} bind:value {...rest}>
  {@render children?.()}
</select>
