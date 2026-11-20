<template>
  <pre :class="classes" v-bind="$attrs"><slot /></pre>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() => ['zui-pre', props.class].filter(Boolean).join(' '))
</script>
