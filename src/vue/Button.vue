<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { VariantProps } from 'cva'
import { buttonVariants } from '../shared/buttonVariants'

defineOptions({ inheritAttrs: false })

interface Props extends VariantProps<typeof buttonVariants> {
  href?: string
}

const props = defineProps<Props>()
const attrs = useAttrs()
const classes = computed(() => buttonVariants({
  variant: props.variant,
  color: props.color,
  size: props.size,
  shape: props.shape,
  icon: props.icon,
  class: attrs.class as string | undefined
}))
</script>

<template>
  <a v-if="href" :class="classes" :href="href" v-bind="{ ...attrs, class: undefined }"><slot /></a>
  <button v-else :class="classes" v-bind="{ ...attrs, class: undefined }"><slot /></button>
</template>
