<script lang="ts">
  import type { Snippet } from 'svelte'
  import type {
    HTMLAnchorAttributes,
    HTMLAttributes,
  } from 'svelte/elements'

  type Props = (HTMLAttributes<HTMLDivElement> & HTMLAnchorAttributes) & {
    class?: string
    href?: string
    children?: Snippet
  }

  let { class: className, href, children, ...rest }: Props = $props()

  const classes = $derived(
    ['zui-card', href && 'zui-card-interactive', className]
      .filter(Boolean)
      .join(' '),
  )
</script>

{#if href}
  <a class={classes} {href} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <div class={classes} {...rest}>
    {@render children?.()}
  </div>
{/if}
