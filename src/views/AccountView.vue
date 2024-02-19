<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
</script>

<template>
  <LayoutAuthenticated>
    <div class="account">
      <div class="container mt-4">
        <RouterLink class="button" to="/account/profile">Profile</RouterLink>
        <RouterLink class="button" to="/account/business">Business Account</RouterLink>
        <RouterLink class="button" to="/account/contact">Contact</RouterLink>
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
.button {
  display: inline-block;
  border-radius: 4px;
  background: #f3f3f3;
  color: #000;
  font-family: 'SF Pro Text';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 228.571% */
  padding: 0 16px;
  margin-right: 16px;
  text-decoration: none;
}
.router-link-active{
  background: var(--Orange-20, #FFEBDD); 
  color: #BD4400; 
  font-weight: 700;
}
</style>
