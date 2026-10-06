<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { accordionVariants } from '../shared/accordionVariants'

defineOptions({ inheritAttrs: false })

type AccordionVariantProps = VariantProps<typeof accordionVariants>

const props = defineProps<{
  class?: string
  flush?: boolean
  shape?: AccordionVariantProps['shape']
}>()

const classes = computed(() =>
  accordionVariants({
    className: props.class,
    flush: props.flush,
    shape: props.shape,
  }),
)
</script>
