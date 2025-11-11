<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useI18n } from 'vue-i18n'
import LearningSpaces from '@/components/LearningSpaces.vue'
import LearningSpacesPublic from '@/components/LearningSpacesPublic.vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <LayoutAuthenticated v-if="authStore.isAuthenticated()">
    <div class="about">
      <div class="container">
        <div class="row align-items-start">
          <learning-spaces state=""></learning-spaces>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
  <LayoutGuest css="slot-mb-0 px-0" :container="false" :loaded="true" v-else>
    <div class="zabout-intro">
      <div class="container">
        <div class="row align-items-start">
          <h1>{{ t('dashboard-title-guest') }}</h1>
        </div>
      </div>
    </div>
    <div class="zabout px-3">
      <div class="container">
        <div class="row align-items-start about-circled">
          <div class="col-7 zp-5">
            <h4>{{ t('dashboard-intro-guest') }}</h4>            
          </div>
          <div class="col-5 bg-about">            
          </div>
        </div>
      </div>
    </div>
    <div class="about px-3">
      <div class="container">
        <div class="row align-items-start">
          <learning-spaces-public state=""></learning-spaces-public>
        </div>
      </div>
    </div>
  </LayoutGuest>
</template>

<style>
.about {
  background: #cfe0fc;
  margin-top: 3rem;
}
.about-circled {
  border-radius: 1rem;
  padding: 3rem;
  margin-top: 3rem;
  background: #cfe0fc url('@/assets/images/bg-about.svg') no-repeat center right;
}
h4 {
  font-weight: 500;
  font-size: 26px;
  color: #2C3036;
  
}
.slot-mb-0 .slot {
  margin-bottom: 0!important;
}
</style>
