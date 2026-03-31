<template>
  <input :class="classes" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() => ['zui-input', props.class].filter(Boolean).join(' '))
</script>
