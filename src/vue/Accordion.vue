<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  flush?: boolean
}

const props = defineProps<Props>()
const attrs = useAttrs()
const classes = computed(() =>
  ['zui-accordion', props.flush && 'zui-accordion-flush', attrs.class as string | undefined]
    .filter(Boolean).join(' ')
)
</script>

<template>
  <div :class="classes" v-bind="{ ...attrs, class: undefined }"><slot /></div>
</template>
