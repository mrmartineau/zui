<template>
  <button
    v-bind="$attrs"
    ref="triggerRef"
    :aria-controls="snapshot.contentId"
    :aria-expanded="snapshot.open"
    aria-haspopup="menu"
    :class="classes"
    :data-disabled="snapshot.triggerDisabled ? 'true' : undefined"
    :data-state="snapshot.open ? 'open' : 'closed'"
    data-zui-menu-trigger=""
    :disabled="snapshot.disabled || disabled"
    :id="snapshot.triggerId"
    type="button"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { VariantProps } from 'cva'
import { computed, onUnmounted, ref, watch } from 'vue'
import { buttonVariants } from '../shared/buttonVariants'
import { useMenuContext } from './menuContext'

defineOptions({ inheritAttrs: false })

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    disabled?: boolean
    variant?: ButtonVariantProps['variant']
    color?: ButtonVariantProps['color']
    size?: ButtonVariantProps['size']
    shape?: ButtonVariantProps['shape']
    icon?: ButtonVariantProps['icon']
  }>(),
  {
    disabled: false,
    variant: 'outline',
  },
)

const { controller, snapshot } = useMenuContext()
const triggerRef = ref<HTMLButtonElement>()
const triggerId = controller.getSnapshot().triggerId
let unregister = () => {}

watch(
  [() => props.disabled, triggerRef],
  () => {
    unregister()
    unregister = controller.registerTrigger({
      disabled: props.disabled,
      element: triggerRef.value ?? null,
      triggerId,
    })
  },
  { immediate: true },
)

onUnmounted(() => unregister())

const classes = computed(() =>
  buttonVariants({
    className: ['zui-menu-trigger', props.class].filter(Boolean).join(' '),
    color: props.color,
    icon: props.icon,
    shape: props.shape,
    size: props.size,
    variant: props.variant,
  }),
)

function handleClick(event: MouseEvent) {
  if (!event.defaultPrevented) controller.handleTriggerClick()
}

function handleKeydown(event: KeyboardEvent) {
  if (!event.defaultPrevented) controller.handleTriggerKeydown(event)
}
</script>
