<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLPreElement> & {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const classes = $derived(['zui-pre', className].filter(Boolean).join(' '))
</script>

<pre class={classes} {...rest}>{@render children?.()}</pre>
