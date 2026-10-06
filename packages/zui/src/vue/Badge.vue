<template>
  <span :class="classes" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { badgeVariants } from '../shared/badgeVariants'

defineOptions({ inheritAttrs: false })

type BadgeVariantProps = VariantProps<typeof badgeVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: BadgeVariantProps['variant']
    color?: BadgeVariantProps['color']
    shape?: BadgeVariantProps['shape']
  }>(),
  {},
)

const classes = computed(() =>
  badgeVariants({
    className: props.class,
    color: props.color,
    shape: props.shape,
    variant: props.variant,
  }),
)
</script>
