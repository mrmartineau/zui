<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <summary class="zui-accordion-trigger" v-bind="$attrs"><slot /></summary>
</template>
