<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
</script>

<template>
  <LayoutAuthenticated css="bg-white">
    <div class="space zpt-3">
      <div class="container mt-4">
        <RouterLink class="btn btn-tertiary me-3" to="/account/profile">{{ $t( 'profile') }}</RouterLink>
        <RouterLink class="btn btn-tertiary" to="/account/profile/password">{{ $t( 'change-password') }}</RouterLink>
      </div>

      <router-view></router-view>
    </div>
  </LayoutAuthenticated>

</template>

<style>
@media (min-width: 1024px) {
}
</style>

<style scoped>
.router-link-exact-active, .router-link-exact-active:hover{
  background:  var(--blanc, #020034)!important;
  color: #fff!important; 
}
</style>
