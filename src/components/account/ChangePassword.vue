<script setup lang="ts">
import { ref, watch } from 'vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { Api } from '@/service/api'
import CustomToast from '@/components/CustomToast.vue'
import { useRouter } from 'vue-router'
import PasswordMeter from 'vue-simple-password-meter'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()

const changePassword = async () => {
  passwordError.value = ''
  if (password.value === repeatPassword.value) {
    try {
      if (score.value < 3) {
        passwordError.value = t('password-is-not-safe')
        return
      }

      await Api.auth.changePassword(current.value, password.value, repeatPassword.value)
      toastVisible.value = !toastVisible.value
      setTimeout(() => {
        router.push('/account/profile')
      }, 2000)
    } catch (error: any) {
      if (error.message) {
        passwordError.value = error.message
      } else {
        passwordError.value = t('Error changing password')
      }
    }
  } else {
    passwordError.value = t('Passwords do not match')
  }

  console.log('changePassword')
}
const current = ref('')
const password = ref('')
const repeatPassword = ref('')
const toastVisible = ref(false)
const passwordError = ref('')

const score = ref(0)
const onScore = (payload: any) => {
  // console.log(payload.score); // from 0 to 4
  // console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
  score.value = payload.score
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-md-9">
        <div class="bordered-card mb-4">
          <form @submit.prevent="changePassword">
            <FormField
              :label="$t('changePassword.currentPasswordLabel')"
              css="col-12 col-md-8 mb-3"
            >
              <FormControl
                type="password"
                :placeholder="$t('changePassword.currentPasswordPlaceholder')"
                v-model="current"
                name="current"
              />
            </FormField>

            <FormField :label="$t('changePassword.newPasswordLabel')" css="col-12 col-md-8 mb-3">
              <FormControl
                type="password"
                :placeholder="$t('changePassword.newPasswordPlaceholder')"
                v-model="password"
                name="password"
              />
              <password-meter @score="onScore" :password="password" />
            </FormField>

            <FormField
              :label="$t('changePassword.repeatPasswordLabel')"
              css="col-12 col-md-8 mb-3"
              :help="passwordError"
            >
              <FormControl
                type="password"
                :placeholder="$t('changePassword.repeatPasswordPlaceholder')"
                v-model="repeatPassword"
                name="repeatPassword"
              />
            </FormField>

            <div class="col-12 col-md-8">
              <div class="actions d-flex mt-4">
                <RouterLink to="/account/profile" class="btn btn-tertiary btn-medium me-auto">
                  {{ $t('changePassword.cancelButton') }}
                </RouterLink>
                <button class="btn btn-primary btn-medium ms-auto" type="submit">
                  {{ $t('changePassword.submitButton') }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <CustomToast
      :show="toastVisible"
      type="success"
      :title="$t('changePassword.toastTitle')"
      :description="$t('changePassword.toastDescription')"
      id="updated-site-toast"
    ></CustomToast>
  </div>
</template>
