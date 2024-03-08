<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore } from '@/stores/auth.js'
import LoginForm from '@/components/LoginForm.vue'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Api } from '@/service/api'
const { t } = useI18n()

const authStore = useAuthStore()
const loading = ref(true)
const authenticated = ref(true)
const router = useRouter()

const tryIfUserIsLogged = () => {
  try {
    if (authStore.isAuthenticated()) {
      Api.auth
        .get()
        .then((meResponse: any) => {
          if (meResponse && meResponse.data && meResponse.data.id) {
            useAuthStore().setUser({
              id: meResponse.data.id,
              username: meResponse.data.username,
              email: meResponse.data.email,
              name: meResponse.data.name,
              lastname: meResponse.data.lastname
            })
            loading.value = false

            router.push('/dashboard')
          }
        })
        .catch((error: any) => {
          loading.value = false
          authenticated.value = false
          authStore.logout()
        })
    } else {
      loading.value = false
      authenticated.value = false
    }
  } catch (error) {
    loading.value = false
    authenticated.value = false
    authStore.logout()
  }
}

tryIfUserIsLogged()

</script>

<template>
  <LayoutGuest :loaded="!loading && !authenticated" css="col-lg-6 offset-lg-3 place-items-center">
    <LoginForm></LoginForm>
  </LayoutGuest>
</template>
<style scoped>
form {
  font-size: 16px;
}
.abs-forgot {
  position: absolute;
  top: 0;
  right: 0;
}
.book-now {
  color: var(--gray-02100, #0a0a0a);
  text-align: center;
  /* Body Text/SF Pro/14/Medium */
  font-family: Athletics;
  font-size: 16px;
  font-style: normal;
  line-height: 20px; /* 142.857% */

  border-top: 1px solid #c2c2c2;
  margin-top: 120px !important;
  padding-top: 24px;
}
.book-now a {
}
</style>
