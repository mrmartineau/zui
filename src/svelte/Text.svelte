<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { textSizeClass, type TextSize } from '../shared/textSizeClass'

  type Props = HTMLAttributes<HTMLSpanElement> & {
    class?: string
    size?: TextSize
    children?: Snippet
  }

  let {
    class: className,
    size = '0',
    children,
    ...rest
  }: Props = $props()

  const classes = $derived(
    [textSizeClass(size), className].filter(Boolean).join(' '),
  )
</script>

<span class={classes} {...rest}>
  {@render children?.()}
</span>
