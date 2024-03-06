<script setup lang="ts">
import { ref } from 'vue'
import { useApplicationStore } from '@/stores/application.js'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t, locale } = useI18n()

const applicationStore = useApplicationStore()

const props = defineProps({
  loaded: {
    type: Boolean,
    required: true
  },
  css: {
    type: String,
    required: true
  }
})

const applicationLoaded = ref(false)

const apiBase = import.meta.env.VITE_API_BASE

applicationStore.load().then(async () => {
  applicationLoaded.value = true
})

if (localStorage.getItem('locale')) {
  const storedLocale = localStorage.getItem('locale')
  if (storedLocale){
    locale.value = storedLocale
  }  
}

const readQueryStringParameter = (name: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}


if (readQueryStringParameter('locale')) {
  const localeQs = readQueryStringParameter('locale')
  if (localeQs) {
    locale.value = localeQs
    localStorage.setItem('locale', localeQs)
    window.location
  }
}
</script>

<template>
  <header v-if="props.loaded && applicationLoaded" class="pb-4">
    <div class="container">
      <div class="logo-outter">
        <div class="d-flex align-items-center">

          <div class="col-6 col-md-2 order-0 order-md-0">
            <RouterLink to="/" class="logo">
              <img src="@/assets/logo.svg" alt="Balkar" />
            </RouterLink>
          </div>

          <div class="col-6 col-md-2 order-1 order-md-2 ms-auto">
            <div class="auth-wrapper mt-4 d-flex">
              <AuthenticatedUser></AuthenticatedUser>

              <LanguageSwitcher class="ms-4"></LanguageSwitcher>
            </div>
          </div>
          
        </div>  

      </div>
      <h1 class="mt-3 pb-3">{{ $t('benvinguda-al-teu-balkar') }}</h1>

      <div class="d-flex flex-wrap">
        <RouterLink to="/login" class="btn btn-secondary me-5 mb-4 mb-md-0">
          {{ $t('accedeix-al-teu-perfil') }}
          <svg
            width="16"
            height="19"
            viewBox="0 0 16 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.83496 1C8.83496 0.447715 8.38725 1.30493e-08 7.83496 0C7.28268 -1.30493e-08 6.83496 0.447715 6.83496 1L8.83496 1ZM7.12785 18.7071C7.51838 19.0976 8.15154 19.0976 8.54207 18.7071L14.906 12.3431C15.2966 11.9526 15.2966 11.3195 14.906 10.9289C14.5155 10.5384 13.8823 10.5384 13.4918 10.9289L7.83496 16.5858L2.17811 10.9289C1.78758 10.5384 1.15442 10.5384 0.763892 10.9289C0.373368 11.3195 0.373368 11.9526 0.763892 12.3431L7.12785 18.7071ZM6.83496 1L6.83496 18L8.83496 18L8.83496 1L6.83496 1Z"
              fill="#020034"
            />
          </svg>
        </RouterLink>

        <RouterLink to="/register" class="btn btn-secondary mb-4 mb-md-0">
          {{ $t('crea-nou-perfil') }}
          <svg
            width="16"
            height="19"
            viewBox="0 0 16 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1C9 0.447715 8.55228 1.43769e-08 8 0C7.44772 -1.43769e-08 7 0.447715 7 1L9 1ZM7.29289 18.7071C7.68342 19.0976 8.31658 19.0976 8.70711 18.7071L15.0711 12.3431C15.4616 11.9526 15.4616 11.3195 15.0711 10.9289C14.6805 10.5384 14.0474 10.5384 13.6569 10.9289L8 16.5858L2.34315 10.9289C1.95262 10.5384 1.31946 10.5384 0.928931 10.9289C0.538407 11.3195 0.538407 11.9526 0.928931 12.3431L7.29289 18.7071ZM7 1L7 18L9 18L9 1L7 1Z"
              fill="#020034"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
  </header>

  <div v-if="props.loaded && applicationLoaded" class="zbg-balkar pt-3">
    <div class="container">
      <div class="row align-items-start">
        <div :class="props.css">
          <div class="slot">
            <div class="slot-inner">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.slot {
  display: flex;
  margin: 0 auto;
  height: calc(100vh - 86px);
  margin-top: 20px;
  margin-bottom: 20px;
}

.zplace-items-center .slot {
  place-items: center;
}

.slot-inner {
  text-align: left;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  width: 100%;
}

.logo-outter {
  color: #0e0f11;

  /* Headings/h6 */
  font-size: 18px;
  font-family: Athletics;
  font-weight: 700;
  line-height: 24px;
}
.logo-outter img {
  height: 80px;
}
header {
  background: #fbf7eb;
}

@media (min-width: 1024px) {
  h1 {
    color: var(--Resilience-fosc, #020034);
    font-family: Athletics;
    font-size: 70px;
    font-style: normal;
    font-weight: 700;
    line-height: 90px; /* 100% */
  }
}

@media (min-width: 1024px) and (max-height: 700px) {
  .slot {
    height: auto;
  }
}
.router-link-exact-active:not(.logo), .router-link-exact-active:not(.logo):hover, .router-link-exact-active:not(.logo):focus{
  color: #fff;
  background-color: #020034;
  border-color: #020034;
}
.router-link-exact-active svg path, .router-link-exact-active:hover svg path, .router-link-exact-active:focus svg path{
  fill: #fff;
}
</style>
