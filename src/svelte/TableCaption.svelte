<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLTableCaptionElement> & {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const classes = $derived(
    ['zui-table-caption', className].filter(Boolean).join(' '),
  )
</script>

<caption class={classes} {...rest}>
  {@render children?.()}
</caption>
