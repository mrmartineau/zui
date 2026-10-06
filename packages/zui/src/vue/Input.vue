<template>
  <input :class="classes" v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { inputVariants } from '../shared/inputVariants'

defineOptions({ inheritAttrs: false })

type InputVariantProps = VariantProps<typeof inputVariants>

const props = defineProps<{
  class?: string
  shape?: InputVariantProps['shape']
}>()

const classes = computed(() =>
  inputVariants({ className: props.class, shape: props.shape }),
)
</script>
