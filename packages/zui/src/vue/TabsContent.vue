<template>
  <div
    v-bind="$attrs"
    ref="contentRef"
    :aria-labelledby="triggerId"
    :class="classes"
    :data-orientation="snapshot.orientation"
    :data-state="isActive ? 'active' : 'inactive'"
    :data-value="props.value"
    data-zui-tabs-content=""
    :hidden="isHidden"
    :id="panelId"
    role="tabpanel"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsContentVariants } from '../shared/tabsVariants'
import { useTabsContext } from './tabsContext'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
  hidden?: boolean
  value: string
}>()

const { controller, snapshot } = useTabsContext()
const contentRef = ref<HTMLDivElement>()

const classes = computed(() => tabsContentVariants({ className: props.class }))
const isActive = computed(() => snapshot.value.selectedValue === props.value)
const triggerId = computed(() => createTabsTriggerId(snapshot.value.rootId, props.value))
const panelId = computed(() => createTabsContentId(snapshot.value.rootId, props.value))
const isHidden = computed(() => props.hidden ?? !isActive.value)

let unregister: (() => void) | undefined

watchEffect(() => {
  unregister?.()
  unregister = controller.registerContent({
    element: contentRef.value ?? null,
    panelId: panelId.value,
    triggerId: triggerId.value,
    value: props.value,
  })
})

onUnmounted(() => unregister?.())
</script>
