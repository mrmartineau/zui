<template>
  <div :class="classes" data-zui-dropzone="" :data-max-size="maxSize">
    <label class="zui-dropzone-box">
      <input v-bind="$attrs" class="zui-dropzone-input" type="file" />
      <PhUploadSimple class="zui-dropzone-icon" aria-hidden="true" />
      <span class="zui-dropzone-title">{{ label }}</span>
      <span v-if="hint" class="zui-dropzone-hint">{{ hint }}</span>
    </label>
    <p class="zui-dropzone-status" role="status"></p>
  </div>
</template>

<script setup lang="ts">
import { PhUploadSimple } from '@phosphor-icons/vue'
import type { VariantProps } from 'cva'
import { computed, onMounted } from 'vue'
import { initDropzones } from '../shared/dropzone'
import { dropzoneVariants } from '../shared/dropzoneVariants'

defineOptions({ inheritAttrs: false })

type DropzoneVariantProps = VariantProps<typeof dropzoneVariants>

const props = withDefaults(
  defineProps<{
    /** Class for the wrapper. Other attributes go to the `<input>`. */
    class?: string
    shape?: DropzoneVariantProps['shape']
    /** Main text. Also part of the input's accessible name */
    label?: string
    /** Smaller text under the label, such as the allowed types and size */
    hint?: string
    /** Largest file in bytes. Larger files are refused and named in the status line */
    maxSize?: number
  }>(),
  {
    label: 'Drop files here, or click to browse',
  },
)

const classes = computed(() =>
  dropzoneVariants({ className: props.class, shape: props.shape }),
)

onMounted(initDropzones)
</script>
