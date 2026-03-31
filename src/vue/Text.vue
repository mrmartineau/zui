<template>
  <span :class="classes" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { textSizeClass, type TextSize } from '../shared/textSizeClass'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  class?: string
  size?: TextSize
}>(), {
  size: '0',
})

const classes = computed(() => [textSizeClass(props.size), props.class].filter(Boolean).join(' '))
</script>
