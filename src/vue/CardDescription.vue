<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="zui-card-description" v-bind="$attrs"><slot /></div>
</template>
