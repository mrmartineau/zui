<template>
  <main :id="id ?? ctx.mainId" :class="classes" v-bind="$attrs">
    <slot />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { appShellMainVariants } from '../shared/appShellVariants'
import { useAppShellContext } from './appShellContext'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ id?: string; class?: string }>()
const ctx = useAppShellContext('AppShellMain')
const classes = computed(() => appShellMainVariants({ class: props.class }))
</script>
