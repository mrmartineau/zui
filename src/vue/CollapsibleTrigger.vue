<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <summary class="zui-collapsible-trigger" v-bind="$attrs"><slot /></summary>
</template>
