<template>
  <th :class="classes" v-bind="$attrs">
    <slot />
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() => ['zui-table-head', props.class].filter(Boolean).join(' '))
</script>
