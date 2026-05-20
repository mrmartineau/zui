<template>
  <div :class="classes" v-bind="$attrs"><slot /></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { appShellSidebarFooterVariants } from '../shared/appShellVariants'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string }>()
const classes = computed(() =>
  appShellSidebarFooterVariants({ class: props.class }),
)
</script>
