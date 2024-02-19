<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  path: {
    type: String,
    required: true
  },
  w: {
    type: String,
    default: 'w-6'
  },
  h: {
    type: String,
    default: 'h-6'
  },
  size: {
    type: [String, Number],
    default: null
  },
  color: {
    type: String,
    dafault: 'currentColor'
  },
  colorHover: {
    type: String,
    dafault: 'currentColor'
  }
})

const spanClass = computed(() => `d-inline-flex justify-center items-center ${props.w} ${props.h}`)

const iconSize = computed(() => props.size ?? 16)

const iconColor = ref(props.color)
const mouseover = () => {
  iconColor.value = props.colorHover
}
const mouseout = () => {
  iconColor.value = props.color
}
</script>

<template>
  <span :class="spanClass">
    <svg
      viewBox="0 0 24 24"
      :width="iconSize"
      :height="iconSize"
      class="inline-block"
      @mouseover="mouseover"
      @mouseout="mouseout"
    >
      <path :fill="iconColor" :d="path" />
    </svg>
    <slot />
  </span>
</template>
<style scoped>
span {
  right: 8px;
  top: 14px;
}
</style>
