<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <th class="zui-table-head" v-bind="$attrs"><slot /></th>
</template>
