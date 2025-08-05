<template>
  <div>
    <!-- Not enrolled section for authenticated users -->
    <div class="not-enrolled" v-if="authenticated" id="not-enrolled-payment">
      <div class="container bg-white mt-5">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <div v-if="space.publicLesson">
              <SpaceContent :content="space.publicLesson.content" title-as="h2" :is-completed="false" :space-title="space.name" />              
            </div>
            <vue-markdown
              v-else-if="space.publicDescription"
              :options="{ html: true }"
              :linkify="true"
              class="mt-4 mb-4"
              :source="space.publicDescription"
            ></vue-markdown>

            <div
              v-if="!paymentIsChecking && paymentHasResponse && paymentIsSuccessfully"
              class="alert alert-success mt-4 mb-4"
            >
              {{ $t('payment-successful') }}
            </div>
            <div
              v-else-if="!paymentIsChecking && paymentHasResponse && !paymentIsSuccessfully"
              class="alert alert-danger mt-4 mb-4"
            >
              {{ $t('payment-error') }}
            </div>

            <button
              class="btn btn-primary mt-4 mb-4"
              @click="handlePay"
              v-if="spaceNeedsPayment"
              :disabled="!canPay"
            >
              {{ $t('pay') }}
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

            <div class="w-100 text-center" v-else>
              <button class="btn btn-secondary mt-4 mb-4" @click="handleEnroll">
                {{
                  space.enrolled && space.contentCompleted ? $t('resume-course') : $t('apuntar-se')
                }}
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not enrolled section for non-authenticated users -->
    <div class="not-enrolled" v-if="!authenticated">
      <div class="container zbg-balkar mt-5">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <!-- <vue-markdown
              v-if="space.publicDescription"
              :linkify="true"
              :options="{ html: true }"
              class="mt-4 mb-4"
              :source="space.publicDescription"
            ></vue-markdown> -->

            <div v-if="space.publicLesson">
              <SpaceContent :content="space.publicLesson.content" title-as="h2" :is-completed="false" :space-title="space.name" />
            </div>

            <div
              v-if="!paymentIsChecking && paymentHasResponse && paymentIsSuccessfully"
              class="alert alert-success mt-4 mb-4"
            >
              {{ $t('payment-successful') }}
            </div>
            <div
              v-else-if="!paymentIsChecking && paymentHasResponse && !paymentIsSuccessfully"
              class="alert alert-danger mt-4 mb-4"
            >
              {{ $t('payment-error') }}
            </div>

            <div class="row mt-5 mb-3" v-if="spaceNeedsPayment">
              <div class="col-lg-6 zoffset-lg-3" id="register-form">
                <RegisterForm
                  button-text="apuntar-se"
                  :enroll="uid"
                  :disabled="spaceNeedsPayment"
                  @email-valid="handleEmailValid"
                  :force-email="canPayEmail && paymentIsSuccessfully ? canPayEmail : ''"
                  :force-name="canPayName && paymentIsSuccessfully ? canPayName : ''"
                  :force-lastname="canPayLastname && paymentIsSuccessfully ? canPayLastname : ''"
                  :checkout-session="checkoutSession"
                ></RegisterForm>
              </div>
            </div>
            <div class="w-100 text-center mt-5" v-else>
              <router-link :to="`/register`" class="btn btn-secondary mt-4 mb-4">
                {{
                  space.enrolled && space.contentCompleted ? $t('resume-course') : $t('apuntar-se')
                }}
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
              </router-link>
            </div>

            <button
              class="btn btn-primary zmt-4 mb-4"
              @click="handlePay"
              v-if="spaceNeedsPayment"
              :disabled="!canPay"
            >
              {{ $t('pay') }}

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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import RegisterForm from '@/components/RegisterForm.vue'
import SpaceContent from '@/components/SpaceContent.vue'

interface Space {
  enrolled: boolean
  publicDescription?: string
  product?: any
  contentCompleted?: number
  publicLesson?: any
  name: string
}

interface EmailValidData {
  valid: boolean
  email: string
  name: string
  lastname: string
}

interface Props {
  space: Space
  authenticated: boolean
  uid: string
  paymentIsChecking: boolean
  paymentHasResponse: boolean
  paymentIsSuccessfully: boolean
  spaceNeedsPayment: boolean
  canPay: boolean
  canPayEmail: string
  canPayName: string
  canPayLastname: string
  checkoutSession: string
  publicLesson?: any
}

interface Emits {
  (e: 'enroll'): void
  (e: 'pay'): void
  (e: 'email-valid', data: EmailValidData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleEnroll = () => {
  emit('enroll')
}

const handlePay = () => {
  emit('pay')
}

const handleEmailValid = (data: EmailValidData) => {
  emit('email-valid', data)
}
</script>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
