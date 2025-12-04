<template>
  <div class="content-slider" :class="`content-slider--${data.color}`">
    <div class="slider-container">
      <div class="slider-wrapper">
        <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="item in data.items" :key="item.id" class="slide"
            :class="`slide--${item.color}`"
          >
            <div class="slide-content">
              <div class="slide-text">
                <div class="slider-header">
                  <div class="slider-title">{{ data.title }}</div>
                </div>
                <p class="slide-pre-title">{{ item.preTitle }}</p>
                <h3 class="slide-title">{{ item.title }}</h3>
                <div class="slide-description">
                  <template v-for="(paragraph, pIndex) in item.text" :key="pIndex">
                    <p v-if="paragraph.type === 'paragraph'">
                      <template v-for="(child, cIndex) in paragraph.children" :key="cIndex">
                        {{ child.text }}
                      </template>
                    </p>
                  </template>
                </div>
              </div>
              <div
                class="slide-media"
                v-if="item.image && item.image.url"
                :class="{
                  contain: item.imageSize === 'contain',
                  cover: item.imageSize === 'cover',
                  initial: !item.imageSize || item.imageSize === 'initial'
                }"
                :style="{ backgroundImage: `url(${apiBase + item.image.url})` }"
              >
                <div class="slide-logo" v-if="item.logo && item.logo.url">
                  <img
                    :src="apiBase + item.logo.url"
                    :alt="item.logo.alternativeText || 'Logo'"
                    class="logo-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="slider-navigation">
        <button
          @click="previousSlide"
          :disabled="currentSlide === 0"
          class="nav-button nav-button--prev"
          aria-label="Previous slide"
        >
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_71_2864"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="25"
            >
              <rect
                x="24"
                y="24.5713"
                width="24"
                height="24"
                transform="rotate(-180 24 24.5713)"
                fill="var(--icon-placeholder, #D9D9D9)"
              />
            </mask>
            <g mask="url(#mask0_71_2864)">
              <path
                d="M11.325 12.5713L14.4 9.49629L13 8.07129L8.5 12.5713L13 17.0713L14.4 15.6463L11.325 12.5713ZM12 2.57129C13.3833 2.57129 14.6833 2.83379 15.9 3.35879C17.1167 3.88379 18.175 4.59629 19.075 5.49629C19.975 6.39629 20.6875 7.45462 21.2125 8.67129C21.7375 9.88795 22 11.188 22 12.5713C22 13.9546 21.7375 15.2546 21.2125 16.4713C20.6875 17.688 19.975 18.7463 19.075 19.6463C18.175 20.5463 17.1167 21.2588 15.9 21.7838C14.6833 22.3088 13.3833 22.5713 12 22.5713C10.6167 22.5713 9.31667 22.3088 8.1 21.7838C6.88333 21.2588 5.825 20.5463 4.925 19.6463C4.025 18.7463 3.3125 17.688 2.7875 16.4713C2.2625 15.2546 2 13.9546 2 12.5713C2 11.188 2.2625 9.88795 2.7875 8.67129C3.3125 7.45462 4.025 6.39629 4.925 5.49629C5.825 4.59629 6.88333 3.88379 8.1 3.35879C9.31667 2.83379 10.6167 2.57129 12 2.57129ZM12 4.57129C9.76667 4.57129 7.875 5.34629 6.325 6.89629C4.775 8.44629 4 10.338 4 12.5713C4 14.8046 4.775 16.6963 6.325 18.2463C7.875 19.7963 9.76667 20.5713 12 20.5713C14.2333 20.5713 16.125 19.7963 17.675 18.2463C19.225 16.6963 20 14.8046 20 12.5713C20 10.338 19.225 8.44629 17.675 6.89629C16.125 5.34629 14.2333 4.57129 12 4.57129Z"
                fill="var(--icon-dark, #1C1B1F)"
              />
            </g>
          </svg>
        </button>

        <div class="slide-indicators">
          <div
            v-for="(item, index) in data.items"
            :key="item.id"
            @click="goToSlide(index)"
            :class="['indicator', { 'indicator--active': currentSlide === index }]"
            :aria-label="`Go to slide ${index + 1}`"
          ></div>
        </div>

        <button
          @click="nextSlide"
          :disabled="currentSlide === data.items.length - 1"
          class="nav-button nav-button--next"
          aria-label="Next slide"
        >
          <svg
            width="25"
            height="26"
            viewBox="0 0 25 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_71_2870"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="26"
              height="26"
            >
              <path d="M0.225891 0.336426H25.0087V25.1193H0.225891V0.336426Z" fill="var(--icon-placeholder, #D9D9D9)" />
            </mask>
            <g mask="url(#mask0_71_2870)">
              <path
                d="M13.3143 12.7278L10.139 15.9031L11.5847 17.3746L16.2315 12.7278L11.5847 8.08101L10.139 9.55249L13.3143 12.7278ZM12.6173 23.054C11.1888 23.054 9.84644 22.7829 8.59009 22.2408C7.33374 21.6987 6.24089 20.9629 5.31153 20.0336C4.38217 19.1042 3.64643 18.0114 3.10431 16.755C2.56218 15.4986 2.29112 14.1562 2.29112 12.7278C2.29112 11.2993 2.56218 9.95693 3.10431 8.70058C3.64643 7.44423 4.38217 6.35137 5.31153 5.42202C6.24089 4.49266 7.33374 3.75692 8.59009 3.2148C9.84644 2.67267 11.1888 2.40161 12.6173 2.40161C14.0458 2.40161 15.3882 2.67267 16.6445 3.2148C17.9009 3.75692 18.9937 4.49266 19.9231 5.42202C20.8524 6.35137 21.5882 7.44423 22.1303 8.70058C22.6724 9.95693 22.9435 11.2993 22.9435 12.7278C22.9435 14.1562 22.6724 15.4986 22.1303 16.755C21.5882 18.0114 20.8524 19.1042 19.9231 20.0336C18.9937 20.9629 17.9009 21.6987 16.6445 22.2408C15.3882 22.7829 14.0458 23.054 12.6173 23.054ZM12.6173 20.9887C14.9235 20.9887 16.8768 20.1885 18.4774 18.5879C20.078 16.9873 20.8782 15.034 20.8782 12.7278C20.8782 10.4216 20.078 8.46824 18.4774 6.86768C16.8768 5.26713 14.9235 4.46685 12.6173 4.46685C10.3111 4.46685 8.35775 5.26713 6.75719 6.86768C5.15664 8.46824 4.35636 10.4216 4.35636 12.7278C4.35636 15.034 5.15664 16.9873 6.75719 18.5879C8.35775 20.1885 10.3111 20.9887 12.6173 20.9887Z"
                fill="var(--icon-dark, #1C1B1F)"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getApiBase } from '@/utils/config'

interface SliderItem {
  id: number
  preTitle: string
  title: string
  text: Array<{
    type: string
    children: Array<{
      text: string
      type: string
    }>
  }>
  logo: {
    id: number
    url: string
    alternativeText?: string
    [key: string]: any
  }
  image: {
    id: number
    url: string
    alternativeText?: string
    [key: string]: any
  }
  imageSize?: 'contain' | 'cover' | 'initial'
  color?: 'loop' | 'primary' | 'secondary' | 'tertiary'
}

interface SliderData {
  __component: string
  id: number
  title: string
  color: string
  items: SliderItem[]
}

interface Props {
  data: SliderData
}

const props = defineProps<Props>()

const currentSlide = ref(0)

const nextSlide = () => {
  if (currentSlide.value < props.data.items.length - 1) {
    currentSlide.value++
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const apiBase = getApiBase()
</script>

<style scoped lang="scss">
.content-slider {
  width: 100%;
  margin: 0 auto;
}

.slider-header {
  margin-bottom: 3rem;
}

.slider-title {
  color: var(--Black, #000);
  font-family: 'Inter';
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 16.8px */
  letter-spacing: 0.42px;
  text-transform: uppercase;
}

.slider-container {
  position: relative;
  background: #f8f9fa;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.slider-wrapper {
  overflow: hidden;
  width: 100%;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
}

.slide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  min-height: 400px;
}

.slide-text {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  padding: 2rem 2.5rem 2rem 5.5rem;

  @media screen and (max-width: 768px) {
    padding: 2rem 1.5rem;
    text-align: center;
  }
}

.slide-pre-title {
  color: var(--Black, #000);
  font-family: 'Inter';
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 15.4px */
  letter-spacing: 0.42px;
}

.slide-title {
  color: var(--Black, #000);
  font-family: 'Inter';
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%; /* 28px */
  margin: 10px 0;
}

.slide-description {
  color: var(--Black, #000);
  font-family: 'Inter';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 20.8px */
}

.slide-description p {
  margin: 0;
}

.slide-media {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  padding: 2rem;

  &.cover {
    background-size: cover;
  }
  &.contain {
    background-size: contain;
  }
  &.initial {
    background-size: auto;
  }
}

.slide-logo {
}

.logo-image {
  width: 90px;
  height: auto;
  display: block;
}

.slider-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;

  position: absolute;
  top: 50%;
  width: 100%;

  @media screen and (max-width: 768px) {
    top: calc(100% - 100px);
  }
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 0;
  background: transparent;
  padding: 0 10px;
}

.nav-button:disabled {
  cursor: not-allowed;
  transform: none;

  svg {
    opacity: 0.15;
  }
}

.slide-indicators {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  bottom: -9rem;
  left: 5.5rem;

  @media screen and (max-width: 768px) {
    top: calc(100% - 40px);
  }
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #2C3036;
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator--active {
  background: #2C3036;
  transform: scale(1);
  opacity: 1;
}

.indicator:hover {
  opacity: 1;
}

.indicator--active:hover {
  background: #2C3036;
}

/* Color variations */
.content-slider--primary .slide {
  background-color: var(--theme-primary, #44b08e);
}

.content-slider--secondary .slide {
  background-color: var(--theme-secondary, #f0c05a);
}

.content-slider--tertiary .slide {
  background-color: var(--theme-accent-blue-light, #cfe0fc);
}

/* Loop color alternation - cycle through primary, secondary, tertiary */
.content-slider--loop .slide:nth-child(3n + 1) {
  background-color: var(--theme-primary, #44b08e);
}

.content-slider--loop .slide:nth-child(3n + 2) {
  background-color: var(--theme-secondary, #f0c05a);
}

.content-slider--loop .slide:nth-child(3n + 3) {
  background-color: var(--theme-accent-blue-light, #cfe0fc);
}

.content-slider--loop .slide.slide--primary {
  background-color: var(--theme-primary, #44b08e)!important;
}
.content-slider--loop .slide.slide--secondary {
  background-color: var(--theme-secondary, #f0c05a)!important;
}
.content-slider--loop .slide.slide--tertiary {
  background-color: var(--theme-accent-blue-light, #cfe0fc)!important;
}

/* Ensure all text remains black */
.content-slider .slider-title,
.content-slider .slide-pre-title,
.content-slider .slide-title,
.content-slider .slide-description {
  color: #000;
}

/* Responsive design */
@media (max-width: 768px) {
  .content-slider {
    padding: 1rem;
  }

  //   .slider-title {
  //     font-size: 1.8rem;
  //   }

  .slide {
    padding: 2rem 1.5rem;
  }

  .slide-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .slide-title {
    font-size: 1.8rem;
  }

  .slider-navigation {
    padding: 1rem 1.5rem;
  }

  .nav-button {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  //   .slider-title {
  //     font-size: 1.5rem;
  //   }

  .slide-title {
    font-size: 1.5rem;
  }

  .slide-description {
    font-size: 1rem;
  }
}
</style>
