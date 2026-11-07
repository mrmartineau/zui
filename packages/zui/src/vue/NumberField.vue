<template>
  <div :class="classes">
    <button
      type="button"
      class="zui-number-field-button"
      tabindex="-1"
      :aria-label="decrementLabel"
      :disabled="buttonDisabled()"
      @click="step($event, 'down')"
    >
      <PhMinus aria-hidden="true" />
    </button>
    <input
      type="number"
      class="zui-input zui-number-field-input"
      v-bind="$attrs"
    />
    <button
      type="button"
      class="zui-number-field-button"
      tabindex="-1"
      :aria-label="incrementLabel"
      :disabled="buttonDisabled()"
      @click="step($event, 'up')"
    >
      <PhPlus aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { PhMinus, PhPlus } from '@phosphor-icons/vue'
import type { VariantProps } from 'cva'
import { computed, useAttrs } from 'vue'
import { numberFieldVariants } from '../shared/numberFieldVariants'
import { stepNumberField } from '../shared/stepNumberField'

defineOptions({ inheritAttrs: false })

type NumberFieldVariantProps = VariantProps<typeof numberFieldVariants>

/** `class` goes on the wrapper. Other attributes go to the `<input>`. */
const props = withDefaults(
  defineProps<{
    class?: string
    shape?: NumberFieldVariantProps['shape']
    decrementLabel?: string
    incrementLabel?: string
    /** Not allowed: the buttons need a number input. */
    type?: never
  }>(),
  { decrementLabel: 'Decrease', incrementLabel: 'Increase' },
)

const classes = computed(() =>
  numberFieldVariants({ className: props.class, shape: props.shape }),
)
// disabled and readonly stay in $attrs and go to the input. Vue does not
// normalise attribute names, so check both spellings of readonly. attrs is
// not reactive, so this is a function the template calls on each render.
const attrs = useAttrs()
const isSet = (value: unknown) => value != null && value !== false
function buttonDisabled() {
  return isSet(attrs.disabled) || isSet(attrs.readonly) || isSet(attrs.readOnly)
}

function step(event: MouseEvent, direction: 'up' | 'down') {
  stepNumberField(event.currentTarget as Element, direction)
}
</script>
