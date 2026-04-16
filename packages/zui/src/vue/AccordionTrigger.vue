<template>
  <summary :class="classes" v-bind="$attrs">
    <slot />
  </summary>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-accordion-trigger', props.class].filter(Boolean).join(' '),
)
</script>
