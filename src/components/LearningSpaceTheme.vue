<template>
  <div style="display: none;">
    <!-- This component dynamically injects theme styles -->
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

interface Props {
  themeStyles?: string
}

const props = defineProps<Props>()

let styleElement: HTMLStyleElement | null = null
const styleId = 'learning-space-theme-styles'

const injectStyles = (styles: string) => {
  // Remove existing style element if it exists
  removeStyles()
  
  if (styles && styles.trim()) {
    // Create new style element
    styleElement = document.createElement('style')
    styleElement.id = styleId
    styleElement.textContent = styles
    document.head.appendChild(styleElement)
  }
}

const removeStyles = () => {
  // Remove existing style element
  const existingStyle = document.getElementById(styleId)
  if (existingStyle) {
    existingStyle.remove()
  }
  styleElement = null
}

// Watch for changes in themeStyles prop
watch(
  () => props.themeStyles,
  (newStyles) => {
    if (newStyles) {
      injectStyles(newStyles)
    } else {
      removeStyles()
    }
  },
  { immediate: true }
)

// Inject styles on mount
onMounted(() => {
  if (props.themeStyles) {
    injectStyles(props.themeStyles)
  }
})

// Clean up on unmount
onUnmounted(() => {
  removeStyles()
})
</script>