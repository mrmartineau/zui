<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { VariantProps } from 'cva'
import { tooltipVariants } from '../shared/tooltipVariants'

defineOptions({ inheritAttrs: false })

interface Props extends VariantProps<typeof tooltipVariants> {
  text: string
}

const props = defineProps<Props>()
const attrs = useAttrs()
const id = `tooltip-${Math.random().toString(36).slice(2)}`
const anchorName = `--${id}`
const contentClass = computed(() => [
  'zui-tooltip-content',
  tooltipVariants({ placement: props.placement }).split(' ').find((c: string) => c.startsWith('zui-tooltip-placement-')),
].filter(Boolean).join(' '))
</script>

<template>
  <span :class="['zui-tooltip', attrs.class]" v-bind="{ ...attrs, class: undefined }">
    <span :style="{ 'anchor-name': anchorName }" :popover-target="id" popover-target-action="hover">
      <slot />
    </span>
    <span
      popover="hint"
      :id="id"
      :class="contentClass"
      role="tooltip"
      :style="{ 'position-anchor': anchorName }"
    >{{ text }}</span>
  </span>
</template>
