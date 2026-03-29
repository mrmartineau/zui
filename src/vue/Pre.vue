<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <pre class="zui-pre" v-bind="$attrs"><slot /></pre>
</template>
