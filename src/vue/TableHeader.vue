<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <thead class="zui-table-header" v-bind="$attrs"><slot /></thead>
</template>
