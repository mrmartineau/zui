<template>
  <td :class="classes" v-bind="$attrs">
    <slot />
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-table-cell', props.class].filter(Boolean).join(' '),
)
</script>
