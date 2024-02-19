<script setup lang="ts">
import { computed } from 'vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'

const props = defineProps({
  options: {
    type: Object,
    default: () => []
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'checkbox',
    validator: (value: string) => ['checkbox', 'radio', 'switch'].includes(value)
  },
  componentClass: {
    type: String,
    default: null
  },
  isColumn: Boolean,
  modelValue: {
    type: [Array, String, Number, Boolean],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div class="flex justify-start flex-wrap mb-1" :class="{ 'd-flex': isColumn }">
    <FormCheckRadio
      v-for="(value, key) in options"
      :key="key"
      v-model="computedValue"
      :type="type"
      :name="name"
      :input-value="value.id || key"
      :label="value.name || value"
      :class="componentClass"
      class="mr-6 zmb-3 last:mr-0"
      :value="value"
    >
    <template #value="value">
      <slot name="value" v-bind="value"></slot>
    </template>
    
  </FormCheckRadio>


  </div>
</template>
