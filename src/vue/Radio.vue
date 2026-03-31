<template>
  <label :class="classes" v-bind="$attrs">
    <input type="radio" />
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() => ['zui-radio', props.class].filter(Boolean).join(' '))
</script>
