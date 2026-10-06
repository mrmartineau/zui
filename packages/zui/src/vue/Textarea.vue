<template>
  <textarea :class="classes" v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { textareaVariants } from '../shared/textareaVariants'

defineOptions({ inheritAttrs: false })

type TextareaVariantProps = VariantProps<typeof textareaVariants>

const props = defineProps<{
  class?: string
  shape?: TextareaVariantProps['shape']
}>()

const classes = computed(() =>
  textareaVariants({ className: props.class, shape: props.shape }),
)
</script>
