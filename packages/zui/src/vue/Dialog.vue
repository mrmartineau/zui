<template>
  <dialog ref="dialogRef" :class="classes" v-bind="$attrs" @close="$emit('close')">
    <slot />
  </dialog>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed, onMounted, ref, watch } from 'vue'
import { dialogVariants } from '../shared/dialogVariants'

defineOptions({ inheritAttrs: false })

type DialogVariantProps = VariantProps<typeof dialogVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    open?: boolean
    size?: DialogVariantProps['size']
    position?: DialogVariantProps['position']
    closedby?: 'any' | 'closerequest' | 'none'
  }>(),
  {
    closedby: 'any',
  },
)

defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement>()
const classes = computed(() =>
  dialogVariants({
    className: props.class,
    position: props.position,
    size: props.size,
  }),
)

watch(
  () => props.open,
  (val) => {
    if (val) {
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

watch(
  () => props.closedby,
  (val) => {
    dialogRef.value?.setAttribute('closedby', val ?? 'any')
  },
)

onMounted(() => {
  dialogRef.value?.setAttribute('closedby', props.closedby ?? 'any')
})
</script>
