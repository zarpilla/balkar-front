<template>
  <div class="space-content">
    <template v-for="(item, index) in content" :key="index">
      <component
        :is="getComponentName(item.__component)"
        :data="item"
        :title-as="titleAs"
        :class="`content-item content-item--${item.__component.replace('.', '-')}`"
        :space-title="spaceTitle"
        :space-sub-title="spaceSubTitle"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import ContentText from './content/ContentText.vue'
import ContentImage from './content/ContentImage.vue'
import ContentVideo from './content/ContentVideo.vue'
import ContentAccordion from './content/ContentAccordion.vue'

interface ContentItem {
  __component: string
  id: number
  [key: string]: any
}

interface Props {
  content: ContentItem[]
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4'
  spaceTitle?: string
  spaceSubTitle?: string
}

defineProps<Props>()

// Map component types to actual Vue components
const componentMap: Record<string, any> = {
  'content.text': ContentText,
  'content.image': ContentImage,
  'content.video': ContentVideo,
  'content.accordion': ContentAccordion
}

const getComponentName = (componentType: string) => {
  return componentMap[componentType] || 'div'
}
</script>

<style scoped>
.space-content {
  width: 100%;
}

.content-item {
  margin-bottom: 2rem;
}

.content-item:last-child {
  margin-bottom: 0;
}
</style>
