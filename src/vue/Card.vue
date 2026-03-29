<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  href?: string
}

const props = defineProps<Props>()
const attrs = useAttrs()
const classes = computed(() =>
  ['zui-card', props.href && 'zui-card-interactive', attrs.class as string | undefined]
    .filter(Boolean).join(' ')
)
</script>

<template>
  <a v-if="href" :class="classes" :href="href" v-bind="{ ...attrs, class: undefined }"><slot /></a>
  <div v-else :class="classes" v-bind="{ ...attrs, class: undefined }"><slot /></div>
</template>
