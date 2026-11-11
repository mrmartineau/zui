<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'

type Props = Omit<HTMLInputAttributes, 'type' | 'role'> & {
  class?: string
  checked?: boolean
  children?: Snippet
}

let {
  class: className,
  checked = $bindable(false),
  children,
  ...rest
}: Props = $props()

const classes = $derived(['zui-switch', className].filter(Boolean).join(' '))
</script>

<label class={classes}>
  <input {...rest} type="checkbox" role="switch" bind:checked />
  {@render children?.()}
</label>
