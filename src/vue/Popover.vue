<template>
  <div :id="id" :popover="popover" :class="classes" :style="anchorStyle" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    id: string
    popover?: 'auto' | 'manual'
    class?: string
  }>(),
  {
    popover: 'auto',
  },
)

const classes = computed(() =>
  ['zui-popover', props.class].filter(Boolean).join(' '),
)
const anchorStyle = computed<CSSProperties>(() => ({
  positionAnchor: `--${props.id}`,
}))
</script>
