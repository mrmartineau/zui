<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <h2 class="zui-dialog-title" v-bind="$attrs"><slot /></h2>
</template>
