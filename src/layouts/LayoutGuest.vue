<script setup lang="ts">
import { ref } from 'vue'
import { useApplicationStore } from '@/stores/application.js'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import AuthenticatedUser from '@/components/AuthenticatedUser.vue'

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

applicationStore.load(locale.value).then(async () => {
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

          <div class="col-6 col-md-2">
            <RouterLink to="/" class="logo">
              <img src="@/assets/logo-color.svg" alt="" />
            </RouterLink>
          </div>

          <div class="col-6 col-md-4 ms-auto">
            <div class="auth-wrapper mt-4 d-flex ms-auto">
              <AuthenticatedUser></AuthenticatedUser>

              <!-- <LanguageSwitcher class="ms-4"></LanguageSwitcher> -->
            </div>
          </div>
          
        </div>  

      </div>
      <h1 class="mt-3 pb-3">{{ $t('benvinguda-al-teu-balkar') }}</h1>

      <div class="d-flex flex-wrap">
        <RouterLink to="/login" class="btn btn-secondary me-5 mb-4 mb-md-0">
          {{ $t('accedeix-al-teu-perfil') }}
        </RouterLink>

        <RouterLink to="/register" class="btn btn-secondary mb-4 mb-md-0">
          {{ $t('crea-nou-perfil') }}
        </RouterLink>
      </div>
    </div>
  </header>

  <div v-if="props.loaded && applicationLoaded" class="zbg-balkar pt-3">
    <div class="container">
      <div class="row align-items-start zcontent">
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
  color: #000000;

  /* Headings/h6 */
  font-size: 18px;
  font-family: Inter;
  font-weight: 700;
  line-height: 24px;
}
.logo-outter img {
  height: 80px;
}
header {
  /* background: #fbf7eb; */
}



@media (min-width: 1024px) and (max-height: 700px) {
  .slot {
    height: auto;
  }
}
.router-link-exact-active:not(.logo), .router-link-exact-active:not(.logo):hover, .router-link-exact-active:not(.logo):focus{
  color: #fff;
  background-color: #000000;
  border-color: #000000;
}
.router-link-exact-active svg path, .router-link-exact-active:hover svg path, .router-link-exact-active:focus svg path{
  fill: #fff;
}
</style>
