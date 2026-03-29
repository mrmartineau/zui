<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <label class="zui-radio">
    <input type="radio" v-bind="$attrs" />
    <slot />
  </label>
</template>
