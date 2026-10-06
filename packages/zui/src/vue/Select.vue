<template>
  <select :class="classes" v-bind="$attrs">
    <slot />
  </select>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { selectVariants } from '../shared/selectVariants'

defineOptions({ inheritAttrs: false })

type SelectVariantProps = VariantProps<typeof selectVariants>

const props = defineProps<{
  class?: string
  shape?: SelectVariantProps['shape']
}>()

const classes = computed(() =>
  selectVariants({ className: props.class, shape: props.shape }),
)
</script>
