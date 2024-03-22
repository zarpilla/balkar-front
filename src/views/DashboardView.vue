<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router'
import VueMarkdown from 'vue-markdown-render'
import { useI18n } from 'vue-i18n'
import LearningSpaces from '@/components/LearningSpaces.vue'
const { t } = useI18n()

const router = useRouter()
</script>

<template>
  <LayoutAuthenticated>
    <div class="about">
      <div class="container">
        <div class="row align-items-start">
          <vue-markdown
            class="mt-4 mb-4"
            :linkify="true"
            :source="$t('balkar-main-description')"
            :options="{ html: true, linkTarget: '_blank' }"
          ></vue-markdown>

          <learning-spaces state=""></learning-spaces>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>

<style>
@media (min-width: 1024px) {
}
</style>
