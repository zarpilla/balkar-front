<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
</script>

<template>
  <LayoutAuthenticated css="bg-white">
    <div class="space zpt-3">
      <router-view></router-view>
    </div>
  </LayoutAuthenticated>

</template>

<style>
@media (min-width: 1024px) {
}
</style>

<style scoped lang="scss">
.router-link-exact-active, .router-link-exact-active:hover{
  background:  var(--blanc, #000000)!important;
  color: #fff!important; 

  &:hover {
    background: var(--Green, #44B08E)!important;
    color: #fff!important;
  }
}
</style>
