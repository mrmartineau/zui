<template>
  <details :class="classes" v-bind="$attrs">
    <slot />
  </details>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { collapsibleVariants } from '../shared/collapsibleVariants'

defineOptions({ inheritAttrs: false })

type CollapsibleVariantProps = VariantProps<typeof collapsibleVariants>

const props = defineProps<{
  class?: string
  shape?: CollapsibleVariantProps['shape']
}>()

const classes = computed(() =>
  collapsibleVariants({ className: props.class, shape: props.shape }),
)
</script>
