<script setup lang="ts">
import { ref, watch, computed, useAttrs } from 'vue'
import type { VariantProps } from 'cva'
import { dialogVariants } from '../shared/dialogVariants'

defineOptions({ inheritAttrs: false })

interface Props extends VariantProps<typeof dialogVariants> {
  open?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()
const attrs = useAttrs()
const dialogRef = ref<HTMLDialogElement>()
const classes = computed(() => dialogVariants({ size: props.size, class: attrs.class as string | undefined }))

watch(() => props.open, (open) => {
  if (open) {
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})
</script>

<template>
  <dialog ref="dialogRef" :class="classes" @close="emit('close')" v-bind="{ ...attrs, class: undefined }"><slot /></dialog>
</template>
