<template>
  <div :class="['zui-password-input', props.class]">
    <input
      :class="inputVariants({ shape: props.shape })"
      v-bind="$attrs"
      :type="visible ? 'text' : 'password'"
    />
    <button
      type="button"
      :class="passwordInputToggleClass"
      :aria-label="props.toggleLabel ?? 'Show password'"
      :aria-pressed="visible"
      :disabled="$attrs.disabled != null && $attrs.disabled !== false"
      @click="visible = !visible"
    >
      <i :class="['ph', visible ? 'ph-eye-slash' : 'ph-eye']" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { ref } from 'vue'
import { inputVariants } from '../shared/inputVariants'
import { passwordInputToggleClass } from '../shared/passwordInput'

defineOptions({ inheritAttrs: false })

type InputVariantProps = VariantProps<typeof inputVariants>

const props = defineProps<{
  class?: string
  shape?: InputVariantProps['shape']
  toggleLabel?: string
  /** Not allowed: the toggle owns the input type. */
  type?: never
}>()

const visible = ref(false)
</script>
