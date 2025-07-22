<template>
  <div class="content-text">
    <component v-if="data.title" :is="props.titleAs || 'h2'" class="content-text__title">
      {{ data.title }}
    </component>
    <div class="content-text__body">
      <template v-for="(item, index) in data.text" :key="index">
        <RichTextElement :element="item" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import RichTextElement from './RichTextElement.vue'

interface TextChild {
  text: string
  type: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

interface LinkElement {
  type: 'link'
  url: string
  children: TextChild[]
}

interface RichTextElementData {
  type: string
  format?: string
  url?: string
  children: (TextChild | RichTextElementData | LinkElement)[]
}

interface ContentTextData {
  __component: string
  id: number
  title?: string
  text: RichTextElementData[]
}

interface Props {
  data: ContentTextData
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4'
}

const props = defineProps<Props>()
</script>

<style scoped>
.content-text {
  margin-bottom: 2rem;
}

.content-text__body {
  line-height: 1.6;
  color: #000;
}
</style>
