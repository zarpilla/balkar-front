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
  <img class="icon" :class="`s-${w || 24}`" :src="icon" />
</template>
<style scoped>
.s-32 {
  width: 32px;
}
.s-24 {
  width: 24px;
}
.s-10 {
  width: 10px;
}
.s-12 {
  width: 12px;
}
</style>
