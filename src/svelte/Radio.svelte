<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'

  type Props = Omit<HTMLInputAttributes, 'type'> & {
    class?: string
    group?: string | number | null
    children?: Snippet
  }

  let {
    class: className,
    group = $bindable(),
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(['zui-radio', className].filter(Boolean).join(' '))
</script>

<label class={classes}>
  <input type="radio" bind:group {...rest} />
  {@render children?.()}
</label>
