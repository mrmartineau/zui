<template>
  <kbd :class="classes" v-bind="$attrs">
    <slot />
  </kbd>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-kbd-group', props.class].filter(Boolean).join(' '),
)
</script>
