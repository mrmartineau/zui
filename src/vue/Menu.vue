<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <details class="zui-menu" v-bind="$attrs"><slot /></details>
</template>
