<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="zui-collapsible-content" v-bind="$attrs"><slot /></div>
</template>
