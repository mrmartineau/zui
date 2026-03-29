<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="zui-dialog-header" v-bind="$attrs"><slot /></div>
</template>
