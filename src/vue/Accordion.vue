<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
  flush?: boolean
}>()

const classes = computed(() =>
  ['zui-accordion', props.flush && 'zui-accordion-flush', props.class]
    .filter(Boolean)
    .join(' '),
)
</script>
