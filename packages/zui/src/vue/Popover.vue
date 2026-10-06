<template>
  <div :id="id" :popover="popover" :class="classes" :style="anchorStyle" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { popoverVariants } from '../shared/popoverVariants'

defineOptions({ inheritAttrs: false })

type PopoverVariantProps = VariantProps<typeof popoverVariants>

const props = withDefaults(
  defineProps<{
    id: string
    popover?: 'auto' | 'manual'
    class?: string
    shape?: PopoverVariantProps['shape']
  }>(),
  {
    popover: 'auto',
  },
)

const classes = computed(() =>
  popoverVariants({ className: props.class, shape: props.shape }),
)
const anchorStyle = computed<CSSProperties>(() => ({
  positionAnchor: `--${props.id}`,
}))
</script>
