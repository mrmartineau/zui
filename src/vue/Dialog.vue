<template>
  <dialog ref="dialogRef" :class="classes" v-bind="$attrs" @close="$emit('close')">
    <slot />
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { VariantProps } from 'cva'
import { dialogVariants } from '../shared/dialogVariants'

defineOptions({ inheritAttrs: false })

type DialogVariantProps = VariantProps<typeof dialogVariants>

const props = withDefaults(defineProps<{
  class?: string
  open?: boolean
  size?: DialogVariantProps['size']
  closedby?: 'any' | 'closerequest' | 'none'
}>(), {
  closedby: 'any',
})

defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement>()
const classes = computed(() => dialogVariants({ size: props.size, className: props.class }))

watch(() => props.open, (val) => {
  if (val) {
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

watch(() => props.closedby, (val) => {
  dialogRef.value?.setAttribute('closedby', val ?? 'any')
})

onMounted(() => {
  dialogRef.value?.setAttribute('closedby', props.closedby ?? 'any')
})
</script>
