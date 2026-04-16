<template>
  <table :class="classes" v-bind="$attrs">
    <slot />
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-table', props.class].filter(Boolean).join(' '),
)
</script>
