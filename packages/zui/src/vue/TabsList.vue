<template>
  <div
    v-bind="$attrs"
    :class="classes"
    :data-orientation="snapshot.orientation"
    data-zui-tabs-list=""
    role="tablist"
    :aria-orientation="snapshot.orientation === 'vertical' ? 'vertical' : undefined"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { tabsListVariants } from '../shared/tabsVariants'
import { useTabsContext } from './tabsContext'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const { snapshot } = useTabsContext()
const classes = computed(() => tabsListVariants({ className: props.class }))
</script>
