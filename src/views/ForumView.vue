<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ForumSpace from '@/components/ForumSpace.vue'
import { watch, ref } from 'vue';

const { t } = useI18n()

const router = useRouter()

const uid = ref(router.currentRoute.value.params.uid as string)


watch(() => router.currentRoute.value.params.uid, (newUid, oldUid) => {
  uid.value = router.currentRoute.value.params.uid as string
})


</script>

<template>
  <LayoutAuthenticated css="bg-white">
    <div class="space zpt-3">
      <forum-space :uid="uid"></forum-space>      
    </div>
  </LayoutAuthenticated>
</template>

<style>
@media (min-width: 1024px) {
}
</style>
