<template>
  <tr :class="classes" v-bind="$attrs">
    <slot />
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-table-row', props.class].filter(Boolean).join(' '),
)
</script>
