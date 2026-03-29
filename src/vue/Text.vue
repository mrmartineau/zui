<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { textSizeClass, type TextSize } from '../shared/textSizeClass'

defineOptions({ inheritAttrs: false })

interface Props {
  size?: TextSize
}

const props = withDefaults(defineProps<Props>(), { size: '0' })
const attrs = useAttrs()
const classes = computed(() =>
  [textSizeClass(props.size), attrs.class as string | undefined].filter(Boolean).join(' ')
)
</script>

<template>
  <span :class="classes" v-bind="{ ...attrs, class: undefined }"><slot /></span>
</template>
