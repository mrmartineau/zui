<template>
  <thead :class="classes" v-bind="$attrs">
    <slot />
  </thead>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-table-header', props.class].filter(Boolean).join(' '),
)
</script>
