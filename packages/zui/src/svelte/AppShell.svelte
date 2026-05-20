<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { onMount } from 'svelte'
import {
  AppShellController,
  type AppShellMode,
} from '../shared/AppShellController'
import { appShellVariants } from '../shared/appShellVariants'
import { provideAppShellContext } from './appShellContext'

// Module-level counter — SSR-safe because Svelte renders the same component
// tree on server and client in the same order, so the same id is assigned to
// the same component instance on both sides.
let _idCounter = 0
function nextId() {
  _idCounter += 1
  return `zui-app-shell-${_idCounter}`
}

type Props = HTMLAttributes<HTMLDivElement> & {
  position?: 'left' | 'right'
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  mobileBreakpoint?: number
  storageKey?: string | null
  shortcut?: boolean
  class?: string
  children?: Snippet
}

let {
  position,
  defaultCollapsed = false,
  collapsed,
  onCollapsedChange,
  mobileBreakpoint = 768,
  storageKey,
  shortcut = false,
  class: className,
  id,
  children,
  ...rest
}: Props = $props()

const rootId = id ?? nextId()
const sidebarId = `${rootId}-sidebar`
const mainId = `${rootId}-main`

let rootEl: HTMLDivElement
let sidebarEl: HTMLElement | undefined
let controller: AppShellController | undefined
let mode = $state<AppShellMode>('desktop')

provideAppShellContext({
  rootId,
  sidebarId,
  mainId,
  setSidebar: (el) => {
    sidebarEl = el
  },
  getController: () => controller,
  toggle: () => controller?.toggle(),
  mode: () => mode,
})

onMount(() => {
  if (!sidebarEl) return
  controller = new AppShellController({
    root: rootEl,
    sidebar: sidebarEl,
    defaultCollapsed,
    collapsed,
    mobileBreakpoint,
    storageKey: storageKey === undefined ? undefined : storageKey,
    bindKeyboardShortcut: shortcut,
    onCollapsedChange,
  })
  controller.mount()
  const off = controller.onModeChange((m) => (mode = m))
  return () => {
    off()
    controller?.destroy()
  }
})

$effect(() => {
  if (collapsed !== undefined && controller) {
    controller.syncCollapsed(collapsed)
  }
})

const classes = $derived(appShellVariants({ class: className, position }))
</script>

<div bind:this={rootEl} id={rootId} class={classes} {...rest}>
  <a class="zui-app-shell-skip-link" href={`#${mainId}`}>Skip to main content</a>
  {@render children?.()}
</div>
