<template>
  <header v-bind="$attrs" :class="classes">
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
    <span
      v-if="toggle"
      popover="manual"
      aria-hidden="true"
      class="zui-tooltip-content zui-tooltip-placement-bottom zui-app-shell-toggle-tooltip"
    >
      {{ toggleLabel }}
      <kbd class="zui-kbd-group zui-app-shell-toggle-kbd">
        <kbd class="zui-kbd zui-app-shell-toggle-mod" />
        <kbd class="zui-kbd">B</kbd>
      </kbd>
    </span>
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
