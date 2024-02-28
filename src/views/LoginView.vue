<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore } from '@/stores/auth.js'
import { checkEmpty, checkIsEmail } from '@/utils/helper'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Api } from '@/service/api'
const { t } = useI18n()

const authStore = useAuthStore()
const loading = ref(true)
const authenticated = ref(true)

const tryIfUserIsLogged = () => {
  try {
    if (authStore.isAuthenticated()) {
      Api.auth
        .get()
        .then((meResponse: any) => {
          if (meResponse && meResponse.data && meResponse.data.id) {
            useAuthStore().setUser({
              id: meResponse.data.id,
              name: meResponse.data.username,
              email: meResponse.data.email
              // jwt: response.data.jwt,
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

const form = reactive({
  login: '',
  password: ''
})

const status = reactive({
  message: '',
  messagePwd: '',
  error: false,
  errorPwd: false
})

const router = useRouter()

const removeError = (event: any) => {
  // status.error = false
  // // status.message = ''
  // // status.messagePwd = ''
  // const item = event.target.classList
  // item.remove(['border-error'])
}

const submit = async () => {
  try {
    status.error = false
    status.message = ''
    if (checkEmpty(form.login)) {
      status.error = true
      status.message = t('email-is-mandatory')
      return
    }

    if (!checkIsEmail(form.login)) {
      status.error = true
      status.message = t('email-is-not-valid')
      return
    }

    if (checkEmpty(form.password)) {
      status.errorPwd = true
      status.messagePwd = t('password-is-mandatory')
      return
    }

    const response: any = (await Api.auth.login(form.login, form.password)).data

    if (response && response.jwt) {
      useAuthStore().setUser({
        jwt: response.jwt
      })

      const meResponse: any = await Api.auth.get()

      if (meResponse && meResponse.data.id) {
        useAuthStore().setUser({
          id: meResponse.data.id,
          name: meResponse.data.username,
          email: meResponse.data.email,
          jwt: response.jwt
        })

        router.push('/dashboard')
      }
    }
  } catch (err: any) {
    console.log('err', err)
    if (err && err.message) {
      status.error = false
      status.message = ''
      status.errorPwd = true
      status.messagePwd = err.message
    }
  }
}
</script>

<template>
  <LayoutGuest :loaded="!loading && !authenticated" css="col-lg-6 offset-lg-3 place-items-center">
    <div v-if="!loading && !authenticated" class="bg-white p-4">
      <h3 class="mb-4">{{ $t('entra-al-teu-espai-balkar') }}</h3>

      <form @submit.prevent="submit">
        <FormField :help="status.message" :label="$t('email-label')" class="mb-4">
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            :placeholder="$t('email-placeholder')"
            v-model="form.login"
            name="login"
            autocomplete="username"
            maxlength="200"
          />
        </FormField>

        <FormField
          class="position-relative"
          :help="status.messagePwd"
          :label="$t('password-label')"
        >
          <div class="abs-forgot">
            <RouterLink tabindex="-1" to="/forgot">{{ $t('forgot-password') }}</RouterLink>
          </div>

          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.errorPwd"
            :placeholder="$t('password-placeholder')"
            v-model="form.password"
            type="password"
            name="password"
            autocomplete="current-password"
            maxlength="200"
          />
        </FormField>

        <button class="mt-4 w-100z btn btn-primary" type="submit" @click="submit" color="primary">
          {{ $t('login-button') }}

          <svg
            width="37"
            height="16"
            viewBox="0 0 37 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.10156 7.20868C0.549278 7.20868 0.101563 7.65639 0.101562 8.20868C0.101562 8.76096 0.549278 9.20868 1.10156 9.20868L1.10156 7.20868ZM36.2985 8.91579C36.6891 8.52527 36.6891 7.8921 36.2985 7.50158L29.9346 1.13762C29.5441 0.747091 28.9109 0.747091 28.5204 1.13762C28.1298 1.52814 28.1298 2.1613 28.5204 2.55183L34.1772 8.20868L28.5204 13.8655C28.1298 14.2561 28.1298 14.8892 28.5204 15.2798C28.9109 15.6703 29.5441 15.6703 29.9346 15.2798L36.2985 8.91579ZM1.10156 9.20868L35.5914 9.20868L35.5914 7.20868L1.10156 7.20868L1.10156 9.20868Z"
              fill="#fff"
            />
          </svg>
        </button>
      </form>
    </div>
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
