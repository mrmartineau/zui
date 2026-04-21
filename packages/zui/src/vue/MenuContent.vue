<template>
  <div
    v-bind="$attrs"
    ref="contentRef"
    :aria-labelledby="snapshot.triggerId"
    :class="classes"
    :data-align="snapshot.align"
    :data-side="snapshot.side"
    :data-state="snapshot.open ? 'open' : 'closed'"
    data-zui-menu-content=""
    :hidden="!snapshot.open"
    :id="snapshot.contentId"
    role="menu"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { useMenuContext } from './menuContext'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string }>()
const { controller, snapshot } = useMenuContext()
const contentRef = ref<HTMLDivElement>()
let unregister = () => {}

watchEffect(() => {
  unregister()
  unregister = controller.registerContent({
    contentId: snapshot.value.contentId,
    element: contentRef.value ?? null,
  })
})

onUnmounted(() => unregister())

const classes = computed(() => ['zui-menu-content', props.class].filter(Boolean).join(' '))

function handleKeydown(event: KeyboardEvent) {
  if (!event.defaultPrevented) controller.handleContentKeydown(event)
}
</script>
