<template>
  <h2 :class="classes" v-bind="$attrs">
    <slot />
  </h2>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-dialog-title', props.class].filter(Boolean).join(' '),
)
</script>
