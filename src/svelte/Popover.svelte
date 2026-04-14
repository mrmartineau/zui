<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLDivElement> & {
    id: string
    popover?: 'auto' | 'manual'
    class?: string
    children?: Snippet
  }

  let {
    id,
    popover = 'auto',
    class: className,
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(
    ['zui-popover', className].filter(Boolean).join(' '),
  )
  const anchorStyle = $derived(`position-anchor: --${id};`)
</script>

<div {id} {popover} class={classes} style={anchorStyle} {...rest}>
  {@render children?.()}
</div>
