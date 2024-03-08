<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore } from '@/stores/auth.js'
import { Api } from '@/service/api'
import PasswordMeter from 'vue-simple-password-meter';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const form = reactive({
  password: '',
  repassword: ''
})

const status = reactive({
  message: '',
  error: false
})

const router = useRouter()
const route = useRoute()

const removeError = (event: any) => {
  status.message = ''
  const item = event.target.classList
  item.remove(['border-error'])
}


const { email, code } = route.query

if (typeof code === 'undefined' || !code) {
  status.error = true
  status.message = t('Invalid request, missing mandatory params')
}

const submit = async () => {
  try {
    if (
      typeof form.password === 'undefined' ||
      !form.password ||
      typeof form.repassword === 'undefined' ||
      !form.repassword
    ) {
      return
    }

    if (form.password !== form.repassword) {
      status.error = true
      status.message = t("Password and repeat password doesn't mismatch")
      return
    }

    const { email, code } = route.query

    if (typeof code === 'undefined' || !code) {
      status.error = true
      status.message = t('Invalid request, missing mandatory params')
      return
    }

    if (score.value < 3) {
      status.message = t('password-is-not-safe')
        return
      }

    // useAuthStore().setUser({
    //   jwt: token
    // })

    await Api.auth.resetPassword(code as string, form.password, form.password)

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err: any) {
    //showToast()
    if (
      err &&
      err.message
    ) {
      status.message = t(err.message)
      status.error = true
    }
  }
}
const score = ref(0);
const onScore = (payload: any) => {
      // console.log(payload.score); // from 0 to 4
      // console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
      score.value = payload.score;
    };
</script>

<template>
  <LayoutGuest :loaded="true" css="col-lg-4 offset-lg-4 place-items-center">
    <div class="bg-white p-4">
      <h3 class="mb-5">{{ $t('reset-password') }}</h3>

      <form @submit.prevent="submit">
        
        <FormField :label="$t('new-password-label')">
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            :placeholder="$t('new-password-placeholder')"
            v-model="form.password"
            type="password"
            name="password"
            maxlength="200"
          />
          <password-meter @score="onScore" :password="form.password" />
        </FormField>

        <FormField class="mt-4" :help="status.message" :label="$t('repeat-new-password-label')">
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            :placeholder="$t('repeat-new-password-placeholder')"
            v-model="form.repassword"
            type="password"
            name="repassword"
            maxlength="200"
          />
        </FormField>
        
        <BaseButton
          class="mt-4 w-100 btn btn-primary"
          type="submit"
          @click="submit"
          color="primary"
          :label="$t('reset-password-button')"
        />
      </form>

      <div class="text-center mt-3">
        <RouterLink to="/login">{{ $t('back-to-log-in') }}</RouterLink>
      </div>
    </div>
  </LayoutGuest>
</template>
