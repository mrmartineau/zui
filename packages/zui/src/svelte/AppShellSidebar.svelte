<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { appShellSidebarVariants } from '../shared/appShellVariants'
import { useAppShellContext } from './appShellContext'

type Props = HTMLAttributes<HTMLElement> & {
  label?: string
  class?: string
  children?: Snippet
}

let { label = 'Sidebar', class: className, children, ...rest }: Props =
  $props()

const ctx = useAppShellContext('AppShellSidebar')
const classes = $derived(appShellSidebarVariants({ class: className }))

let el: HTMLElement
$effect(() => {
  if (el) ctx.setSidebar(el)
})
</script>

<aside
  bind:this={el}
  id={ctx.sidebarId}
  class={classes}
  aria-label={label}
  popover="auto"
  {...rest}
>
  {@render children?.()}
</aside>
