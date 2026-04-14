<template>
  <tbody :class="classes" v-bind="$attrs">
    <slot />
  </tbody>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-table-body', props.class].filter(Boolean).join(' '),
)
</script>
