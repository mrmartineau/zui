<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type Props = HTMLAttributes<HTMLFieldSetElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()

const classes = $derived(['zui-field-set', className].filter(Boolean).join(' '))
</script>

<fieldset class={classes} {...rest}>
  {@render children?.()}
</fieldset>
