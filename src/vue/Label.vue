<template>
  <label :class="classes" v-bind="$attrs">
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() => ['zui-label', props.class].filter(Boolean).join(' '))
</script>
