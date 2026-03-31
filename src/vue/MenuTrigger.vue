<template>
  <summary :class="classes" v-bind="$attrs">
    <slot />
  </summary>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VariantProps } from 'cva'
import { buttonVariants } from '../shared/buttonVariants'

defineOptions({ inheritAttrs: false })

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const props = withDefaults(defineProps<{
  class?: string
  variant?: ButtonVariantProps['variant']
  color?: ButtonVariantProps['color']
  size?: ButtonVariantProps['size']
  shape?: ButtonVariantProps['shape']
  icon?: ButtonVariantProps['icon']
}>(), {
  variant: 'outline',
})

const classes = computed(() => buttonVariants({ variant: props.variant, color: props.color, size: props.size, shape: props.shape, icon: props.icon, className: props.class }))
</script>
