<template>
  <div role="separator" :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-field-separator', props.class].filter(Boolean).join(' '),
)
</script>
