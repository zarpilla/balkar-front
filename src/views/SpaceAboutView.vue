<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LearningSpaceAbout from '@/components/LearningSpaceAbout.vue'
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
      <learning-space-about :uid="uid"></learning-space-about>
    </div>
  </LayoutAuthenticated>
  <LayoutGuest css="zbg-balkar" :loaded="true" v-else>    
    <div class="space">
      <learning-space-about :uid="uid"></learning-space-about>
    </div>
  </LayoutGuest>
</template>

<style>
@media (min-width: 1024px) {
}
</style>
