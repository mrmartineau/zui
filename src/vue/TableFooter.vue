<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <tfoot class="zui-table-footer" v-bind="$attrs"><slot /></tfoot>
</template>
