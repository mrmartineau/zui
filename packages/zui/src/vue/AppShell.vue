<template>
  <div :id="rootId" ref="rootRef" :class="classes" v-bind="$attrs">
    <a class="zui-app-shell-skip-link" :href="`#${mainId}`">Skip to main content</a>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  AppShellController,
  type AppShellMode,
} from '../shared/AppShellController'
import { appShellVariants } from '../shared/appShellVariants'
import { provideAppShellContext } from './appShellContext'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    id?: string
    class?: string
    position?: 'left' | 'right'
    defaultCollapsed?: boolean
    collapsed?: boolean
    mobileBreakpoint?: number
    storageKey?: string | null
    shortcut?: boolean
  }>(),
  {
    defaultCollapsed: false,
    mobileBreakpoint: 768,
    shortcut: false,
  },
)

const emit = defineEmits<{
  (e: 'collapsedChange', collapsed: boolean): void
}>()

const uid = Math.random().toString(36).slice(2, 9)
const rootId = props.id ?? `zui-app-shell-${uid}`
const sidebarId = `${rootId}-sidebar`
const mainId = `${rootId}-main`

const rootRef = ref<HTMLDivElement | null>(null)
const sidebarRef = ref<HTMLElement | null>(null)
let controller: AppShellController | undefined
const mode = ref<AppShellMode>('desktop')

provideAppShellContext({
  rootId,
  sidebarId,
  mainId,
  setSidebar: (el) => {
    sidebarRef.value = el
  },
  getController: () => controller,
  toggle: () => controller?.toggle(),
  getMode: () => mode.value,
})

onMounted(() => {
  if (!rootRef.value || !sidebarRef.value) return
  controller = new AppShellController({
    root: rootRef.value,
    sidebar: sidebarRef.value,
    defaultCollapsed: props.defaultCollapsed,
    collapsed: props.collapsed,
    mobileBreakpoint: props.mobileBreakpoint,
    storageKey: props.storageKey === undefined ? undefined : props.storageKey,
    bindKeyboardShortcut: props.shortcut,
    onCollapsedChange: (v) => emit('collapsedChange', v),
  })
  controller.mount()
  controller.onModeChange((m) => (mode.value = m))
})

onBeforeUnmount(() => {
  controller?.destroy()
  controller = undefined
})

watch(
  () => props.collapsed,
  (next) => {
    if (next !== undefined) controller?.syncCollapsed(next)
  },
)

const classes = computed(() =>
  appShellVariants({ class: props.class, position: props.position }),
)
</script>
