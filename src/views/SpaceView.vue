<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router'
import VueMarkdown from 'vue-markdown-render'
import { useI18n } from 'vue-i18n'
import LearningSpace from '@/components/LearningSpace.vue'
const { t } = useI18n()

const router = useRouter()

const uid = router.currentRoute.value.params.uid as string

</script>

<template>
  <LayoutAuthenticated css="bg-white">

    <div class="space zpt-3">

      <learning-space :uid="uid"></learning-space>
      
    </div>
  </LayoutAuthenticated>
</template>

<style>
@media (min-width: 1024px) {
}
</style>
