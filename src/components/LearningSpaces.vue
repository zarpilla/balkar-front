<script setup lang="ts">
import { Api } from '@/service/api'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { ref } from 'vue'
import Profile from '@/components/account/Profile.vue'
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  state: string
}>()

const locale = useI18n().locale

const loaded = ref(false)
const spaces = ref<any>([])
const load = async () => {
  const response = await Api.learningSpaces.mine(locale.value)
  console.log(response.data)
  if (response.data && response.data.data) {
    spaces.value = response.data.data
  }
  loaded.value = true
}

load()

const authStore = useAuthStore()

const mySpaces = computed(() => {
  return spaces.value.filter((space: any) => space.enrolled === true)
})

const otherSpaces = computed(() => {
  return spaces.value.filter((space: any) => space.enrolled === false)
})
</script>

<template>  
  <div class="learning-spaces" v-if="loaded">    
    <div v-if="authStore.createdAt !== authStore.updatedAt">
      <h3 class="mb-4" v-if="mySpaces.length > 0">{{ $t('els-meus-espais-formatius') }}</h3>

      <div v-for="space in mySpaces" :key="space.id">
        <RouterLink :to="`/space/${space.uid}`" class="btn btn-tertiary mb-4">
          {{ space.name }}
          <span v-if="space.completedPct !== null">{{
            '(' + (space.completedPct * 100).toFixed(0) + '%)'
          }}</span>
          <svg
            width="19"
            height="15"
            viewBox="0 0 19 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 6.5C0.447715 6.5 9.65645e-08 6.94772 0 7.5C-9.65645e-08 8.05228 0.447715 8.5 1 8.5L1 6.5ZM18.7071 8.20711C19.0976 7.81659 19.0976 7.18342 18.7071 6.7929L12.3431 0.428934C11.9526 0.0384097 11.3195 0.0384096 10.9289 0.428934C10.5384 0.819458 10.5384 1.45262 10.9289 1.84315L16.5858 7.5L10.9289 13.1569C10.5384 13.5474 10.5384 14.1805 10.9289 14.5711C11.3195 14.9616 11.9526 14.9616 12.3431 14.5711L18.7071 8.20711ZM1 8.5L18 8.5L18 6.5L1 6.5L1 8.5Z"
              fill="#020034"
            />
          </svg>
        </RouterLink>
      </div>

      <h3 v-if="otherSpaces.length > 0" class="mt-5 mb-4">
        {{ $t('tots-els-espais-d-aprenentatge') }}
      </h3>

      <div v-for="space in otherSpaces" :key="space.id">
        <RouterLink :to="`/space/${space.uid}`" class="btn btn-tertiary mb-4">
          {{ space.name }}
          <svg
            width="19"
            height="15"
            viewBox="0 0 19 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 6.5C0.447715 6.5 9.65645e-08 6.94772 0 7.5C-9.65645e-08 8.05228 0.447715 8.5 1 8.5L1 6.5ZM18.7071 8.20711C19.0976 7.81659 19.0976 7.18342 18.7071 6.7929L12.3431 0.428934C11.9526 0.0384097 11.3195 0.0384096 10.9289 0.428934C10.5384 0.819458 10.5384 1.45262 10.9289 1.84315L16.5858 7.5L10.9289 13.1569C10.5384 13.5474 10.5384 14.1805 10.9289 14.5711C11.3195 14.9616 11.9526 14.9616 12.3431 14.5711L18.7071 8.20711ZM1 8.5L18 8.5L18 6.5L1 6.5L1 8.5Z"
              fill="#020034"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
    <div v-else>      
      <h3>{{ $t('omple-perfil') }}</h3>
      <div class="mt-4 text" v-html="$t('omple-perfil-desc')">
      </div>
      <Profile redirect="/dashboard"></Profile>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
