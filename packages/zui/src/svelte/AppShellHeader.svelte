<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { appShellHeaderVariants } from '../shared/appShellVariants'
import { useAppShellContext } from './appShellContext'

type Props = HTMLAttributes<HTMLElement> & {
  toggle?: boolean
  toggleLabel?: string
  class?: string
  children?: Snippet
}

let {
  toggle = true,
  toggleLabel = 'Toggle sidebar',
  class: className,
  children,
  ...rest
}: Props = $props()

const ctx = useAppShellContext('AppShellHeader')
const classes = $derived(appShellHeaderVariants({ class: className }))
</script>

<header class={classes} {...rest}>
  {#if toggle}
    <button
      type="button"
      class="zui-app-shell-toggle"
      aria-label={toggleLabel}
      aria-controls={ctx.sidebarId}
      onclick={ctx.toggle}
    >
      <i class="ph ph-list" aria-hidden="true"></i>
    </button>
    <span
      popover="manual"
      aria-hidden="true"
      class="zui-tooltip-content zui-tooltip-placement-bottom zui-app-shell-toggle-tooltip"
    >
      {toggleLabel}
      <kbd class="zui-kbd-group zui-app-shell-toggle-kbd">
        <kbd class="zui-kbd zui-app-shell-toggle-mod"></kbd>
        <kbd class="zui-kbd">B</kbd>
      </kbd>
    </span>
  {/if}
  {@render children?.()}
</header>
