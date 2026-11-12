<template>
  <label :class="classes">
    <input
      v-bind="inputAttrs()"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
  /** Use with `v-model` */
  modelValue?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const attrs = useAttrs()

// A function, not a computed: fallthrough attrs are not reactive, so a cached
// copy would go stale when the parent changes `disabled`, `name` or a listener.
// type and role come last, so a caller cannot turn the switch into something else.
// `checked` is set only with v-model, so a plain `checked` attribute still works.
function inputAttrs() {
  return {
    ...attrs,
    ...(props.modelValue === undefined ? {} : { checked: props.modelValue }),
    role: 'switch',
    type: 'checkbox',
  }
}

const classes = computed(() =>
  ['zui-switch', props.class].filter(Boolean).join(' '),
)
</script>
