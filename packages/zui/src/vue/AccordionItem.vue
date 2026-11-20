<template>
  <details :class="classes" v-bind="$attrs">
    <slot />
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() => ['zui-accordion-item', props.class].filter(Boolean).join(' '))
</script>
