<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  type Props = HTMLLabelAttributes & {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const classes = $derived(['zui-label', className].filter(Boolean).join(' '))
</script>

<label class={classes} {...rest}>
  {@render children?.()}
</label>
