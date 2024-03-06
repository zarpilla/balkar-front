<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import HeaderBar from '@/components/HeaderBar.vue'
import FooterBar from '@/components/FooterBar.vue'
import AuthenticatedUser from '@/components/AuthenticatedUser.vue'
import AuthenticatedMenu from '@/components/AuthenticatedMenu.vue'
import { Api } from '@/service/api'
import { type UserLoginData, type UserData } from '@/types/types'
import { useApplicationStore } from '@/stores/application.js'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const applicationStore = useApplicationStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  css: {
    type: String,
    required: false,
    default: 'bg-balkar'
  }
})

try {
  console.log('hello')
  Api.auth
    .get()
    .then(async (me: UserData) => {
      if (me && me.data && me.data.id) {
        authStore.setUser({
          id: me.data.id,
          username: me.data.username,
          email: me.data.email,
          name: me.data.name,
          lastname: me.data.lastname
        })

        const myAvatar = await Api.avatars.mine()
        if (myAvatar.data && myAvatar.data.data) {          
          authStore.pictureUrl = myAvatar.data.data.avatar.url
        }
        
        if (route.name === 'login') {
          router.push('/dashboard')
        }
      }
    })
    .catch((error: any) => {
      console.error('catch 1', error)
      authStore.logout()
      router.push('/login')
    })
} catch (error) {
  console.error('error', error)
  authStore.logout()
  router.push('/login')
}

const applicationLoaded = ref(false)

const apiBase = import.meta.env.VITE_API_BASE

applicationStore.load().then(async () => {
  applicationLoaded.value = true
})

// const load = async () => {
//   account.value = (await Api.accounts.me()).data
// }

// onMounted(async () => {
//   await load()
// })

if (localStorage.getItem('locale')) {
  const storedLocale = localStorage.getItem('locale')
  if (storedLocale) {
    locale.value = storedLocale
  }
}
</script>

<template>
  <header v-if="applicationLoaded">
    <div class="container">
      <div class="logo-outter">
        <div class="row w-100">
          <div class="col-6 col-md-2 order-0 order-md-0">
            <RouterLink to="/">
              <img src="@/assets/logo.svg" alt="Balkar" />
            </RouterLink>
          </div>

          <div class="col-6 col-md-2 order-1 order-md-2 ms-auto">
            <div class="auth-wrapper mt-4 d-flex ms-auto">
              <AuthenticatedUser></AuthenticatedUser>

              <LanguageSwitcher class="ms-4"></LanguageSwitcher>
            </div>
          </div>
        </div>
      </div>

      <h1 class="mt-3 pb-3 mb-0">{{ $t('benvinguda-al-teu-balkar') }}</h1>

      <AuthenticatedMenu class="pb-4"></AuthenticatedMenu>
    </div>
  </header>

  <div v-if="applicationLoaded" class="zbg-balkar zpt-5" :class="props.css">
    <div>
      <div class="slot">
        <div class="slot-inner">
          <slot />
        </div>
      </div>
    </div>
  </div>
  <FooterBar></FooterBar>
</template>
<style scoped>
.zslot {
  display: flex;
  margin: 0 auto;
  height: calc(100vh - 140px);
}

.place-items-center .slot {
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
.auth-wrapper {
  border-radius: 20px;
  border: 1px solid var(--gray-0220, #f7f7f7);
  background: var(--gray-0210, #fff);
  padding: 4px;
  height: 33px;
  width: fit-content;
}
.w-100 {
  width: 100%;
}
@media (min-width: 1024px) {
  .logo-outter {
    padding: 0 3rem;
  }
}
</style>
