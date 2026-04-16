<template>
  <a :class="classes" v-bind="$attrs">
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false, name: 'ZuiLink' })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-link', props.class].filter(Boolean).join(' '),
)
</script>
