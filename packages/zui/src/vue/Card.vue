<template>
  <a v-if="href" :class="classes" :href="href" v-bind="$attrs">
    <slot />
  </a>
  <div v-else :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { cardVariants } from '../shared/cardVariants'

defineOptions({ inheritAttrs: false })

type CardVariantProps = VariantProps<typeof cardVariants>

const props = defineProps<{
  class?: string
  href?: string
  shape?: CardVariantProps['shape']
}>()

const classes = computed(() =>
  cardVariants({
    className: [props.href && 'zui-card-interactive', props.class]
      .filter(Boolean)
      .join(' '),
    shape: props.shape,
  }),
)
</script>
