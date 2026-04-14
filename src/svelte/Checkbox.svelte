<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  type Props = HTMLLabelAttributes & {
    class?: string
    name?: string
    value?: string | number | null
    checked?: boolean
    disabled?: boolean
    children?: Snippet
  }

  let {
    class: className,
    name,
    value,
    checked = $bindable(false),
    disabled,
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(
    ['zui-checkbox', className].filter(Boolean).join(' '),
  )
</script>

<label class={classes} {...rest}>
  <input type="checkbox" {name} {value} {disabled} bind:checked />
  {@render children?.()}
</label>
