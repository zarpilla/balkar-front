<script setup lang="ts">
import { Api } from '@/service/api'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { ref } from 'vue'
import Profile from '@/components/account/Profile.vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'

const props = defineProps<{
  state: string
}>()

const locale = useI18n().locale

const loaded = ref(false)
const spaces = ref<any>([])
const load = async () => {
  const response = await Api.learningSpaces.mine(locale.value)
  if (response.data && response.data.data) {
    spaces.value = response.data.data

    // if (mySpaces.value.length === 0 && otherSpaces.value.length === 1) {
    //   router.push(`/space/${otherSpaces.value[0].uid}`)
    // }
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

const router = useRouter()

const base = import.meta.env.VITE_API_BASE
// console.log('mySpaces', mySpaces.value)
// console.log('otherSpaces', otherSpaces.value)
</script>

<template>
  <div class="learning-spaces mb-4" v-if="loaded">
    <div v-if="authStore.createdAt !== authStore.updatedAt">
      <h3 class="mb-4" v-if="mySpaces.length > 0">{{ $t('els-meus-espais-formatius') }}</h3>

      <div v-for="space in mySpaces" :key="space.id" class="col-12 col-md-4 space">
        <div v-if="space.bannerOther && space.bannerOther.url" class="mt-5 banner-other">
          <div class="overlay"></div>
          <RouterLink :to="`/space/${space.uid}/about`" class="z">
            <img :src="base + space.bannerOther.url" class="w-100" />
          </RouterLink>
        </div>
        <div class="banner-name mb-4">
          <RouterLink :to="`/space/${space.uid}`" class="z">
            <div class="name zms-3">{{ space.name }}</div>
            <div class="name-more zms-3">{{ space.nameMore }}</div>
          </RouterLink>
        </div>
      </div>

      <h1 v-if="otherSpaces.length > 0" class="mt-5 mb-4 h1-40">
        {{ $t('all-courses') }}
      </h1>

      <div v-for="space in otherSpaces" :key="space.id" class="col-4 col-md-4 space">
        <div v-if="space.bannerOther && space.bannerOther.url" class="mt-5 banner-other">
          <div class="overlay"></div>
          <RouterLink :to="`/space/${space.uid}/about`" class="z">
            <img :src="base + space.bannerOther.url" class="w-100" />
          </RouterLink>
        </div>
        <div class="banner-name mb-4">
          <RouterLink :to="`/space/${space.uid}`" class="z">
            <div class="name zms-3">{{ space.name }}</div>
            <div class="name-more zms-3">{{ space.nameMore }}</div>
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>{{ $t('omple-perfil') }}</h3>
      <div class="mt-4 text" v-html="$t('omple-perfil-desc')"></div>
      <Profile redirect="/dashboard"></Profile>
    </div>
  </div>
</template>

<style scoped>
h1-40 {
  color: var(--Black, #000);
  font-family: Inter;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 45px; /* 112.5% */
}

.banner-other {
  border-radius: 20px;
  overflow: hidden;
  background:
    linear-gradient(180deg, #44b08e 0%, rgba(68, 176, 142, 0) 100%),
    lightgray 50% / cover no-repeat;
  position: relative;

  img {
    height: 320px;
    object-fit: cover;
  }
}
.banner-name {
  border-radius: 20px;
  background: var(--White, #fff);
  text-decoration: none;
  padding: 30px;

  .name {
    color: var(--Black, #000);
    font-variant-numeric: lining-nums tabular-nums;
    font-family: 'DM Sans';
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 26.4px */
    letter-spacing: 0.22px;
    margin-bottom: 10px;
  }
  .name-more {
    color: var(--Black, #000);

    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%; /* 23.4px */
    letter-spacing: 0.18px;
  }
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 500px;
  background: linear-gradient(180deg, #44b08e 0%, rgba(68, 176, 142, 0) 100%);
  overflow: hidden;
  pointer-events: none;
}
</style>
