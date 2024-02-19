<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { checkEmpty, checkIsEmail } from '@/utils/helper'
import { useAuthStore } from '@/stores/auth.js'
import { Api } from '@/service/api'
// @ts-ignore
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const authStore = useAuthStore()
authStore.logout()

const form = reactive({
  login: ''
})

const status = reactive({
  message: '',
  info: '',
  error: false
})

const router = useRouter()

const removeError = (event: any) => {
  status.message = ''
  const item = event.target.classList
  item.remove(['border-error'])
}

const submit = async () => {
  try {
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

    await Api.auth.forgot(form.login)

    status.info = t('An email to reset your password have been sent.')

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err: any) {
    if (
      err &&
      err.message
    ) {
      status.error = true
      status.message = err.message
    }
  }
}
</script>

<template>
  <LayoutGuest :loaded="true" css="col-lg-4 offset-lg-4 place-items-center">
    <div>

      <h3 class="mb-5">{{ $t('recupera-la-teva-clau-de-pas')}}</h3>

      <form @submit.prevent="submit">
        <FormField :help="status.message" :info="status.info">
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            :placeholder="$t('email-label')"
            v-model="form.login"
            name="login"
            autocomplete="username"
            maxlength="200"
          />
        </FormField>

        <button
          class="mt-4 w-100 btn btn-primary"
          type="submit"
          @click="submit"
          color="primary"
          label="Continue"
        >
          {{ $t('continue') }}
        </button>
      </form>

      <div class="text-center mt-3">
        <RouterLink to="/login">{{ $t('back-to-log-in')}}</RouterLink>
      </div>
    </div>
  </LayoutGuest>
</template>
