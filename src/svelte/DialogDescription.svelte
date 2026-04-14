<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLParagraphElement> & {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const classes = $derived(
    ['zui-dialog-description', className].filter(Boolean).join(' '),
  )
</script>

<p class={classes} {...rest}>
  {@render children?.()}
</p>
