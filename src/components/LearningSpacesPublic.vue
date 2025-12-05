<script setup lang="ts">
import { Api } from '@/service/api'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { ref } from 'vue'
import Profile from '@/components/account/Profile.vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { getApiBase } from '@/utils/config'

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
  }
  loaded.value = true
}

load()

const otherSpaces = computed(() => {
  return spaces.value.filter((space: any) => space.enrolled === false)
})

const base = getApiBase()
</script>

<template>
  <div class="learning-spaces mb-4 col-12" v-if="loaded">
    <div class="row">
      <div v-for="space in otherSpaces" :key="space.id" class="col-12 col-md-6 space">
        <div v-if="space.bannerOther && space.bannerOther.url" class="mt-5 banner-other">
          <div class="overlay"></div>
          <RouterLink :to="`/space/${space.uid}/about`" class="z">
            <img :src="base + space.bannerOther.url" class="w-100" />
          </RouterLink>
        </div>
        <div class="text-center banner-name mb-4">
          <RouterLink :to="`/space/${space.uid}/about`">
            <div class="name zms-3">{{ space.name }}</div>
            <div class="name-more zms-3">{{ space.nameMore }}</div>
          </RouterLink>
          <div class="btn btn-secondary mt-4">
            <RouterLink :to="`/space/${space.uid}/about`" class="text-dark text-capitalize">
              {{ $t('enroll') }}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 space">
        <div class="mt-5 banner-coming-soon">
          <div class="coming-name">
            {{ $t('coming-soon') }}
          </div>
        </div>
      </div>
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
    font-family: 'Inter';
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
.banner-coming-soon {
  border-radius: 20px;
  border: 1px solid #000;

  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 238px 60px;
  @media screen and (max-width: 768px) {
    padding: 100px 20px;
  }
}
.coming-name {
  color: var(--Black, #000);
  font-family: 'Inter';
  font-size: 35px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 31.2px */
  letter-spacing: 0px;
  text-align: center;
  padding: 0 20px;
}

</style>
