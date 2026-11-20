<template>
  <button
    v-bind="$attrs"
    ref="triggerRef"
    :aria-controls="panelId"
    :aria-selected="isActive"
    :class="classes"
    :data-disabled="props.disabled ? 'true' : undefined"
    :data-orientation="snapshot.orientation"
    :data-state="isActive ? 'active' : 'inactive'"
    :data-value="props.value"
    data-zui-tabs-trigger=""
    :disabled="props.disabled || snapshot.disabled"
    :id="triggerId"
    @blur="handleBlur"
    @click="handleClick"
    @focus="handleFocus"
    @keydown="handleKeydown"
    role="tab"
    :tabindex="isActive ? 0 : -1"
    type="button"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsTriggerVariants } from '../shared/tabsVariants'
import { getTabsTriggerOrder, useTabsContext } from './tabsContext'

defineOptions({ inheritAttrs: false })

type TabsTriggerVariantProps = VariantProps<typeof tabsTriggerVariants>

const props = defineProps<{
  class?: string
  disabled?: boolean
  value: string
  variant?: TabsTriggerVariantProps['variant']
}>()

const { controller, rootRef, snapshot } = useTabsContext()
const triggerRef = ref<HTMLButtonElement>()

const classes = computed(() =>
  tabsTriggerVariants({ className: props.class, variant: props.variant }),
)
const isActive = computed(() => snapshot.value.selectedValue === props.value)
const triggerId = computed(() => createTabsTriggerId(snapshot.value.rootId, props.value))
const panelId = computed(() => createTabsContentId(snapshot.value.rootId, props.value))

let unregister: (() => void) | undefined

watchEffect(() => {
  unregister?.()
  unregister = controller.registerTrigger({
    disabled: !!props.disabled,
    element: triggerRef.value ?? null,
    order: getTabsTriggerOrder(rootRef.value, triggerRef.value),
    panelId: panelId.value,
    triggerId: triggerId.value,
    value: props.value,
  })
})

onUnmounted(() => unregister?.())

function handleBlur(event: FocusEvent) {
  if (!event.defaultPrevented) controller.blurTrigger(props.value)
}

function handleClick(event: MouseEvent) {
  if (!event.defaultPrevented) controller.clickTrigger(props.value)
}

function handleFocus(event: FocusEvent) {
  if (!event.defaultPrevented) controller.focusTrigger(props.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (!event.defaultPrevented) controller.handleTriggerKeydown(event, props.value)
}
</script>
