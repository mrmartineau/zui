<template>
  <aside
    ref="el"
    v-bind="$attrs"
    :id="ctx.sidebarId"
    :class="classes"
    :aria-label="label"
    popover="auto"
  >
    <slot />
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { appShellSidebarVariants } from '../shared/appShellVariants'
import { useAppShellContext } from './appShellContext'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: string
    label?: string
  }>(),
  { label: 'Sidebar' },
)

const ctx = useAppShellContext('AppShellSidebar')
const el = ref<HTMLElement | null>(null)
const classes = computed(() => appShellSidebarVariants({ class: props.class }))

onMounted(() => {
  if (el.value) ctx.setSidebar(el.value)
})
</script>
