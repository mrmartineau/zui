<template>
  <div
    v-bind="$attrs"
    ref="rootRef"
    :class="classes"
    :data-disabled="snapshot.disabled ? 'true' : undefined"
    :data-orientation="snapshot.orientation"
    data-zui-tabs-root=""
    :id="snapshot.rootId"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import {
  createTabsController,
  type TabsActivationMode,
  type TabsDirection,
  type TabsOrientation,
} from '../core/tabs'
import { tabsVariants } from '../shared/tabsVariants'
import { provideTabsContext } from './tabsContext'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  activationMode?: TabsActivationMode
  class?: string
  defaultValue?: string
  dir?: TabsDirection
  disabled?: boolean
  id?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
  value?: string
}>()

const controller = createTabsController({
  activationMode: props.activationMode,
  defaultValue: props.defaultValue,
  dir: props.dir,
  disabled: props.disabled,
  id: props.id,
  onValueChange: props.onValueChange,
  orientation: props.orientation,
  value: props.value,
})

const rootRef = ref<HTMLDivElement>()
const snapshot = ref(controller.getSnapshot())
const unsubscribe = controller.subscribe((next) => {
  snapshot.value = next
})

watchEffect(() => {
  controller.setOptions({
    activationMode: props.activationMode,
    defaultValue: props.defaultValue,
    dir: props.dir,
    disabled: props.disabled,
    id: props.id,
    onValueChange: props.onValueChange,
    orientation: props.orientation,
    value: props.value,
  })
})

onUnmounted(unsubscribe)

provideTabsContext({
  controller,
  rootRef,
  snapshot,
})

const classes = computed(() => tabsVariants({ className: props.class }))
</script>
