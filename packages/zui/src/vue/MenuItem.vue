<template>
  <a
    v-if="href"
    v-bind="$attrs"
    ref="itemRef"
    :aria-disabled="snapshot.disabled || disabled ? 'true' : undefined"
    :class="classes"
    :data-disabled="snapshot.disabled || disabled ? 'true' : undefined"
    :data-highlighted="highlighted ? 'true' : undefined"
    :data-text-value="textValue"
    data-zui-menu-item=""
    :href="href"
    :id="itemId"
    role="menuitem"
    :tabindex="snapshot.open && highlighted ? 0 : -1"
    @click="handleClick"
    @focus="handleFocus"
    @pointerenter="handlePointerEnter"
  >
    <slot />
  </a>
  <button
    v-else
    v-bind="$attrs"
    ref="itemRef"
    :class="classes"
    :data-disabled="snapshot.disabled || disabled ? 'true' : undefined"
    :data-highlighted="highlighted ? 'true' : undefined"
    :data-text-value="textValue"
    data-zui-menu-item=""
    :disabled="snapshot.disabled || disabled"
    :id="itemId"
    role="menuitem"
    :tabindex="snapshot.open && highlighted ? 0 : -1"
    type="button"
    @click="handleClick"
    @focus="handleFocus"
    @pointerenter="handlePointerEnter"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { createMenuItemId } from '../core/menu'
import { buttonVariants } from '../shared/buttonVariants'
import { getMenuItemOrder, useMenuContext } from './menuContext'

defineOptions({ inheritAttrs: false })

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    disabled?: boolean
    href?: string
    id?: string
    textValue?: string
    variant?: ButtonVariantProps['variant']
    color?: ButtonVariantProps['color']
    size?: ButtonVariantProps['size']
    shape?: ButtonVariantProps['shape']
    icon?: ButtonVariantProps['icon']
  }>(),
  {
    disabled: false,
    variant: 'ghost',
  },
)

const { controller, rootRef, snapshot } = useMenuContext()
const itemRef = ref<HTMLElement>()
const fallbackId = createMenuItemId(snapshot.value.rootId)
const itemId = computed(() => props.id ?? fallbackId)
const highlighted = computed(() => snapshot.value.highlightedItemId === itemId.value)
let unregister = () => {}

watchEffect(() => {
  unregister()
  unregister = controller.registerItem({
    disabled: props.disabled,
    element: itemRef.value ?? null,
    id: itemId.value,
    kind: props.href ? 'link' : 'button',
    order: getMenuItemOrder(rootRef.value, itemRef.value),
    textValue: props.textValue,
  })
})

onUnmounted(() => unregister())

const classes = computed(() =>
  buttonVariants({
    className: ['zui-menu-item', props.class].filter(Boolean).join(' '),
    color: props.color,
    icon: props.icon,
    shape: props.shape,
    size: props.size,
    variant: props.variant,
  }),
)

function handleClick(event: MouseEvent) {
  const accepted = controller.selectItem(itemId.value)
  if (!accepted && (snapshot.value.disabled || props.disabled)) event.preventDefault()
}

function handleFocus() {
  controller.focusItem(itemId.value)
}

function handlePointerEnter() {
  controller.handleItemPointerEnter(itemId.value)
}
</script>
