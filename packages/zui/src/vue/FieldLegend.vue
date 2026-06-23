<template>
  <legend :class="classes" v-bind="$attrs">
    <slot />
  </legend>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { fieldLegendVariants } from '../shared/fieldLegendVariants'

defineOptions({ inheritAttrs: false })

type FieldLegendVariantProps = VariantProps<typeof fieldLegendVariants>

const props = defineProps<{
  class?: string
  variant?: FieldLegendVariantProps['variant']
}>()

const classes = computed(() =>
  fieldLegendVariants({
    variant: props.variant,
    className: props.class,
  }),
)
</script>
