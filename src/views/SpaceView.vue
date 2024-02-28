<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router'
import VueMarkdown from 'vue-markdown-render'
import { useI18n } from 'vue-i18n'
import LearningSpace from '@/components/LearningSpace.vue'
import { useAuthStore } from '@/stores/auth'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
const { t } = useI18n()

const router = useRouter()

const uid = router.currentRoute.value.params.uid as string


const authStore = useAuthStore()



</script>

<template>
  <LayoutAuthenticated css="bg-white" v-if="authStore.isAuthenticated()">
    <div class="space zpt-3">
      <learning-space :uid="uid"></learning-space>      
    </div>
  </LayoutAuthenticated>
  <LayoutGuest css="zbg-balkar" :loaded="true" v-else>
    <div class="space">
      <learning-space :uid="uid"></learning-space>      
    </div>    
  </LayoutGuest>
</template>

<style>
@media (min-width: 1024px) {
}
</style>
