<template>
  <div class="content-video">
    <!-- Video banner with thumbnail and play button -->
    <div class="content-video__banner" v-if="!isPlaying">
      <div class="content-video__overlay" @click="playVideo">
        <div class="content-video__play-button">
          <svg
            width="66"
            height="67"
            viewBox="0 0 66 67"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.0001 1.33545C50.5939 1.33547 64.871 15.7862 64.8712 33.6304C64.8712 51.4747 50.594 65.9263 33.0001 65.9263C15.4062 65.9263 1.12903 51.4747 1.12903 33.6304C1.12926 15.7862 15.4063 1.33545 33.0001 1.33545Z"
              fill="white"
              stroke="white"
              stroke-width="1.31818"
            />
            <path
              d="M38.6969 32.8187C39.5757 33.3261 39.5757 34.5945 38.6969 35.1019L30.2935 39.9536C29.4147 40.461 28.3162 39.8268 28.3162 38.812L28.3162 29.1086C28.3162 28.0939 29.4147 27.4597 30.2935 27.967L38.6969 32.8187Z"
              fill="black"
            />
          </svg>
        </div>
        <div class="content-video__banner-title">[{{ props.spaceTitle }}]</div>
        <component v-if="data.title" :is="props.titleAs || 'h2'" class="content-video__title">
          <div class="content-video__banner-subtitle">
            {{ props.spaceSubTitle }}
          </div>
          {{ data.title }}
        </component>
      </div>
      <img
        :src="getThumbnailUrl()"
        :alt="data.title || 'Video thumbnail'"
        class="content-video__thumbnail"
      />
    </div>

    <!-- Video player (shown when playing) -->
    <div v-if="isPlaying" class="content-video__wrapper">
      <video
        v-if="data.video && data.video.url"
        :src="getVideoUrl()"
        :poster="getThumbnailUrl()"
        controls
        autoplay
        class="content-video__player"
        @ended="stopVideo"
      >
        {{ $t('content.video.notSupported') }}
      </video>
      <iframe
        v-else-if="data.url"
        :src="data.url"
        class="content-video__iframe"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'

interface VideoFile {
  url: string
  mime?: string
}

interface ThumbnailImage {
  id: number
  name: string
  url: string
  alternativeText?: string
  width?: number
  height?: number
  formats?: {
    large?: { url: string }
    medium?: { url: string }
    small?: { url: string }
    thumbnail?: { url: string }
  }
}

interface ContentVideoData {
  __component: string
  id: number
  title?: string
  video?: VideoFile
  url?: string // For embed URLs
  thumbnail?: ThumbnailImage
  description?: string
}

interface Props {
  data: ContentVideoData
  titleAs?: string
  spaceTitle?: string
  spaceSubTitle?: string
}

const props = defineProps<Props>()

const isPlaying = ref(false)
const apiBase = import.meta.env.VITE_API_BASE

const playVideo = () => {
  isPlaying.value = true
}

const stopVideo = () => {
  isPlaying.value = false
}

const getThumbnailUrl = () => {
  if (!props.data.thumbnail) return ''

  // Use the largest available format for banner display
  const formats = props.data.thumbnail.formats
  if (formats?.large?.url) {
    return apiBase + formats.large.url
  }
  if (formats?.medium?.url) {
    return apiBase + formats.medium.url
  }
  if (props.data.thumbnail.url) {
    return apiBase + props.data.thumbnail.url
  }
  return ''
}

const getVideoUrl = () => {
  if (props.data.video?.url) {
    return apiBase + props.data.video.url
  }
  return ''
}
</script>

<style scoped>
.content-video {
  margin-bottom: 2rem;
}

.content-video__title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
  position: absolute;
  bottom: 45px;

  color: var(--Blanc, #fff);

  /* Title videos */
  font-family: Inter;
  font-size: 42px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 46.2px */
  width: calc(100% - 90px);
  left: 45px;
  text-align: left;

  @media screen and (max-width: 768px) {
    font-size: 24px;
    width: calc(100% - 20px);
    left: 20px;    
  }
}

.content-video__banner-title {
  position: absolute;
  top: 45px;
  left: 45px;
  color: var(--Blanc, #fff);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 17.6px */
  letter-spacing: 0.16px;
  text-transform: uppercase;
  width: 40%;
  text-align: left;
  @media screen and (max-width: 768px) {
    width: 100%;
    left: 20px;
  }
}

.content-video__banner {
  border-radius: 20px;
  border-radius: 13.182px;
  background: linear-gradient(180deg, rgba(68, 176, 142, 0.9) 42.31%, rgba(68, 176, 142, 0) 100%);
  overflow: hidden;
  position: relative;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
  margin: 50px 0;
}

.content-video__banner-subtitle {
  color: var(--Blanc, #fff);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 17.6px */
  letter-spacing: 0.48px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.content-video__thumbnail {
  border-radius: 20px;
  border-radius: 13.182px;
  width: 100%;
  height: 470px;
  object-fit: cover;
  display: block;
}

.content-video__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(68, 176, 142, 0.3) 0%, rgba(68, 176, 142, 0.1) 100%);
  background: linear-gradient(180deg, rgba(68, 176, 142, 0.9) 42.31%, rgba(68, 176, 142, 0.5) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 2;
}

.content-video__play-button {
  transition: transform 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.content-video__banner:hover .content-video__play-button {
  transform: scale(1.1);
}

.content-video__wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  /* box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06); */
}

.content-video__player,
.content-video__iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 20px;
}

.content-video__description {
  margin-top: 1rem;
  color: #6b7280;
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-video__thumbnail {
    height: 250px;
  }

  .content-video__play-button svg {
    width: 60px;
    height: 60px;
  }
}
</style>
