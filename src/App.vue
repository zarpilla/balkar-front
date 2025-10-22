<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="(route.meta.transition as string) || 'fade'"
      mode="out-in"
    >
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.logo {
  width: 46px;
}

/* Fade transition styles */
.fade-enter-active {
  transition: opacity 0.3s ease-in;
  transition-delay: 0.2s;
}

.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

/* Keep the existing slide-right transition for backward compatibility */
.slide-right-enter-active {
  transition: opacity 0.3s ease-in;
  transition-delay: 0.2s;
}

.slide-right-leave-active {
  transition: opacity 0.2s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
}

.slide-right-leave-to {
  opacity: 0;
}

@media (min-width: 1024px) {
}
</style>
