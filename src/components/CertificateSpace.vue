<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import LearningSpaceHeader from '@/components/LearningSpaceHeader.vue'
import LearningSpaceBanner from '@/components/LearningSpaceBanner.vue'
import SpaceContent from '@/components/SpaceContent.vue'
import { getApiBase } from '@/utils/config'

const authStore = useAuthStore()

const props = defineProps<{
  uid: string
}>()

const emit = defineEmits<{
  (e: 'loaded', space: any): { space: any }
}>()

const locale = useI18n().locale

const loaded = ref(false)
const space = ref<any>(null)
const load = async () => {
  const response = await Api.learningSpaces.get(props.uid, locale.value)
  if (response.data) {
    space.value = response.data
  }
  loaded.value = true
  emit('loaded', space.value)
}

load()

const base = getApiBase()

const authenticated = computed(() => {
  return authStore.isAuthenticated()
})

const issueCertificate = async () => {
  if (!space.value) return
  try {
    const response = await Api.certificates.issue(props.uid)
    if (response.data && response.data.pdfUrl) {
      window.open(base + response.data.pdfUrl, '_blank')
    }
  } catch (error) {
    console.error('Error issuing certificate:', error)
    alert('An error occurred while issuing the certificate. Please try again later.')
  }
}

const freeOrPaid = computed(() => {
  if (!space.value) return false
  if (space.value.certificatePayment !== null) {
    return space.value.certificatePayment.paid
  }
  return false
})

const needsPayment = computed(() => {
  if (!space.value) return false
  if (space.value.certificateProduct !== null) {
    return true
  }
  return false
})

const pay = async () => {
  const response = await Api.payment
    .createCheckoutSessionForCertificate(props.uid, {
      email: authStore.userEmail,
      name: authStore.userName,
      lastname: authStore.lastname,
      locale: locale.value
    })
    .then((r) => r.data)
  location.href = response.url
}

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
        const response = await Api.payment.checkForCertificate(paymentIntentId).then((r) => r.data)
        console.log(response)
        paymentIsSuccessfully.value = response.ok
        paymentHasResponse.value = true
        paymentIsChecking.value = false

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
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <LearningSpaceBanner
      :space="space"
      :base="base"
      :authenticated="!!authenticated"
      template="small"
    />

    <LearningSpaceHeader
      :space="space"
      :uid="uid"
      :authenticated="!!authenticated"
      selected="certificate"
    />

    <div class="enrolled" v-if="space.contentNotCompleted === 0">
      <div class="container bg-white mt-5">
        <div class="row">
          
          <div class="col-12 col-lg-8 offset-lg-2" >
            <div v-if="space.certificateLesson">
              <h1 class="mb-5">{{ space.certificateLesson.title }}</h1>
              <SpaceContent
                :content="space.certificateLesson.content"
                title-as="h2"
                :is-completed="false"
                :space-title="space.name"
              />
            </div>

            <!-- <div class="zmodule-type-forum mb-5" v-if="space.contentNotCompleted === 0">
              {{ $t('certificate-explanation-completed') }}
            </div>
            <div class="zmodule-type-forum mb-5" v-else>
              {{ $t('certificate-explanation-not-completed') }}
            </div> -->

            <div
              class="text-center mt-4 mb-5"
              v-if="
                space.contentNotCompleted === 0 &&
                needsPayment &&
                !freeOrPaid &&
                !paymentIsSuccessfully
              "
            >
              <a @click="pay" class="btn btn-primary quick-access-button">{{
                $t('pay-download-certificate')
              }}</a>
            </div>

            <div
              class="text-center mt-4 mb-5"
              v-if="space.contentNotCompleted === 0 && (freeOrPaid || paymentIsSuccessfully)"
            >
              <a @click="issueCertificate" class="btn btn-primary quick-access-button">{{
                $t('download-certificate')
              }}</a>
            </div>
          </div>          
        </div>
      </div>
    </div>

        <div class="enrolled" v-else>
      <div class="container bg-white mt-5">
        <div class="row">
          <div class="col-12 col-lg-8 offset-lg-2">
            <h2 class="mb-4">{{ $t('certificate') }}</h2>

            
            <div class="zmodule-type-forum mb-5" >
              {{ $t('certificate-explanation-not-completed') }}
            </div>
            
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
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

.module-bookmarks {
  margin-bottom: 2rem;
}

.module-title {
  color: var(--Green, #44b08e);

  /* Sidebar - Module */
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 16.5px */
  letter-spacing: 0.45px;
  text-transform: uppercase;
}

.bookmark-item {
  padding: 0.75rem 1.5rem;
  border: 0px solid #e9ecef;
  border-radius: 10px;
  background: var(--Blue-Grey, #cfe0fc);
  transition: background-color 0.2s ease;

  &.completed {
    background-color: #d4edda;
  }
}

.zbookmark-item:hover {
  background-color: #e9ecef;
}

.bookmark-link {
  color: #000;
  text-decoration: none;
  flex-grow: 1;

  color: var(--Black, #000);
  color: var(--Negre, #000);

  /* Subtitle H4 */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 26px */
  letter-spacing: 0.2px;
}

.bookmark-link:hover {
  text-decoration: underline;
}
.completed-pct-space {
  color: var(--Dark-grey, #797979);

  /* Sidebar - Sections L1 */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
}
</style>
