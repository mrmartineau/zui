<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <code class="zui-code" v-bind="$attrs"><slot /></code>
</template>
