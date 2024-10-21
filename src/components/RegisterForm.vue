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
