<template>
  <span :class="wrapperClass" v-bind="$attrs">
    <!-- focusin/focusout: native focus does not bubble, so focus events
         from the wrapped child never reach this non-focusable span -->
    <span
      :style="{ 'anchor-name': anchorName }"
      @mouseenter="show"
      @mouseleave="hide"
      @focusin="show"
      @focusout="hide"
    >
      <slot />
    </span>
    <span
      popover="manual"
      :id="id"
      ref="popoverEl"
      :class="contentClass"
      role="tooltip"
      :style="{ 'position-anchor': anchorName }"
    >
      {{ text }}
    </span>
  </span>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed, ref } from 'vue'
import { tooltipVariants } from '../shared/tooltipVariants'

defineOptions({ inheritAttrs: false })

const id = `tooltip-${Math.random().toString(36).slice(2, 7)}`
const anchorName = `--${id}`
const popoverEl = ref<HTMLElement | null>(null)

type TooltipVariantProps = VariantProps<typeof tooltipVariants>

const props = defineProps<{
  text: string
  class?: string
  placement?: TooltipVariantProps['placement']
  shape?: TooltipVariantProps['shape']
}>()

const contentClass = computed(() => {
  const placementClass = tooltipVariants({ placement: props.placement })
    .split(' ')
    .find((c: string) => c.startsWith('zui-tooltip-placement-'))
  return ['zui-tooltip-content', placementClass].filter(Boolean).join(' ')
})

const wrapperClass = computed(() => {
  const shapeClass = tooltipVariants({ shape: props.shape })
    .split(' ')
    .find((c: string) => c.startsWith('zui-tooltip-shape-'))
  return ['zui-tooltip', shapeClass, props.class].filter(Boolean).join(' ')
})

const show = () => popoverEl.value?.showPopover()
const hide = () => popoverEl.value?.hidePopover()
</script>
