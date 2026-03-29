<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <details class="zui-collapsible" v-bind="$attrs"><slot /></details>
</template>
