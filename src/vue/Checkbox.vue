<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <label class="zui-checkbox">
    <input type="checkbox" v-bind="$attrs" />
    <slot />
  </label>
</template>
