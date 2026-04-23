<template>
  <div
    v-bind="$attrs"
    ref="rootRef"
    :class="classes"
    :data-align="snapshot.align"
    :data-disabled="snapshot.disabled ? 'true' : undefined"
    :data-side="snapshot.side"
    :data-state="snapshot.open ? 'open' : 'closed'"
    data-zui-menu-root=""
    :id="snapshot.rootId"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watchEffect,
} from 'vue'
import {
  createMenuController,
  type MenuAlign,
  type MenuDirection,
  type MenuSide,
} from '../core/menu'
import { provideMenuContext } from './menuContext'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  align?: MenuAlign
  class?: string
  defaultOpen?: boolean
  dir?: MenuDirection
  disabled?: boolean
  id?: string
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  side?: MenuSide
}>()

const generatedId = useId()
const rootId = computed(() => props.id ?? `zui-menu-${generatedId}`)
const controller = createMenuController({
  align: props.align,
  defaultOpen: props.defaultOpen,
  dir: props.dir,
  disabled: props.disabled,
  id: rootId.value,
  modal: props.modal,
  onOpenChange: props.onOpenChange,
  open: props.open,
  side: props.side,
})

const rootRef = ref<HTMLDivElement>()
const snapshot = ref(controller.getSnapshot())
const unsubscribe = controller.subscribe((next) => {
  snapshot.value = next
})

watchEffect(() => {
  controller.setOptions({
    align: props.align,
    defaultOpen: props.defaultOpen,
    dir: props.dir,
    disabled: props.disabled,
    id: rootId.value,
    modal: props.modal,
    onOpenChange: props.onOpenChange,
    open: props.open,
    side: props.side,
  })
})

let removePointerDown = () => {}

onMounted(() => {
  const onPointerDown = (event: PointerEvent) =>
    controller.handleDocumentPointerDown(event.target)
  document.addEventListener('pointerdown', onPointerDown)
  removePointerDown = () => document.removeEventListener('pointerdown', onPointerDown)
})

onUnmounted(() => {
  unsubscribe()
  removePointerDown()
})

provideMenuContext({ controller, rootRef, snapshot })

const classes = computed(() => ['zui-menu', props.class].filter(Boolean).join(' '))
</script>
