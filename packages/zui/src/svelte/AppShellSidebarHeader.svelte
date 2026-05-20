<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { appShellSidebarHeaderVariants } from '../shared/appShellVariants'

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, ...rest }: Props = $props()
const classes = $derived(appShellSidebarHeaderVariants({ class: className }))
</script>

<div class={classes} {...rest}>{@render children?.()}</div>
