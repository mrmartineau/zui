<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  type Props = HTMLLabelAttributes & {
    class?: string
    name?: string
    value?: string | number | null
    group?: string | number | null
    disabled?: boolean
    children?: Snippet
  }

  let {
    class: className,
    name,
    value,
    group = $bindable(),
    disabled,
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(['zui-radio', className].filter(Boolean).join(' '))
</script>

<label class={classes} {...rest}>
  <input type="radio" {name} {value} {disabled} bind:group />
  {@render children?.()}
</label>
