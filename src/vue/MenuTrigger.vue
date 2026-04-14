<template>
  <summary :class="classes" v-bind="$attrs">
    <slot />
  </summary>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { buttonVariants } from '../shared/buttonVariants'

defineOptions({ inheritAttrs: false })

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: ButtonVariantProps['variant']
    color?: ButtonVariantProps['color']
    size?: ButtonVariantProps['size']
    shape?: ButtonVariantProps['shape']
    icon?: ButtonVariantProps['icon']
  }>(),
  {
    variant: 'outline',
  },
)

const classes = computed(() =>
  buttonVariants({
    className: props.class,
    color: props.color,
    icon: props.icon,
    shape: props.shape,
    size: props.size,
    variant: props.variant,
  }),
)
</script>
