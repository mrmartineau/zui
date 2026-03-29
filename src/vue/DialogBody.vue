<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="zui-dialog-body" v-bind="$attrs"><slot /></div>
</template>
