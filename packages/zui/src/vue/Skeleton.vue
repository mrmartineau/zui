<template>
  <div :class="classes" :style="vars" aria-hidden="true" v-bind="$attrs"></div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { skeletonVars } from '../shared/skeletonStyle'
import { skeletonVariants } from '../shared/skeletonVariants'

defineOptions({ inheritAttrs: false })

type SkeletonVariantProps = VariantProps<typeof skeletonVariants>

const props = defineProps<{
  class?: string
  shape?: SkeletonVariantProps['shape']
  animation?: SkeletonVariantProps['animation']
  /** A number is pixels; a string is any CSS length */
  width?: string | number
  height?: string | number
  /** Sets width and height together */
  size?: string | number
  /** Ratio such as `16 / 9`. Height then follows the width */
  aspectRatio?: string | number
}>()

const classes = computed(() =>
  skeletonVariants({
    animation: props.animation,
    className: props.class,
    shape: props.shape,
  }),
)
const vars = computed(() =>
  skeletonVars({
    aspectRatio: props.aspectRatio,
    height: props.height,
    size: props.size,
    width: props.width,
  }),
)
</script>
