<template>
  <label :class="classes">
    <input
      type="checkbox"
      role="switch"
      :checked="modelValue"
      v-bind="$attrs"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
  /** Use with `v-model` */
  modelValue?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const classes = computed(() =>
  ['zui-switch', props.class].filter(Boolean).join(' '),
)
</script>
