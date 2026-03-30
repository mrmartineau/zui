<template>
  <span :class="classes" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VariantProps } from 'cva'
import { badgeVariants } from '../shared/badgeVariants'

defineOptions({ inheritAttrs: false })

type BadgeVariantProps = VariantProps<typeof badgeVariants>

const props = withDefaults(defineProps<{
  class?: string
  variant?: BadgeVariantProps['variant']
  color?: BadgeVariantProps['color']
}>(), {})

const classes = computed(() => badgeVariants({ variant: props.variant, color: props.color, className: props.class }))
</script>
