<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { flexVariants } from '../shared/flexVariants'

defineOptions({ inheritAttrs: false })

type FlexVariantProps = VariantProps<typeof flexVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    display?: FlexVariantProps['display']
    direction?: FlexVariantProps['direction']
    align?: FlexVariantProps['align']
    justify?: FlexVariantProps['justify']
    wrap?: FlexVariantProps['wrap']
    gap?: FlexVariantProps['gap']
    gapX?: FlexVariantProps['gapX']
    gapY?: FlexVariantProps['gapY']
  }>(),
  {},
)

const classes = computed(() =>
  flexVariants({
    align: props.align,
    className: props.class,
    direction: props.direction,
    display: props.display,
    gap: props.gap,
    gapX: props.gapX,
    gapY: props.gapY,
    justify: props.justify,
    wrap: props.wrap,
  }),
)
</script>
