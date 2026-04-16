<template>
  <select :class="classes" v-bind="$attrs">
    <slot />
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-select', props.class].filter(Boolean).join(' '),
)
</script>
