<template>
  <div class="content-video">
    <!-- Video banner with thumbnail and play button -->
    <div class="content-video__banner" v-if="!isPlaying">
      <div class="content-video__overlay" @click="playVideo" :class="data.overlay ? 'content-video__overlay-' + data.overlay : ''">
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
        <div v-if="props.spaceTitle" class="content-video__banner-title">[{{ props.spaceTitle }}]</div>
        <component v-if="data.title" :is="props.titleAs || 'h2'" class="content-video__title">
          <div class="content-video__banner-subtitle">
            {{ props.spaceSubTitle }}
          </div>
          {{ data.title }}
        </component>
      </div>
      <img
        :src="getThumbnailUrl()"
        alt=""
        class="content-video__thumbnail"
      />
    </div>
    <!-- Video player (shown when playing) -->
    <div v-if="isPlaying" class="content-video__wrapper">
      <video
        v-if="data.video && data.video.url"
        :src="getVideoUrl()"        
        controls
        autoplay
        class="content-video__player"
        @ended="stopVideo"
        crossorigin="anonymous"
      >
        <track
          v-for="track in subtitleTracks"
          :key="track.id"
          kind="subtitles"
          :src="track.src"
          :srclang="track.srclang"
          :label="track.label"
          v-bind:default="track.default || undefined"
        />
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
    <div v-if="isPlaying" class="content-transcript">
      <button
        class="btn btn-primary w-100 mt-2"
        @click="downloadTranscript"
        v-if="data.subtitle && data.subtitle.transcript"
      >
        {{ $t('transcript-download') }}
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_96_597"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="25"
          >
            <rect x="0.5" y="0.712402" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_96_597)">
            <path
              d="M12.5 16.7124L16.5 12.7124L15.1 11.3124L13.5 12.9124V8.7124H11.5V12.9124L9.9 11.3124L8.5 12.7124L12.5 16.7124ZM12.5 22.7124C11.1167 22.7124 9.81667 22.4499 8.6 21.9249C7.38333 21.3999 6.325 20.6874 5.425 19.7874C4.525 18.8874 3.8125 17.8291 3.2875 16.6124C2.7625 15.3957 2.5 14.0957 2.5 12.7124C2.5 11.3291 2.7625 10.0291 3.2875 8.8124C3.8125 7.59574 4.525 6.5374 5.425 5.6374C6.325 4.7374 7.38333 4.0249 8.6 3.4999C9.81667 2.9749 11.1167 2.7124 12.5 2.7124C13.8833 2.7124 15.1833 2.9749 16.4 3.4999C17.6167 4.0249 18.675 4.7374 19.575 5.6374C20.475 6.5374 21.1875 7.59574 21.7125 8.8124C22.2375 10.0291 22.5 11.3291 22.5 12.7124C22.5 14.0957 22.2375 15.3957 21.7125 16.6124C21.1875 17.8291 20.475 18.8874 19.575 19.7874C18.675 20.6874 17.6167 21.3999 16.4 21.9249C15.1833 22.4499 13.8833 22.7124 12.5 22.7124ZM12.5 20.7124C14.7333 20.7124 16.625 19.9374 18.175 18.3874C19.725 16.8374 20.5 14.9457 20.5 12.7124C20.5 10.4791 19.725 8.5874 18.175 7.0374C16.625 5.4874 14.7333 4.7124 12.5 4.7124C10.2667 4.7124 8.375 5.4874 6.825 7.0374C5.275 8.5874 4.5 10.4791 4.5 12.7124C4.5 14.9457 5.275 16.8374 6.825 18.3874C8.375 19.9374 10.2667 20.7124 12.5 20.7124Z"
              fill="#1C1B1F"
            />
          </g>
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getApiBase } from '@/utils/config'

const { locale } = useI18n()

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

interface SubtitleFile {
  id: number
  text: string
  transcript?: string
  name: string
  createdAt: string
  updatedAt: string
  locale: string
  localizations?: Array<{
    id: number
    text: string
    name: string
    createdAt: string
    updatedAt: string
    locale: string
  }>
}

interface ContentVideoData {
  __component: string
  id: number
  title?: string
  video?: VideoFile
  url?: string // For embed URLs
  thumbnail?: ThumbnailImage
  description?: string
  subtitle?: SubtitleFile
  overlay?: 'green' | 'yellow' | 'blue'
}

interface Props {
  data: ContentVideoData
  titleAs?: string
  spaceTitle?: string
  spaceSubTitle?: string
}

const props = defineProps<Props>()

const isPlaying = ref(false)
const apiBase = getApiBase()

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

const subtitleTracks = computed(() => {
  const tracks = []
  const subtitle = props.data.subtitle
  if (subtitle) {
    tracks.push({
      id: subtitle.id,
      src: `${getApiBase()}/api/subtitles/file/${subtitle.id}`,
      srclang: subtitle.locale,
      label: subtitle.locale.toUpperCase(),
      default: subtitle.locale === locale.value
    })
    if (Array.isArray(subtitle.localizations)) {
      for (const loc of subtitle.localizations) {
        tracks.push({
          id: loc.id,
          src: `${getApiBase()}/api/subtitles/file/${loc.id}`,
          srclang: loc.locale,
          label: loc.locale.toUpperCase(),
          default: loc.locale === locale.value
        })
      }
    }
  }
  return tracks
})

const downloadTranscript = () => {
  const subtitle = props.data.subtitle
  if (subtitle) {
    const url = `${getApiBase()}/api/subtitles/transcript/${subtitle.id}`
    window.open(url, '_blank')
  }
}
</script>

<style scoped lang="scss">
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
  background: linear-gradient(180deg, rgba(68, 176, 142, 0.8) 0%, rgba(68, 176, 142, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 2;
}

.content-video__overlay-yellow {  
   /* #F0C05A */
  background: linear-gradient(180deg, rgba(240, 192, 90, 0.8) 0%, rgba(240, 192, 90, 1) 100%);
}

.content-video__overlay-blue {
  background: linear-gradient(180deg, rgba(105, 136, 186, 0.80) 5.55%, #6988BA 100%);
  background: linear-gradient(180deg, rgba(207, 224, 252, 0.80) 0%, #CFE0FC 100%);
    
  .content-video__banner-title {
    color: var(--Black, #000);
  }
  .content-video__title {
    color: var(--Black, #000);
  }
  .content-video__banner-subtitle{
    color: var(--Black, #000);
   } 
  
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

.content-transcript .btn {
  border-radius: 30px;
  background: var(--Light-Grey, #e0e0e0);
  border: none;

  color: var(--Black, #000);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 23px; /* 127.778% */
  letter-spacing: 0.18px;
  text-transform: none;

  &:hover {
    background: var(--Blue-Grey, #cfe0fc);
  }
}

video {
  object-fit: cover;
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
