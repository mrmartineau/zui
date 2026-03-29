<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <tr class="zui-table-row" v-bind="$attrs"><slot /></tr>
</template>
