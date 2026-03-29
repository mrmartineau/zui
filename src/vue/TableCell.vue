<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <td class="zui-table-cell" v-bind="$attrs"><slot /></td>
</template>
