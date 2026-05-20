<template>
  <header :class="classes" v-bind="$attrs">
    <button
      v-if="toggle"
      type="button"
      class="zui-app-shell-toggle"
      :aria-label="toggleLabel"
      :aria-controls="ctx.sidebarId"
      @click="ctx.toggle"
    >
      <i class="ph ph-list" aria-hidden="true" />
    </button>
    <slot />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { appShellHeaderVariants } from '../shared/appShellVariants'
import { useAppShellContext } from './appShellContext'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: string
    toggle?: boolean
    toggleLabel?: string
  }>(),
  { toggle: true, toggleLabel: 'Toggle sidebar' },
)

const ctx = useAppShellContext('AppShellHeader')
const classes = computed(() => appShellHeaderVariants({ class: props.class }))
</script>
