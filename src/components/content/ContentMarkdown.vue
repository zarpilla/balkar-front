<template>
  <div class="content-markdown">
    <component v-if="data.title" :is="props.titleAs || 'h2'" class="content-markdown__title">
      {{ data.title }}
    </component>
    <vue-markdown
      class="content-markdown__body"
      :options="{ html: true, linkify: true }"
      :source="source"
    ></vue-markdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { getApiBase } from '@/utils/config'

interface ContentMarkdownData {
  __component: string
  id: number
  title?: string
  text?: string
}

interface Props {
  data: ContentMarkdownData
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4'
}

const props = defineProps<Props>()

// Files uploaded to Strapi are referenced as /uploads/...; serve them from the API.
const source = computed(() => {
  const text = props.data.text || ''
  const apiBase = getApiBase()
  return text
    .replace(/\]\(\/uploads\//g, `](${apiBase}/uploads/`)
    .replace(/(src|href)="\/uploads\//g, `$1="${apiBase}/uploads/`)
})
</script>

<style scoped>
.content-markdown {
  margin-bottom: 2rem;
}

.content-markdown__body :deep(img) {
  max-width: 100%;
  height: auto;
}

.content-markdown__body :deep(iframe) {
  max-width: 100%;
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  border: 0;
}
</style>
