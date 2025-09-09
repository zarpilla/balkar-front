<template>
  <div class="content-accordion">
    <component v-if="data.title" :is="props.titleAs || 'h2'" class="content-accordion__title">
      {{ data.title }}
    </component>

    <div class="accordion" id="accordionExample">
      <div v-for="(item, index) in data.items" :key="item.id" class="accordion-item">
        <h2 class="accordion-header" :id="`heading${item.id}`">
          <button
            class="accordion-button collapsed"
            :class="getButtonColorClass(index)"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="`#collapse${item.id}`"
            aria-expanded="false"
            :aria-controls="`collapse${item.id}`"
          >
            {{ item.title }}
          </button>
        </h2>
        <div
          :id="`collapse${item.id}`"
          class="accordion-collapse collapse"
          :aria-labelledby="`heading${item.id}`"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <ContentText
              :data="{
                __component: 'content.text',
                id: item.id,
                text: item.text
              }"
              :title-as="getChildTitleAs()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import ContentText from './ContentText.vue'

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

interface AccordionItem {
  id: number
  title: string
  text: RichTextElementData[]
}

interface ContentAccordionData {
  __component: string
  id: number
  title?: string
  items: AccordionItem[]
  color?: 'primary' | 'secondary' | 'tertiary' | 'loop'
}

interface Props {
  data: ContentAccordionData
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4'
}

const props = defineProps<Props>()

const getChildTitleAs = () => {
  // If the accordion has a title with a specific heading level,
  // child content should use the next level down
  if (props.titleAs === 'h1') return 'h2'
  if (props.titleAs === 'h2') return 'h3'
  if (props.titleAs === 'h3') return 'h4'
  return 'h4' // Default fallback
}

const getButtonColorClass = (index: number) => {
  const color = props.data.color || 'tertiary'

  if (color === 'loop') {
    // Loop through primary, secondary, tertiary
    const colors = ['tertiary', 'primary', 'secondary']
    return `accordion-button--${colors[index % 3]}`
  }

  return `accordion-button--${color}`
}
</script>

<style scoped>
.content-accordion {
  margin-bottom: 2rem;
}

.content-accordion__title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.accordion {
  margin-top: 1rem;
}

.accordion-item {
  border: 0;
  border-radius: 0.5rem;
  margin-bottom: 15px;
  overflow: hidden;
  background: transparent;
}

.accordion-item:last-child {
  margin-bottom: 0;
}

.accordion-header {
  margin: 0;
}

.accordion-button {
  border-radius: 10px;
  background: var(--Blue-Grey, #cfe0fc);
  border: none;
  color: #1f2937;
  font-weight: 600;
  padding: 1rem 1.25rem;
  width: 100%;
  text-align: left;
  transition: background-color 0.15s ease-in-out;
  box-shadow: none !important;
  line-height: 130%;
}

.accordion-button--primary {
  background: var(--Green, #44b08e);
}

.accordion-button--secondary {
  background: var(--Resilience-fosc, #f3c857);
}

.accordion-button--tertiary {
  background: var(--Blue-Grey, #cfe0fc);
}

.accordion-button:not(.collapsed) {
  background: var(--Blue-Grey, #cfe0fc);
  color: #000;
}

.accordion-button:not(.collapsed).accordion-button--primary {
  background: var(--Green, #44b08e);
}

.accordion-button:not(.collapsed).accordion-button--secondary {
  background: var(--Resilience-fosc, #f3c857);
}

.accordion-button:not(.collapsed).accordion-button--tertiary {
  background: var(--Blue-Grey, #cfe0fc);
}

.accordion-button::after {
  content: '';
  width: 1.25rem;
  height: 1.25rem;
  margin-left: auto;
  background-image: url("data:image/svg+xml,%3csvg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0_71_3458' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='25'%3e%3crect y='0.566162' width='24' height='24' fill='%23D9D9D9'/%3e%3c/mask%3e%3cg mask='url(%23mask0_71_3458)'%3e%3cpath d='M11 21.5662V13.5662H3V11.5662H11V3.56616H13V11.5662H21V13.5662H13V21.5662H11Z' fill='%231C1B1F'/%3e%3c/g%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-size: 1.25rem;
  transition: transform 0.2s ease-in-out;
}

.accordion-button:not(.collapsed)::after {
  background-image: url("data:image/svg+xml,%3csvg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0_96_567' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='25'%3e%3crect y='0.712402' width='24' height='24' fill='%23D9D9D9'/%3e%3c/mask%3e%3cg mask='url(%23mask0_96_567)'%3e%3cpath d='M5 13.7124V11.7124H19V13.7124H5Z' fill='%231C1B1F'/%3e%3c/g%3e%3c/svg%3e");
  transform: none;
}

.accordion-collapse {
  transition: height 0.35s ease;
}

.accordion-body {
  padding: 1.25rem;
  background-color: white;
}

/* Override ContentText margins within accordion */
.accordion-body :deep(.content-text) {
  margin-bottom: 0;
}

.accordion-body :deep(.content-text__body) {
  margin-top: 0;
}
</style>
