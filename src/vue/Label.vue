<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <label class="zui-label" v-bind="$attrs"><slot /></label>
</template>
