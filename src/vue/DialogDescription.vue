<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <p class="zui-dialog-description" v-bind="$attrs"><slot /></p>
</template>
