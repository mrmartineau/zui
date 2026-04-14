<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLDivElement> & {
    class?: string
    flush?: boolean
    children?: Snippet
  }

  let { class: className, flush, children, ...rest }: Props = $props()

  const classes = $derived(
    ['zui-accordion', flush && 'zui-accordion-flush', className]
      .filter(Boolean)
      .join(' '),
  )
</script>

<div class={classes} {...rest}>
  {@render children?.()}
</div>
