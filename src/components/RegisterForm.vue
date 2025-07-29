<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { checkEmpty, checkIsEmail } from '@/utils/helper'
import { useI18n } from 'vue-i18n'
import { Api } from '@/service/api'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import CustomToast from '@/components/CustomToast.vue'
import PasswordMeter from 'vue-simple-password-meter'


const props = defineProps({
  buttonText: {
    type: String,
    required: false,
    default: 'register-button'
  },
  enroll: {
    type: String,
    required: false
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  forceEmail: {
    type: String,
    required: false,
    default: ''
  },
  forceName: {
    type: String,
    required: false,
    default: ''
  },
  forceLastname: {
    type: String,
    required: false,
    default: ''
  },
  checkoutSession: {
    type: String,
    required: false
  }
})

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'email-valid', msg: any): { valid: boolean, email: string, name: string, lastname: string }
}>()

const authStore = useAuthStore()
const loading = ref(false)
const registered = ref(false)
const toastVisible = ref(false)
const toastErrorVisible = ref(false)
const toastErrorMessage = ref('')
const form = reactive({
  name: '',
  lastname: '',
  email: '',
  password: '',
  passwordRepeat: '',
  checkoutSession: props.checkoutSession
})

if (props.forceEmail) {
  form.email = props.forceEmail
}
if (props.forceName) {
  form.name = props.forceName
}
if (props.forceLastname) {
  form.lastname = props.forceLastname
}

const status = reactive({
  messageName: '',
  messageLast: '',
  messageEmail: '',
  messagePwd: '',
  messagePwdRepeat: '',
  errorName: false,
  errorLastName: false,
  errorEmail: false,
  errorPwd: false,
  errorPwdRepeat: false,
  errorOther: false
})

const router = useRouter()

const removeError = (event: any) => {
  // status.error = false
  // status.message = ''
  // status.messagePwd = ''
  // const item = event.target.classList
  // item.remove(['border-error'])
}

const submit = async () => {
  try {
    status.errorName = false
    status.errorLastName = false
    status.errorEmail = false
    status.errorPwd = false
    status.errorPwdRepeat = false
    status.errorOther = false
    status.messageName = ''
    status.messageLast = ''
    status.messageEmail = ''
    status.messagePwd = ''
    status.messagePwdRepeat = ''    

    if (checkEmpty(form.name)) {
      status.errorName = true
      status.messageName = t('name-is-mandatory')
      return
    }

    if (checkEmpty(form.lastname)) {
      status.errorLastName = true
      status.messageLast = t('lastname-is-mandatory')
      return
    }

    if (checkEmpty(form.email)) {
      status.errorEmail = true
      status.messageEmail = t('email-is-mandatory')
      return
    }

    if (!checkIsEmail(form.email)) {
      status.errorEmail = true
      status.messageEmail = t('email-is-not-valid')
      return
    }

    if (checkEmpty(form.password)) {
      status.errorPwd = true
      status.messagePwd = t('password-is-mandatory')
      return
    }

    if (score.value < 3) {
      status.errorPwd = true
      status.messagePwd = t('password-is-not-safe')
      return
    }

    if (form.password !== form.passwordRepeat) {
      status.errorPwdRepeat = true
      status.messagePwdRepeat = t('passwords-do-not-match')
      return
    }

    const response: any = (await Api.auth.register(form.email, form.password, form.name, form.lastname)).data

    if (response && response.user) {
      toastVisible.value = !toastVisible.value

      await Api.preEnrollements.create({
        email: form.email,
        uid: props.enroll,
        name: form.name,
        lastname: form.lastname
      })

      setTimeout(() => {
        registered.value = true
        // router.push({ name: 'login' })
      }, 1000)
    } else if (response && response.error) {
      status.errorOther = true
      status.messageEmail = response.error
      toastErrorVisible.value = !toastErrorVisible.value
    }
  } catch (error: any) {
    console.log('error', error)
    status.errorEmail = true
    if (error && error.message) {
      status.errorOther = error.message
      toastErrorMessage.value = error.message
    } else {
      status.messageEmail = t('email-already-exists')
      toastErrorMessage.value = t('email-already-exists')
    }
    toastErrorVisible.value = !toastErrorVisible.value
  }
}
const score = ref(0)
const onScore = (payload: any) => {
  // console.log(payload.score); // from 0 to 4
  // console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
  score.value = payload.score
}

watch(
  () => [form.email, form.name, form.lastname],
  () => {
    emit('email-valid', { valid: checkIsEmail(form.email), email: form.email, name: form.name, lastname: form.lastname })
  }
)

watch(
  () => props.forceEmail,
  () => {
    if (props.forceEmail) {
      console.log('Force email:', props.forceEmail)
      form.email = props.forceEmail
    }    
  }
)

watch(
  () => props.forceName,
  () => {
    if (props.forceName) {
      form.name = props.forceName
    }    
  }
)

watch(
  () => props.forceLastname,
  () => {
    if (props.forceLastname) {
      form.lastname = props.forceLastname
    }    
  }
)
</script>

<template>
  <h3 class="mb-4">{{ $t('crea-el-teu-espai-balkar') }}</h3>

  <form @submit.prevent="submit" v-if="!registered">
    <!-- <FormField :help="status.messageName" :label="$t('name-label')" class="mb-4">
    <FormControl
      @click="removeError"
      :placeholderEffect="false"
      :validationError="status.errorName"
      :placeholder="$t('name-placeholder')"
      v-model="form.name"
      name="name"
      maxlength="200"
    />
  </FormField> -->

    <FormField :help="status.messageName" :label="$t('name')" css="mb-4">
      <FormControl
        type="text"
        :placeholder="$t('name')"
        v-model="form.name"
        :placeholderEffect="false"
        :validationError="status.errorName"
        name="name"
        :readonly="props.forceName !== ''"
      />
    </FormField>
    <FormField :label="$t('lastname')" css="mb-4" :help="status.messageLast">
      <FormControl
        type="text"
        :placeholder="$t('lastname')"
        v-model="form.lastname"
        :placeholderEffect="false"
        :validationError="status.errorLastName"
        name="lastname"
        :readonly="props.forceLastname !== ''"
      />
    </FormField>

    <FormField :help="status.messageEmail" :label="$t('email-label')" class="mb-4">
      <FormControl
        @click="removeError"
        :placeholderEffect="false"
        :validationError="status.errorEmail"
        :placeholder="$t('email-placeholder')"
        v-model="form.email"
        name="email"
        autocomplete="username"
        maxlength="200"
        :readonly="props.forceEmail !== ''"
      />
    </FormField>

    <FormField :help="status.messagePwd" :label="$t('password-label')" class="mb-4" v-if="!disabled">
      <FormControl
        @click="removeError"
        :placeholderEffect="false"
        :validationError="status.errorPwd"
        :placeholder="$t('password-placeholder')"
        v-model="form.password"
        type="password"
        name="password"
        autocomplete="new-password"
        maxlength="200"
      />
      <password-meter @score="onScore" :password="form.password" />
    </FormField>

    <FormField :help="status.messagePwdRepeat" :label="$t('repeat-password-label')" class="mb-4" v-if="!disabled">
      <FormControl
        @click="removeError"
        :placeholderEffect="false"
        :validationError="status.errorPwdRepeat"
        :placeholder="$t('repeat-password-placeholder')"
        v-model="form.passwordRepeat"
        type="password"
        name="passwordRepeat"
        autocomplete="new-password"
        maxlength="200"
      />
    </FormField>

    <button class="mt-4 w-100z btn btn-primary" type="submit" color="primary" :disabled="disabled" v-if="!disabled">
      {{ $t(buttonText) }}

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

    <div class="error-message mt-3 text-error" v-if="status.errorOther">
      {{ status.errorOther }}
    </div>
  </form>
  <div v-else class="alert alert-success">
    <p>{{ $t('registered-successfully') }}</p>
    <p>{{ $t('please-go-to-your-inbox-to-confirm-your-email') }}</p>
  </div>
  <Teleport to="body">
    <CustomToast
      :show="toastVisible"
      type="success"
      :title="$t('registered-successfully')"
      :description="$t('please-go-to-your-inbox-to-confirm-your-email')"
      id="account-contact-ok-toast"
    ></CustomToast>
    <CustomToast
      :show="toastErrorVisible"
      type="error"
      :title="$t('registered-error')"
      :description="toastErrorMessage"
      id="account-contact-ko-toast"
    ></CustomToast>
  </Teleport>
</template>
<style scoped>
.text-error {
  color: #f57356;
  font-size: 16px;
  margin-top: 10px;
}
</style>
