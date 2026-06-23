<template>
  <fieldset :class="classes" v-bind="$attrs">
    <slot />
  </fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const classes = computed(() =>
  ['zui-field-set', props.class].filter(Boolean).join(' '),
)
</script>
