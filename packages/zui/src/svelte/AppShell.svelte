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

const uid = Math.random().toString(36).slice(2, 9)
const rootId = id ?? `zui-app-shell-${uid}`
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

<div bind:this={rootEl} {id} class={classes} {...rest}>
  <a class="zui-app-shell-skip-link" href={`#${mainId}`}>Skip to main content</a>
  {@render children?.()}
</div>
