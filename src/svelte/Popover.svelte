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
  const mergedStyle = $derived(
    rest.style
      ? `position-anchor: --${id}; ${rest.style}`
      : `position-anchor: --${id};`,
  )
</script>

<div {id} {popover} class={classes} {...rest} style={mergedStyle}>
  {@render children?.()}
</div>
