<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <table class="zui-table" v-bind="$attrs"><slot /></table>
</template>
