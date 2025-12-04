<template>
  <div>
    <!-- Banner for non-enrolled users -->
    <div
      v-if="space.bannerIntro && space.bannerIntro.url && template === 'big'"
      class="mt-5"
      :class="{ container: authenticated }"
    >
      <div class="banner-full d-flex flex-column align-items-center">
        <div class="overlay"></div>
        <img :src="base + space.bannerIntro.url" class="w-100" />
        <h1 class="mt-3 mb-0">
          <div class="free">{{ space.free ? $t('free-course') : $t('paid-course') }}</div>
          {{ space.name }}

          <div class="w-100 text-center mt-5" v-if="authenticated">
            <button class="btn btn-secondary mt-4 mb-4" @click="handleEnroll" v-if="!spaceNeedsPayment">
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
                  <rect y="0.312622" width="24" height="24" fill="var(--icon-placeholder, #D9D9D9)" />
                </mask>
                <g mask="url(#mask0_64_2203)">
                  <path
                    d="M12 21.3126C10.75 21.3126 9.57917 21.0751 8.4875 20.6001C7.39583 20.1251 6.44583 19.4835 5.6375 18.6751C4.82917 17.8668 4.1875 16.9168 3.7125 15.8251C3.2375 14.7335 3 13.5626 3 12.3126C3 11.0626 3.2375 9.89179 3.7125 8.80012C4.1875 7.70846 4.82917 6.75846 5.6375 5.95012C6.44583 5.14179 7.39583 4.50012 8.4875 4.02512C9.57917 3.55012 10.75 3.31262 12 3.31262V5.31262C10.05 5.31262 8.39583 5.99179 7.0375 7.35012C5.67917 8.70846 5 10.3626 5 12.3126C5 14.2626 5.67917 15.9168 7.0375 17.2751C8.39583 18.6335 10.05 19.3126 12 19.3126V21.3126ZM16 17.3126L14.6 15.8876L17.175 13.3126H9V11.3126H17.175L14.6 8.71262L16 7.31262L21 12.3126L16 17.3126Z"
                    fill="black"
                  />
                </g>
              </svg>
            </button>
            <button class="btn btn-secondary mt-4 mb-4" @click="goToId('not-enrolled-payment')" v-else>
              {{
                $t('pay')
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
                  <rect y="0.312622" width="24" height="24" fill="var(--icon-placeholder, #D9D9D9)" />
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
          <div class="w-100 text-center mt-5" v-else>
            <router-link
              :to="`/register`"
              class="btn btn-secondary mt-4 mb-4">
            
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
                  <rect y="0.312622" width="24" height="24" fill="var(--icon-placeholder, #D9D9D9)" />
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
        </h1>
      </div>
    </div>

    <!-- Banner for enrolled users -->
    <div
      v-if="space.banner && space.banner.url && template === 'small'"
      class="mt-5"
      :class="{ container: authenticated }"
    >
      <router-link
        :to="`/space/${space.uid}`"
        class="banner-small d-flex flex-column align-items-center"
      >
        <div class="w-100 d-flex flex-column align-items-center">
          <div class="overlay"></div>
          <img :src="base + space.banner.url" class="w-100" />
          <h1 class="mt-3 mb-0">
            {{ space.name }}
          </h1>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { te } from 'date-fns/locale/te'
import { defineProps, defineEmits } from 'vue'

interface Space {
  bannerIntro?: {
    url: string
  }
  banner?: {
    url: string
  }
  enrolled: boolean
  free?: boolean
  name: string
  uid: string
  contentCompleted?: number
}

interface Props {
  space: Space
  base: string
  authenticated: boolean
  template: 'big' | 'small'
  spaceNeedsPayment?: boolean
}

interface Emits {
  (e: 'enroll'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleEnroll = () => {
  emit('enroll')
}

const goToId = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else {
    console.error(`Element with id ${id} not found`)
  }
}
</script>

<style scoped lang="scss">
.banner-full {
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(var(--theme-primary-rgb, 68, 176, 142), 0.9) 42.31%, rgba(var(--theme-primary-rgb, 68, 176, 142), 0) 100%);
  overflow: hidden;
  position: relative;
  text-align: center;

  h1 {
    width: 40%;
    position: absolute;
    top: 120px;
    color: var(--color-text-inverse);
    font-size: 36px;
    font-weight: bold;
    margin: auto;
    text-align: center;
    font-family: 'Inter';
    font-size: 50px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 50px */
    letter-spacing: 0;

    @media screen and (max-width: 768px) {
      font-size: 36px;
      width: 100%;
      top: 20px;
      padding: 20px;
    }

    .free {
      color: var(--color-text-inverse);
      text-align: center;
      font-family: 'Inter';
      font-size: 16.971px;
      font-style: normal;
      font-weight: 700;
      line-height: 110%; /* 18.669px */
      letter-spacing: 1.697px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
  }
  img {
    border-radius: 20px;
    width: 100%;
    height: 650px;
    object-fit: cover;

    @media screen and (max-width: 768px) {
      height: 400px;
    }
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1200px;
    background: linear-gradient(180deg, var(--theme-primary) 0%, rgba(var(--theme-primary-rgb, 68, 176, 142), 0) 100%);
    overflow: hidden;
    pointer-events: none;
  }
}

.banner-small {
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(var(--theme-primary-rgb, 68, 176, 142), 0.9) 42.31%, rgba(var(--theme-primary-rgb, 68, 176, 142), 0) 100%);
  overflow: hidden;
  position: relative;
  text-align: left;

  h1 {
    width: 40%;
    position: absolute;
    top: 34px;
    color: var(--color-text-inverse);
    font-size: 36px;
    font-weight: bold;
    margin: 0;
    left: 0;
    padding-left: 45px;
    /* Title H1 */
    font-family: Inter;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 36px */
    letter-spacing: 0.3px;

    @media screen and (max-width: 768px) {
      font-size: 24px;
      padding-left: 20px;
      width: 100%;
    }
  }
  img {
    border-radius: 20px;
    width: 100%;
    height: 165px;
    object-fit: cover;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1200px;
    background: linear-gradient(90deg, var(--theme-primary) 0%, rgba(var(--theme-primary-rgb, 68, 176, 142), 0) 100%);
    overflow: hidden;
    pointer-events: none;
  }
}
</style>
