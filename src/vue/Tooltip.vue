<template>
  <span :class="['zui-tooltip', props.class].filter(Boolean).join(' ')" v-bind="$attrs">
    <span :style="{ 'anchor-name': anchorName }" :popover-target="id" popover-target-action="hover">
      <slot />
    </span>
    <span
      popover="hint"
      :id="id"
      :class="contentClass"
      role="tooltip"
      :style="{ 'position-anchor': anchorName }"
    >
      {{ text }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VariantProps } from 'cva'
import { tooltipVariants } from '../shared/tooltipVariants'

defineOptions({ inheritAttrs: false })

let counter = 0
const id = `tooltip-${++counter}-${Math.random().toString(36).slice(2, 7)}`
const anchorName = `--${id}`

type TooltipVariantProps = VariantProps<typeof tooltipVariants>

const props = defineProps<{
  text: string
  class?: string
  placement?: TooltipVariantProps['placement']
}>()

const contentClass = computed(() => {
  const placementClass = tooltipVariants({ placement: props.placement }).split(' ').find((c: string) => c.startsWith('zui-tooltip-placement-'))
  return ['zui-tooltip-content', placementClass].filter(Boolean).join(' ')
})
</script>
