<template>
  <span :class="classes" v-bind="$attrs">
    <span class="zui-avatar-fallback">
      <slot name="fallback">
        <i class="ph ph-user" aria-hidden="true" />
      </slot>
    </span>
    <img
      v-if="src && !imageError"
      class="zui-avatar-image"
      :src="src"
      :alt="alt ?? ''"
      @error="imageError = true"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { VariantProps } from 'cva'
import { avatarVariants } from '../shared/avatarVariants'

defineOptions({ inheritAttrs: false })

type AvatarVariantProps = VariantProps<typeof avatarVariants>

const props = defineProps<{
  class?: string
  src?: string
  alt?: string
  size?: AvatarVariantProps['size']
  shape?: AvatarVariantProps['shape']
}>()

const imageError = ref(false)
const classes = computed(() => avatarVariants({ size: props.size, shape: props.shape, className: props.class }))
</script>
