<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <tbody class="zui-table-body" v-bind="$attrs"><slot /></tbody>
</template>
