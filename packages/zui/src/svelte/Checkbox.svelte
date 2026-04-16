<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'

type Props = Omit<HTMLInputAttributes, 'type'> & {
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

const classes = $derived(['zui-checkbox', className].filter(Boolean).join(' '))
</script>

<label class={classes}>
  <input type="checkbox" bind:checked {...rest} />
  {@render children?.()}
</label>
