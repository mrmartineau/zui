<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { appShellSidebarBodyVariants } from '../shared/appShellVariants'

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()
const classes = $derived(appShellSidebarBodyVariants({ class: className }))
</script>

<div class={classes} {...rest}>{@render children?.()}</div>
