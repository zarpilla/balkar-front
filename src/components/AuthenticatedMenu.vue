<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
</script>

<template>
  <div class="d-flex flex-row flex-wrap">
    <RouterLink to="/dashboard" class="btn btn-secondary me-4"> {{ $t('les-meves-formacions') }} </RouterLink>

    <RouterLink v-if="$t('agora-link') !== 'agora-link'" :to="$t('agora-link')" class="btn btn-secondary me-auto"> {{ $t('agora') }}</RouterLink>
  </div>
</template>
<style scoped>
.d-flex > * {
  margin: 7px 0 0;
}
a {
  color: var(--gray-0280, #616161);

  /* Body Text/SF Pro/14/Regular */
  font-family: Athletics;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  text-decoration: none;
  padding-right: 1.5rem;
  padding-left: 1.5rem;

}
a.router-link-active {
  background: var(--Resilience-fosc, #020034)!important;
  color: var(--blanc, #FFF)!important;
}

a:not(.router-link-active) {  
}
</style>
