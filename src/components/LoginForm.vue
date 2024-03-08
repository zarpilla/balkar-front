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
          lastname: meResponse.data.lastname
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
    console.log('err', err)
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
    console.log('err', err)
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

    <FormField class="position-relative" help="" :label="$t('password-label')">
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
