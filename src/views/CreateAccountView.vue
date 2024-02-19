<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import service from '@/service/index'
import icon from '@/assets/icons/svgs/mail.svg'
import { checkEmpty, checkIsEmail, checkPasswordMatch } from '@/utils/helper'
import { useAuthStore } from '@/stores/auth.js'
import { Api } from '@/service/api'

const authStore = useAuthStore()
authStore.logout()

const form = reactive({
  name: '',
  email: '',
  password: '',
  repeatPassword: ''
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
    if (checkEmpty(form.name) || checkEmpty(form.email) || checkEmpty(form.password) || checkEmpty(form.repeatPassword)) {
      return
    }

    if (!checkIsEmail(form.email)) {
      status.error = true
      status.message = 'Email not valid'
      return
    }

    if (!checkPasswordMatch(form.password, form.repeatPassword)) {
      status.error = true
      status.message = 'Passwords do not match'
      return
    }

    await Api.auth.register(form.name, form.email, form.password)

    status.info = 'Account created successfully. Please check your email for verification.'

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err: any) {
    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data.error &&
      err.response.data.message
    ) {
      status.error = true
      status.message = err.response.data.message
    }
  }
}
</script>

<template>
  <LayoutGuest :loaded="true" css="col-lg-8 offset-lg-2">
    <div>
      <h6 class="mb-2">Create Account</h6>

      <form @submit.prevent="submit">
        <FormField :help="status.message" :info="status.info">
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            placeholder="Name"
            v-model="form.name"
            name="name"
            autocomplete="name"
            maxlength="200"
          />
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            placeholder="Email"
            v-model="form.email"
            name="email"
            autocomplete="email"
            maxlength="200"
          />
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            placeholder="Password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            maxlength="200"
          />
          <FormControl
            @click="removeError"
            :placeholderEffect="false"
            :validationError="status.error"
            placeholder="Repeat Password"
            v-model="form.repeatPassword"
            name="repeatPassword"
            type="password"
            autocomplete="new-password"
            maxlength="200"
          />
        </FormField>

        <BaseButton
          class="mt-4 w-100"
          type="submit"
          @click="submit"
          color="primary"
          label="Create Account"
        />
      </form>

      <div class="text-center mt-3">
        Already have an account? <RouterLink to="/login">Log in</RouterLink>
      </div>
    </div>
  </LayoutGuest>
</template>