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

const props = defineProps({
  buttonText: {
    type: String,
    required: false,
    default: 'login-button'
  },
  enroll: {
    type: String,
    required: false
  }
})

const authStore = useAuthStore()
const loading = ref(true)
const authenticated = ref(true)
const accountNotConfirmed = ref(false)
const accountNotConfirmedCountDown = ref(0)


const queryStringKeyIspresent = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.has(key)
}

const confirmed = queryStringKeyIspresent('confirmed')

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
          username: meResponse.data.username,
          email: meResponse.data.email,
          jwt: meResponse.jwt,
          name: meResponse.data.name,
          lastname: meResponse.data.lastname,
          createdAt: meResponse.data.createdAt,
          updatedAt: meResponse.data.updatedAt,
        })

        if (props.enroll) {

          await Api.enrollments.enroll({ uid: props.enroll })

          router.push(`/space/${props.enroll}`)
          return
        }

        router.push('/dashboard')
      }
    }
  } catch (err: any) {
    if (err && err.message) {
      status.error = false
      status.message = ''
      status.errorPwd = true
      status.messagePwd = err.message
      if (err.message === 'Your account email is not confirmed') {
        accountNotConfirmed.value = true
      }
    }
  }
}

const interval = ref<any>(null)

const resend = async () => {
  try {
    if (!form.login) {
      status.error = true
      status.message = t('email-is-mandatory')
      return
    }
    await Api.auth.emailConfirmation(form.login)
    accountNotConfirmedCountDown.value = 60

    interval.value = setInterval(() => {
      accountNotConfirmedCountDown.value = accountNotConfirmedCountDown.value - 1
      if (accountNotConfirmedCountDown.value === 0) {
        clearInterval(interval.value)
      }
    }, 1000)

  } catch (err: any) {
    console.log('err!', err)
  }
}
</script>

<template>
  <h3 class="mb-4">{{ $t('entra-al-teu-espai-balkar') }}</h3>

  <div v-if="confirmed" class="alert alert-success">
    {{ $t('email-confirmed') }}
  </div>

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

    <FormField class="position-relative" :help="status.messagePwd" :label="$t('password-label')">
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

    <div v-if="accountNotConfirmed" class="alert alert-warning mt-4">
      <div>
      {{ $t('account-not-confirmed') }}
    </div>
      <button class="mt-4 w-100z btn btn-tertiary" type="submit" @click="resend" color="primary" :disabled="accountNotConfirmedCountDown > 0">
        {{ $t('resend') }} {{ accountNotConfirmedCountDown > 0 ? '(' + accountNotConfirmedCountDown + ')' : '' }}
      </button>
    </div>

    <button class="mt-4 w-100z btn btn-primary" type="submit" @click="submit" color="primary" v-if="!accountNotConfirmed">
      {{ $t(props.buttonText) }}

      <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_64_2203"
                  style="mask-type: alpha"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="25"
                >
                  <rect y="0.312622" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_64_2203)">
                  <path
                    d="M12 21.3126C10.75 21.3126 9.57917 21.0751 8.4875 20.6001C7.39583 20.1251 6.44583 19.4835 5.6375 18.6751C4.82917 17.8668 4.1875 16.9168 3.7125 15.8251C3.2375 14.7335 3 13.5626 3 12.3126C3 11.0626 3.2375 9.89179 3.7125 8.80012C4.1875 7.70846 4.82917 6.75846 5.6375 5.95012C6.44583 5.14179 7.39583 4.50012 8.4875 4.02512C9.57917 3.55012 10.75 3.31262 12 3.31262V5.31262C10.05 5.31262 8.39583 5.99179 7.0375 7.35012C5.67917 8.70846 5 10.3626 5 12.3126C5 14.2626 5.67917 15.9168 7.0375 17.2751C8.39583 18.6335 10.05 19.3126 12 19.3126V21.3126ZM16 17.3126L14.6 15.8876L17.175 13.3126H9V11.3126H17.175L14.6 8.71262L16 7.31262L21 12.3126L16 17.3126Z"
                    fill="black"
                  />
                </g>
              </svg>
    </button>
  </form>
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
  font-family: Inter;
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
