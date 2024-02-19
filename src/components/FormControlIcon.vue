<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: null
  },
  h: {
    type: String,
    default: null
  },
  w: {
    type: String,
    default: null
  }
})
</script>

<template>
  <img class="position-absolute top-10 left-0" :class="`s-${w || 24}`" :src="icon" />
  <!-- <BaseIcon
    :path="icon"
    w="w-10"
    :h="h"
    class="position-absolute top-10 left-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400"
  /> -->
</template>
<style scoped>
.s-24 {
  width: 24px;
}
.top-10 {
  top: 10px;
  right: 10px;
}
</style>
