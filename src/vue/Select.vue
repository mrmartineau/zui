<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <select class="zui-select" v-bind="$attrs"><slot /></select>
</template>
