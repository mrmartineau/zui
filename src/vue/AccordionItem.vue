<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <details class="zui-accordion-item" v-bind="$attrs"><slot /></details>
</template>
