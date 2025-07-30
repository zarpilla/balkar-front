<template>
  <div class="content-image">
    <component v-if="data.title" :is="props.titleAs || 'h2'" class="content-image__title">
      {{ data.title }}
    </component>
    <figure class="content-image__figure">
      <img
        :src="getImageUrl()"
        :alt="data.alternativeText || data.image.alternativeText || data.title || 'Image'"
        class="content-image__img"
      />
      <figcaption v-if="data.caption || data.image.caption" class="content-image__caption">
        {{ data.caption || data.image.caption }}
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface ImageFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path?: string
  size: number
  width: number
  height: number
  sizeInBytes: number
}

interface ImageData {
  id: number
  name: string
  alternativeText?: string
  caption?: string
  width?: number
  height?: number
  formats?: {
    large?: ImageFormat
    medium?: ImageFormat
    small?: ImageFormat
    thumbnail?: ImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: string
  provider: string
  provider_metadata?: any
  createdAt: string
  updatedAt: string
}

interface ContentImageData {
  __component: string
  id: number
  title?: string
  image: ImageData
  caption?: string
  alternativeText?: string
}

interface Props {
  data: ContentImageData
  titleAs?: string
}

const props = defineProps<Props>()

const apiBase = import.meta.env.VITE_API_BASE

const getImageUrl = () => {
  if (!props.data.image) return ''

  // Use the best available format for display
  const formats = props.data.image.formats
  if (formats?.large?.url) {
    return apiBase + formats.large.url
  }
  if (formats?.medium?.url) {
    return apiBase + formats.medium.url
  }
  if (props.data.image.url) {
    return apiBase + props.data.image.url
  }
  return ''
}
</script>

<style scoped>
.content-image {
  margin-bottom: 2rem;
}

.content-image__title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.content-image__figure {
  margin: 0;
}

.content-image__img {
  width: 100%;
  height: auto;
  border-radius: 13.182px;
  /* box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); */
}

.content-image__caption {
  margin-top: 30px;
  margin-bottom: 50px;
  color: var(--Dark-grey, #797979);

  /* Footnotes */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
}
</style>
