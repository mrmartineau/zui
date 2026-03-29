<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { VariantProps } from 'cva'
import { badgeVariants } from '../shared/badgeVariants'

defineOptions({ inheritAttrs: false })

interface Props extends VariantProps<typeof badgeVariants> {}

const props = defineProps<Props>()
const attrs = useAttrs()
const classes = computed(() => badgeVariants({
  variant: props.variant,
  color: props.color,
  class: attrs.class as string | undefined
}))
</script>

<template>
  <span :class="classes" v-bind="{ ...attrs, class: undefined }"><slot /></span>
</template>
