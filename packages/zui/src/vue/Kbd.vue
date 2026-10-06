<template>
  <kbd :class="classes" v-bind="$attrs">
    <slot />
  </kbd>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { kbdVariants } from '../shared/kbdVariants'

defineOptions({ inheritAttrs: false })

type KbdVariantProps = VariantProps<typeof kbdVariants>

const props = defineProps<{
  class?: string
  shape?: KbdVariantProps['shape']
}>()

const classes = computed(() =>
  kbdVariants({ className: props.class, shape: props.shape }),
)
</script>
