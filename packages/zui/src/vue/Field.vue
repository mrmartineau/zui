<template>
  <div role="group" :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { fieldVariants } from '../shared/fieldVariants'

defineOptions({ inheritAttrs: false })

type FieldVariantProps = VariantProps<typeof fieldVariants>

const props = defineProps<{
  class?: string
  orientation?: FieldVariantProps['orientation']
  invalid?: FieldVariantProps['invalid']
}>()

const classes = computed(() =>
  fieldVariants({
    className: props.class,
    invalid: props.invalid,
    orientation: props.orientation,
  }),
)
</script>
