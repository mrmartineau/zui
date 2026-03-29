<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <caption class="zui-table-caption" v-bind="$attrs"><slot /></caption>
</template>
