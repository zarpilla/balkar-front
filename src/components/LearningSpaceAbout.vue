<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, watch, computed, onMounted } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import CustomToast from '@/components/CustomToast.vue'

import { useAuthStore } from '@/stores/auth'

import { useI18n } from 'vue-i18n'
import SpaceContent from '@/components/SpaceContent.vue'
import LearningSpaceHeader from '@/components/LearningSpaceHeader.vue'
import LearningSpaceBanner from '@/components/LearningSpaceBanner.vue'
import LearningSpaceEnrollment from '@/components/LearningSpaceEnrollment.vue'
import LearningSpaceModuleMenu from '@/components/LearningSpaceModuleMenu.vue'

const authStore = useAuthStore()

const props = defineProps<{
  uid: string
}>()

const emit = defineEmits<{
  (e: 'loaded', space: any): { space: any }
}>()

const locale = useI18n().locale
const router = useRouter()
import type { Ref } from 'vue'

const moduleId: Ref<string | null> = ref(
  (router.currentRoute.value.params.moduleId as string) || null
)
const unitId: Ref<string | null> = ref((router.currentRoute.value.params.unitId as string) || null)
const lessonId: Ref<string | null> = ref(
  (router.currentRoute.value.params.lessonId as string) || null
)

const apiBase = import.meta.env.VITE_API_BASE

const loaded = ref(false)
const space = ref<any>(null)
const load = async () => {
  const response = await Api.learningSpaces.get(props.uid, locale.value)
  if (response.data) {
    space.value = response.data

    if (!space.value.enrolled && authStore.isAuthenticated()) {
      canPay.value = true
    }

  }
  loaded.value = true
  emit('loaded', space.value)
}

load()

const base = import.meta.env.VITE_API_BASE

const toastVisible = ref(false)

// Quiz completion tracking
const quizCompletions = ref<Record<string, { allCorrect: boolean; score: number }>>({})

const paymentIsSuccessfully = ref(false)
const paymentIsChecking = ref(false)
const paymentHasResponse = ref(false)
const checkoutSession = ref('')

onMounted(async () => {
  const queryParams = new URLSearchParams(window.location.search)
  if (queryParams.has('success')) {
    try {
      paymentIsChecking.value = true
      const paymentIntentId = queryParams.get('success')
      if (paymentIntentId && paymentIntentId !== 'false') {
        const response = await Api.payment.check(paymentIntentId).then((r) => r.data)
        console.log(response)
        paymentIsSuccessfully.value = response.ok
        paymentHasResponse.value = true
        paymentIsChecking.value = false
        canPayEmail.value = response.email
        canPayName.value = response.name
        canPayLastname.value = response.lastname
        if (paymentIsSuccessfully.value) {
          checkoutSession.value = paymentIntentId
        }
      } else {
        paymentIsSuccessfully.value = false
        paymentHasResponse.value = true
        paymentIsChecking.value = false
      }
    } catch (e) {
      console.log('3')
      paymentHasResponse.value = true
      paymentIsSuccessfully.value = false
      paymentIsChecking.value = false
      console.error(e)
    }
  }
})

const enroll = async () => {
  await Api.enrollments.enroll({ uid: props.uid })
  toastVisible.value = true
  space.value.enrolled = true
  router.push(`/space/${props.uid}`)
}

const pay = async () => {
  if (authStore.isAuthenticated()) {
    canPayEmail.value = authStore.userEmail
  }
  const response = await Api.payment
    .createCheckoutSession(props.uid, {
      email: canPayEmail.value,
      name: canPayName.value,
      lastname: canPayLastname.value,
      locale: locale.value
    })
    .then((r) => r.data)
  location.href = response.url
}

const canPay = ref(false)
const canPayEmail = ref('')
const canPayName = ref('')
const canPayLastname = ref('')

const emailIsValid = (msg: any) => {
  canPay.value = msg.valid
  canPayEmail.value = msg.email
  canPayName.value = msg.name
  canPayLastname.value = msg.lastname
}
const authenticated = computed(() => {
  return authStore.isAuthenticated()
})

const spaceNeedsPayment = computed(() => {
  return (
    space.value &&
    space.value.product !== null &&
    !space.value.enrolled &&
    !paymentIsSuccessfully.value
  )
})
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <LearningSpaceBanner
      :space="space"
      :base="base"
      :authenticated="!!authenticated"
      @enroll="enroll"
      template="big"
      :space-needs-payment="spaceNeedsPayment"
    />

    <LearningSpaceEnrollment
      :space="space"
      :authenticated="!!authenticated"
      :uid="uid"
      :payment-is-checking="paymentIsChecking"
      :payment-has-response="paymentHasResponse"
      :payment-is-successfully="paymentIsSuccessfully"
      :space-needs-payment="spaceNeedsPayment"
      :can-pay="canPay"
      :can-pay-email="canPayEmail"
      :can-pay-name="canPayName"
      :can-pay-lastname="canPayLastname"
      :checkout-session="checkoutSession"
      @enroll="enroll"
      @pay="pay"
      @email-valid="emailIsValid"
    />

  </div>
  <Teleport to="body">
    <CustomToast
      :show="toastVisible"
      type="success"
      title="Enrolled"
      description="Enrolled to space successfully!"
      id="account-contact-ok-toast"
    ></CustomToast>
  </Teleport>
</template>

<style scoped>
.module-item-block {
  border-bottom: 1px solid #898989;
}

.quick-access {
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--Nabiu, #000000);
}
.quick-access-name {
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--Nabiu, #000000);
}
.arrow-down {
  vertical-align: -4px;
  margin-left: 0.5rem;
}
.enrolled img {
  max-width: 100%;
}
.module-type-monitoring {
  background: var(--Canya, #f5d634);
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.module-selected .module-type-monitoring {
  margin-top: 0rem;
}
.module-upload {
  margin-top: 5rem;
  background-color: #bbdff7;

  color: var(--Nabiu, #000000);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: normal;
  line-height: 28px; /* 140% */

  padding: 2rem 4rem;
}
.completed-check {
  margin-top: 8px;
}
.completed-pct {
  font-size: 14px;
  line-height: 20px;
  margin-top: 6px;
  border: 2px solid #000000;
  border-radius: 16px;
  line-height: 30px;
  height: 30px;
  padding: 0 1rem;
  display: inline-block;
  font-weight: 700;
}
.completed-pct-space {
  line-height: 28px;
  margin-top: 0px;
  vertical-align: 5px;
}
.quick-access-button {
  line-height: 20px;
}
.uploaded-file {
  border-bottom: 1px solid #eee;
}
.uploaded-file:last-child {
  border-bottom: none !important;
}
.remove-file {
  cursor: pointer;
}
.module-type-forum {
  background: var(--Canya, #a5dda3);
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.module-type-forum .description {
  font-size: 14px;
  line-height: 20px;
  margin-top: 6px;
  color: var(--Nabiu, #000000);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  line-height: 28px; /* 140% */
}
.module-progress-icon {
  vertical-align: -7px;
}
@media (min-width: 1024px) {
  .module-menu {
    position: sticky;
    top: 0;
    height: calc(100vh - 180px);
    overflow-y: auto;
    padding-right: 15px;
  }
}

.module-header h2 {
  color: var(--Green, #44b08e);

  /* Sidebar - Module */
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 25px; /* 110% */
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin-bottom: 0;
}
.mt-module-item {
  margin-top: 3px;
}
.lesson-list-item {
  border-bottom: 1px solid var(--Dark-grey, #797979);
  padding-top: 20px;
  padding-bottom: 20px;

  color: var(--Black, #000);

  /* Subtitle H4 */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 26px */
  letter-spacing: 0.2px;
}
.bookmark {
  color: var(--Dark-grey, #797979);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
  margin-top: 20px;
}
.bookmark svg {
  margin-top: -2px;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-info {
  border-radius: 10px;
  background: var(--Blue-Grey, #cfe0fc);
  border: 0;

  color: var(--Black, #000);

  /* Text */
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 25.5px */
}

.fw-bold {
  font-weight: bold !important;
}
</style>
