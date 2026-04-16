<template>
  <a v-if="href" :class="classes" :href="href" v-bind="$attrs">
    <slot />
  </a>
  <button v-else :class="classes" v-bind="$attrs">
    <slot />
  </button>
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
    href?: string
    variant?: ButtonVariantProps['variant']
    color?: ButtonVariantProps['color']
    size?: ButtonVariantProps['size']
    shape?: ButtonVariantProps['shape']
    icon?: ButtonVariantProps['icon']
  }>(),
  {
    variant: 'ghost',
  },
)

const classes = computed(() =>
  buttonVariants({
    className: ['zui-menu-item', props.class].filter(Boolean).join(' '),
    color: props.color,
    icon: props.icon,
    shape: props.shape,
    size: props.size,
    variant: props.variant,
  }),
)
</script>
