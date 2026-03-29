<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <a class="zui-link" v-bind="$attrs"><slot /></a>
</template>
