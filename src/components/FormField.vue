<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineProps({
  label: {
    type: String,
    default: null
  },
  labelFor: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  },
  info: {
    type: String,
    default: null
  },
  css: {
    type: String,
    default: 'col-12'
  }
})

const slots = useSlots()

const wrapperClass = computed(() => {
  const base = []
  const slotsLength = slots.default ? slots.default?.().length : 0

  if (slotsLength > 1) {
    base.push('grid grid-cols-1 gap-3')
  }

  if (slotsLength === 2) {
    base.push('md:grid-cols-2')
  }

  return base
})
</script>

<template>
  <div :class="css">
    <label v-if="label" :for="labelFor" class="block font-bold mb-1">{{ label }}</label>
    <div :class="wrapperClass">
      <slot />
    </div>
    <div v-if="help" class="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-1 color-error">
      {{ help }}
    </div>
    <div v-if="info" class="text-xs text-gray-500 dark:text-slate-400 mt-1 information">
      {{ info }}
    </div>
  </div>
</template>

<style scoped>
.color-error {
  font-size: 16px;
  color: #f66;
  color: var(--danger-main, #a82525);
  color: #f57356;
  
  line-height: 16px;
}
.information {
  font-size: 1rem;
  color: #0450cd !important;
}
label{
  font-size: 16px;
}
</style>
