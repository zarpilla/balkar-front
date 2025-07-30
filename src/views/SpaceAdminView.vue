<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LearningSpaceAdmin from '@/components/LearningSpaceAdmin.vue'
import { useAuthStore } from '@/stores/auth'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { ref } from 'vue'
const { t } = useI18n()

const router = useRouter()

const uid = router.currentRoute.value.params.uid as string

const authStore = useAuthStore()

const loaded = ref(false)
const spaceLoaded = (space: any) => {
  console.log('space loaded', space)
  loaded.value = true
}
</script>

<template>
  <LayoutAuthenticated css="bg-white" v-if="authStore.isAuthenticated()">
    <div class="space zpt-3">      
      <learning-space-admin :uid="uid"></learning-space-admin>
    </div>
  </LayoutAuthenticated>
</template>

<style>
@media (min-width: 1024px) {
}
</style>
