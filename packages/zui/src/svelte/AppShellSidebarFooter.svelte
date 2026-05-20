<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { appShellSidebarFooterVariants } from '../shared/appShellVariants'

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()
const classes = $derived(appShellSidebarFooterVariants({ class: className }))
</script>

<div class={classes} {...rest}>{@render children?.()}</div>
