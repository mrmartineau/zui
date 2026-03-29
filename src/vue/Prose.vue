<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="prose" v-bind="$attrs"><slot /></div>
</template>
