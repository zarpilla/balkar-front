<template>
  <component
    :is="getElementTag(element.type, element.format)"
    :class="getElementClass(element.type)"
    :href="element.type === 'link' ? element.url : undefined"
    :target="element.type === 'link' ? '_blank' : undefined"
    :rel="element.type === 'link' ? 'noopener noreferrer' : undefined"
  >
    <template v-for="(child, childIndex) in element.children" :key="childIndex">
      <component 
        v-if="isTextNode(child)"
        :is="getTextWrapper(child)"
        :class="getTextClasses(child)"
      >
        {{ child.text }}
      </component>
      <RichTextElement v-else :element="child" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

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

interface Props {
  element: RichTextElementData
}

defineProps<Props>()

const getElementTag = (type: string, format?: string): string => {
  const elementMap: Record<string, string> = {
    'paragraph': 'p',
    'heading': 'h3',
    'quote': 'blockquote',
    'code': 'pre',
    'list': format === 'ordered' ? 'ol' : 'ul',
    'list-item': 'li',
    'link': 'a'
  }
  
  return elementMap[type] || 'p'
}

const getElementClass = (type: string): string => {
  const classMap: Record<string, string> = {
    'paragraph': 'content-text__paragraph',
    'heading': 'content-text__heading',
    'quote': 'content-text__quote',
    'code': 'content-text__code',
    'list': 'content-text__list',
    'list-item': 'content-text__list-item',
    'link': 'content-text__link'
  }
  
  return classMap[type] || 'content-text__element'
}

const isTextNode = (node: TextChild | RichTextElementData | LinkElement): node is TextChild => {
  return 'text' in node && node.type === 'text'
}

const getTextWrapper = (textNode: TextChild): string => {
  if (textNode.bold) return 'strong'
  if (textNode.italic) return 'em'
  if (textNode.underline) return 'u'
  if (textNode.strikethrough) return 's'
  return 'span'
}

const getTextClasses = (textNode: TextChild): string => {
  const classes = ['content-text__text']
  
  if (textNode.bold) classes.push('content-text__text--bold')
  if (textNode.italic) classes.push('content-text__text--italic')
  if (textNode.underline) classes.push('content-text__text--underline')
  if (textNode.strikethrough) classes.push('content-text__text--strikethrough')
  
  return classes.join(' ')
}
</script>

<style scoped>
.content-text__paragraph {
  margin-bottom: 1rem;
}

.content-text__paragraph:last-child {
  margin-bottom: 0;
}

.content-text__heading {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
  color: #1f2937;
}

.content-text__quote {
color: var(--neutral-black, #000);

/* Quote */
font-family: Inter;
font-size: 28px;
font-style: normal;
font-weight: 400;
line-height: 130%; /* 36.4px */
}

.content-text__code {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-family: monospace;
  margin-bottom: 1rem;
}

.content-text__list {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.content-text__list:last-child {
  margin-bottom: 0;
}

.content-text__list ul,
.content-text__list ol {
  /* list-style-type: square; */
}

.content-text__list ol {
  list-style-type: decimal;
}

.content-text__list-item {
  margin-bottom: 2px;
}

.content-text__list-item:last-child {
  margin-bottom: 0;
}

.content-text__link {
  color: var(--theme-primary, #44B08E);
  text-decoration: underline;
  transition: color 0.2s ease;  
}

.content-text__link:hover {
    color: var(--theme-primary-hover, #36a07b);
  text-decoration: none;
}

.content-text__link:focus {
  outline: 0;
  outline-offset: 0px;
  border-radius: 0px;
}

/* Text formatting styles */
.content-text__text--bold {
  font-weight: 600;
}

.content-text__text--italic {
  font-style: italic;
}

.content-text__text--underline {
  text-decoration: underline;
}

.content-text__text--strikethrough {
  text-decoration: line-through;
}
</style>
