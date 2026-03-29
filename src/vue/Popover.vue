<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  id: string
  popover?: 'auto' | 'manual'
}

const props = withDefaults(defineProps<Props>(), { popover: 'auto' })
const attrs = useAttrs()
const classes = computed(() => ['zui-popover', attrs.class as string | undefined].filter(Boolean).join(' '))
const anchorStyle = computed(() => ({ 'position-anchor': `--${props.id}` }))
</script>

<template>
  <div :id="id" :popover="popover" :class="classes" :style="anchorStyle" v-bind="{ ...attrs, class: undefined }"><slot /></div>
</template>
