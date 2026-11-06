<template>
  <div :class="classes">
    <button
      type="button"
      class="zui-number-field-button"
      tabindex="-1"
      :aria-label="decrementLabel"
      :disabled="buttonDisabled"
      @click="step($event, 'down')"
    >
      <i class="ph ph-minus" aria-hidden="true" />
    </button>
    <input
      type="number"
      class="zui-input zui-number-field-input"
      :disabled="disabled"
      :readonly="readonly"
      v-bind="$attrs"
    />
    <button
      type="button"
      class="zui-number-field-button"
      tabindex="-1"
      :aria-label="incrementLabel"
      :disabled="buttonDisabled"
      @click="step($event, 'up')"
    >
      <i class="ph ph-plus" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed } from 'vue'
import { numberFieldVariants } from '../shared/numberFieldVariants'
import { stepNumberField } from '../shared/stepNumberField'

defineOptions({ inheritAttrs: false })

type NumberFieldVariantProps = VariantProps<typeof numberFieldVariants>

/** `class` goes on the wrapper. Other attributes go to the `<input>`. */
const props = withDefaults(
  defineProps<{
    class?: string
    shape?: NumberFieldVariantProps['shape']
    disabled?: boolean
    readonly?: boolean
    decrementLabel?: string
    incrementLabel?: string
  }>(),
  { decrementLabel: 'Decrease', incrementLabel: 'Increase' },
)

const classes = computed(() =>
  numberFieldVariants({ className: props.class, shape: props.shape }),
)
const buttonDisabled = computed(() => props.disabled || props.readonly)

function step(event: MouseEvent, direction: 'up' | 'down') {
  stepNumberField(event.currentTarget as Element, direction)
}
</script>
